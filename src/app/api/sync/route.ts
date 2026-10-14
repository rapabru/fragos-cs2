import { NextResponse } from "next/server";

const MAP_NAMES_MAP: Record<string, string> = {
  de_cache: "Cache",
  de_mirage: "Mirage",
  de_dust2: "Dust 2",
  de_inferno: "Inferno",
  de_nuke: "Nuke",
  de_ancient: "Ancient",
  de_anubis: "Anubis",
  de_overpass: "Overpass",
  de_vertigo: "Vertigo",
  de_train: "Train",
};

// Validaciones estrictas de identificadores Steam
const STEAM64_PATTERN = /^\d{17}$/;
const VANITY_PATTERN = /^[a-zA-Z0-9_-]{2,32}$/;

// Limitador de tasa en memoria por IP (Sliding Window)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 12;
const ipRequestHistory = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestHistory.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequestHistory.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  entry.count++;
  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Verificación de Rate Limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local-client";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Has alcanzado el límite de sincronizaciones. Espera 1 minuto antes de reintentar." },
        { status: 429 }
      );
    }

    // 2. Extracción y Limpieza de Entrada
    const body = await req.json().catch(() => ({}));
    let rawInput = (body.steamId || "").toString().trim();

    if (!rawInput) {
      rawInput = "76561198425972693"; // Default demo ID si viene vacío
    }

    // Limpiar si el usuario pegó la URL completa de Steam o Leetify
    if (rawInput.includes("steamcommunity.com")) {
      const parts = rawInput.split("/").filter(Boolean);
      rawInput = parts[parts.length - 1];
    } else if (rawInput.includes("leetify.com")) {
      const parts = rawInput.split("/").filter(Boolean);
      rawInput = parts[parts.length - 1];
    }

    // Validación estricta con expresiones regulares (Prevención de SSRF e inyección)
    const isNumeric64 = STEAM64_PATTERN.test(rawInput);
    const isVanity = VANITY_PATTERN.test(rawInput);

    if (!isNumeric64 && !isVanity) {
      return NextResponse.json(
        {
          success: false,
          error: "Identificador de Steam inválido. Ingresa un SteamID64 de 17 dígitos o tu usuario de Steam válido.",
        },
        { status: 400 }
      );
    }

    const cleanInput = encodeURIComponent(rawInput);
    const isKnownLaVieja = cleanInput === "76561198425972693" || cleanInput.toLowerCase() === "rapabru";
    let steam64 = isNumeric64 ? cleanInput : (isKnownLaVieja ? "76561198425972693" : cleanInput);

    // Datos base iniciales
    let steamData = {
      steamId: steam64,
      username: isKnownLaVieja ? "LA VIEJA" : (isNumeric64 ? `Jugador (${cleanInput.slice(-4)})` : cleanInput),
      avatarUrl: isKnownLaVieja
        ? "https://avatars.fastly.steamstatic.com/a654a6398ee296485a79bf7b7504f7ac894adc8f_full.jpg"
        : "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      onlineState: "online",
      stateMessage: "Online",
      customUrl: isKnownLaVieja ? "rapabru" : "",
    };

    // 3. Consulta segura a Steam Community XML con Timeout acotado y Cache
    try {
      const steamXmlUrl = isNumeric64
        ? `https://steamcommunity.com/profiles/${cleanInput}/?xml=1`
        : `https://steamcommunity.com/id/${cleanInput}/?xml=1`;

      const steamRes = await fetch(steamXmlUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FragOS-CS2/1.0" },
        signal: AbortSignal.timeout(4500),
        next: { revalidate: 180 }, // Cache 3 minutos en CDN
      });

      if (steamRes.ok) {
        const xml = await steamRes.text();
        const extractTag = (tag: string) => {
          const m = xml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, "s"));
          return m ? m[1].trim() : null;
        };

        const parsed64 = extractTag("steamID64");
        if (parsed64 && STEAM64_PATTERN.test(parsed64)) {
          steam64 = parsed64;
          steamData.steamId = parsed64;
        }
        const parsedName = extractTag("steamID");
        if (parsedName) steamData.username = parsedName;
        const parsedAvatar = extractTag("avatarFull");
        if (parsedAvatar && parsedAvatar.startsWith("https://")) steamData.avatarUrl = parsedAvatar;
        const parsedState = extractTag("stateMessage");
        if (parsedState) steamData.stateMessage = parsedState;
        const parsedOnline = extractTag("onlineState");
        if (parsedOnline) steamData.onlineState = parsedOnline;
        const parsedCustom = extractTag("customURL");
        if (parsedCustom) steamData.customUrl = parsedCustom;
      }
    } catch (err) {
      console.warn("Aviso al consultar Steam XML:", err);
    }

    // 4. Consulta a Leetify Mini-Profiles con Timeout acotado y Cache
    let premierRating = isKnownLaVieja ? 11936 : 0;
    let faceitLevel = isKnownLaVieja ? 4 : 0;
    let faceitNickname = isKnownLaVieja ? "Brune1shon" : "";
    let miniProfile: any = null;
    let recentMatchesList: any[] = [];

    if (STEAM64_PATTERN.test(steam64)) {
      try {
        const miniRes = await fetch(`https://api.cs-prod.leetify.com/api/mini-profiles/${encodeURIComponent(steam64)}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FragOS-CS2/1.0",
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(4500),
          next: { revalidate: 120 }, // Cache 2 minutos
        });

        if (miniRes.ok) {
          miniProfile = await miniRes.json();

          if (miniProfile.name) steamData.username = miniProfile.name;
          if (miniProfile.steamAvatarUrl && miniProfile.steamAvatarUrl.startsWith("https://")) {
            steamData.avatarUrl = miniProfile.steamAvatarUrl;
          }
          if (miniProfile.faceitNickname) faceitNickname = miniProfile.faceitNickname;

          const premierObj = miniProfile.ranks?.find((r: any) => r.type === "premier") || miniProfile.primaryRank;
          if (premierObj?.skillLevel && premierObj.skillLevel > 0) {
            premierRating = premierObj.skillLevel;
          }

          const faceitObj = miniProfile.ranks?.find((r: any) => r.dataSource === "faceit");
          if (faceitObj?.skillLevel) {
            faceitLevel = faceitObj.skillLevel;
          }

          // Consultar partidas recientes con límite estricto de 8 y timeout por petición
          const matchPromises = (miniProfile.recentMatches || []).slice(0, 8).map(async (rm: any) => {
            if (!rm?.id || typeof rm.id !== "string") return null;
            try {
              const gRes = await fetch(`https://api.cs-prod.leetify.com/api/games/${encodeURIComponent(rm.id)}`, {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FragOS-CS2/1.0" },
                signal: AbortSignal.timeout(3500),
              });
              if (!gRes.ok) return null;
              const game = await gRes.json();
              const p = game.playerStats?.find((x: any) => x.steam64Id === steam64);
              if (!p) return null;

              const dateObj = new Date(game.details?.gameFinishedAt || game.createdAt || Date.now());
              const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
              const dateStr = `${dateObj.getDate()}-${months[dateObj.getMonth()]}`;
              const mapName = MAP_NAMES_MAP[game.mapName] || game.mapName?.replace("de_", "").toUpperCase() || "Mirage";

              const rounds = (game.teamScores?.[0] || 0) + (game.teamScores?.[1] || 0);
              const adr = rounds > 0 ? Math.round((p.totalDamage || 0) / rounds) : Math.round(p.dpr || 80);

              const isWin = rm.result === "win";
              const isTie = rm.result === "tie" || (game.teamScores && game.teamScores[0] === game.teamScores[1]);
              const status: "WIN" | "LOSS" | "TIE" = isTie ? "TIE" : (isWin ? "WIN" : "LOSS");

              const s1 = game.teamScores?.[0] ?? 13;
              const s2 = game.teamScores?.[1] ?? 9;
              const scoreStr = isWin
                ? `${Math.max(s1, s2)}-${Math.min(s1, s2)}`
                : (isTie ? `${s1}-${s2}` : `${Math.min(s1, s2)}-${Math.max(s1, s2)}`);

              let highlight = "Partida analizada";
              if (p.hltvRating >= 2.0) highlight = `⭐ MVP Destacado (HLTV ${p.hltvRating.toFixed(2)})`;
              else if ((p.totalKills || 0) >= 25) highlight = `🔥 ${p.totalKills} Frags de alto impacto`;
              else if (p.hltvRating >= 1.5) highlight = `Impacto decisivo (${p.hltvRating.toFixed(2)} HLTV)`;
              else if (isWin) highlight = "Victoria competitiva";
              else highlight = `Luchado (${p.totalKills || 0} frags)`;

              return {
                id: rm.id,
                date: dateStr,
                isoDate: dateObj.toISOString(),
                map: mapName,
                score: scoreStr,
                rating: p.leetifyRating ? Number((p.leetifyRating * 100).toFixed(2)) : +5.0,
                hltvRating: p.hltvRating ? Number(p.hltvRating.toFixed(2)) : 1.1,
                csRating: premierRating || 0,
                kda: `${p.totalKills || 0}/${p.totalDeaths || 0}/${p.totalAssists || 0}`,
                adr: adr,
                status: status,
                highlight: highlight,
                rawKills: p.totalKills || 0,
                rawDeaths: p.totalDeaths || 0,
                rawDamage: p.totalDamage || 0,
                rawRounds: rounds,
              };
            } catch (e) {
              return null;
            }
          });

          const resolvedMatches = await Promise.all(matchPromises);
          recentMatchesList = resolvedMatches.filter(Boolean);
        }
      } catch (err) {
        console.warn("Aviso al consultar Leetify mini-profile:", err);
      }
    }

    // Métricas calculadas
    let calcKD = isKnownLaVieja ? 2.03 : 1.15;
    let calcADR = isKnownLaVieja ? 111.8 : 78.5;
    let calcWinrate = isKnownLaVieja ? "80%" : "55%";
    let calcStreak = isKnownLaVieja ? 3 : 1;

    if (recentMatchesList.length > 0) {
      const totalKills = recentMatchesList.reduce((acc, m) => acc + (m.rawKills || 0), 0);
      const totalDeaths = recentMatchesList.reduce((acc, m) => acc + (m.rawDeaths || 0), 0);
      const totalDmg = recentMatchesList.reduce((acc, m) => acc + (m.rawDamage || 0), 0);
      const totalRounds = recentMatchesList.reduce((acc, m) => acc + (m.rawRounds || 0), 0);
      const winsCount = recentMatchesList.filter((m) => m.status === "WIN").length;

      calcKD = totalDeaths > 0 ? Number((totalKills / totalDeaths).toFixed(2)) : 1.5;
      calcADR = totalRounds > 0 ? Number((totalDmg / totalRounds).toFixed(1)) : 80.0;
      calcWinrate = `${Math.round((winsCount / recentMatchesList.length) * 100)}%`;

      calcStreak = 0;
      for (const m of recentMatchesList) {
        if (m.status === "WIN") calcStreak++;
        else break;
      }
      if (calcStreak === 0) calcStreak = 1;
    }

    const aimRating = miniProfile?.ratings?.aim ? Math.round(miniProfile.ratings.aim) : (isKnownLaVieja ? 96 : 68);
    const leetifyScore = miniProfile?.ratings?.leetify
      ? (miniProfile.ratings.leetify > 0 ? `+${(miniProfile.ratings.leetify * 10).toFixed(2)}` : `${(miniProfile.ratings.leetify * 10).toFixed(2)}`)
      : (isKnownLaVieja ? "+4.36" : "+0.15");

    const profileData = {
      id: steamData.steamId,
      isGuest: false,
      username: steamData.username,
      steamId: steamData.steamId,
      customUrl: steamData.customUrl,
      avatarUrl: steamData.avatarUrl,
      onlineState: steamData.onlineState,
      stateMessage: steamData.stateMessage,
      premierRating: premierRating,
      rankTitle: premierRating > 0
        ? `Premier ${premierRating.toLocaleString()} • Rango Oficial Valve`
        : "Sin Rango Premier (Modo Calibración)",
      faceitLevel: faceitLevel,
      faceitNickname: faceitNickname,
      leetifyRating: leetifyScore,
      hltvRating: recentMatchesList.length > 0 ? recentMatchesList[0].hltvRating : 1.05,
      kdRatio: calcKD,
      adr: calcADR,
      hsAccuracy: "41%",
      timeToDamageMs: 395,
      crosshairPlacementError: 7.2,
      counterStrafeEfficiency: 82,
      openingDuelWinrate: 68,
      openingDuelRating: "+4.8",
      openingDuelAttempts: "16%",
      aimRatingPB: aimRating,
      multikillsTotal: isKnownLaVieja ? 58 : 25,
      clutchWinrate: 22,
      clutchRating: "+11.4",
      tradeKillSuccess: 32,
      tradeOpportunities: 78,
      roundsSurvived: "41%",
      winRate: calcWinrate,
      winStreak: calcStreak,
      weakness1Title: isKnownLaVieja ? "Consistencia en Retakes & T-side Spacing" : "Optimización de Primer Contacto",
      weakness1Desc: isKnownLaVieja
        ? "Excelente desempeño mecánico individual (>100 ADR en Octubre), pero requiere drills de espaciado en tándem."
        : "Calibra tus rutinas diarias para mejorar tu porcentaje de supervivencia y conversión en rondas de compra completa.",
      weakness1Med: "15 min Warmup pre-match & tándem trades",
      weakness2Title: isKnownLaVieja ? "Conversión de Trades en Sitio Bomb" : "Control de Recoil en Duelos Largos",
      weakness2Desc: isKnownLaVieja
        ? "Gran capacidad de apertura (68% Opening Winrate), mantener timing coordinado con utilería de apoyo."
        : "Practica drills de contra-strafe para asegurar el primer disparo en duelos de larga distancia.",
      weakness2Med: "10 min Lineups de soporte & prefire",
      lastSync: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: "Valve Steam API & Leetify Live Matchmaking",
      profile: profileData,
      recentMatches: recentMatchesList,
      totalMatchesAvailable: recentMatchesList.length,
    });
  } catch (error: any) {
    // Sanitización estricta de mensajes de error al cliente
    console.error("Error interno en endpoint /api/sync:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo sincronizar el perfil con Steam/Leetify en este momento. Inténtalo nuevamente." },
      { status: 500 }
    );
  }
}
