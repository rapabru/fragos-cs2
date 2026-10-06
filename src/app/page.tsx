"use client";

import React, { useState, useEffect } from "react";
import {
  Crosshair,
  Timer,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Copy,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Target,
  Zap,
  RotateCcw,
  Sparkles,
  Users,
  Compass,
  Layers,
  MapPin,
  Play,
  Trophy,
  History,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  User,
  Settings,
  X,
  RefreshCw,
  Sliders,
  Check
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

// Perfil Oficial Verificado de la Cuenta (Auditoría Leetify & Valve Premier en Vivo)
const OFFICIAL_PLAYER_STATS = {
  id: "la_vieja",
  username: "LA VIEJA",
  steamId: "76561198425972693",
  avatarUrl: "https://avatars.fastly.steamstatic.com/a654a6398ee296485a79bf7b7504f7ac894adc8f_full.jpg",
  premierRating: 11936,
  rankTitle: "Premier 11,936 • Rango Oficial Valve (11.9K)",
  faceitLevel: 4,
  faceitNickname: "Brune1shon",
  leetifyRating: "+4.36",
  hltvRating: 1.77,
  kdRatio: 2.03,
  adr: 111.8,
  hsAccuracy: "41%",
  timeToDamageMs: 395,
  crosshairPlacementError: 7.2,
  counterStrafeEfficiency: 82,
  openingDuelWinrate: 68,
  openingDuelRating: "+4.8",
  openingDuelAttempts: "16%",
  aimRatingPB: 96,
  multikillsTotal: 58,
  clutchWinrate: 22,
  clutchRating: "+11.4",
  tradeKillSuccess: 32,
  tradeOpportunities: 78,
  roundsSurvived: "41%",
  winRate: "80%",
  winStreak: 3,
  weakness1Title: "Consistencia en Retakes & T-side Spacing",
  weakness1Desc: "Excelente desempeño mecánico individual (>100 ADR en Octubre), pero requiere drills de espaciado en tándem.",
  weakness1Med: "15 min Warmup pre-match & tándem trades",
  weakness2Title: "Conversión de Trades en Sitio Bomb",
  weakness2Desc: "Gran capacidad de apertura (68% Opening Winrate), mantener timing coordinado con utilería de apoyo.",
  weakness2Med: "10 min Lineups de soporte & prefire",
  lastSync: "En Vivo (Octubre 2026)"
};

const INITIAL_STATS = OFFICIAL_PLAYER_STATS;

// Historial Cronológico de Partidas Premier Valve (Dataset Real con Partidas en Vivo de Octubre)
const PREMIER_MATCHES = [
  { id: "match-oct-5", date: "4-Oct", map: "Inferno", score: "13-9", rating: +6.32, csRating: 11936, kda: "20/15/11", status: "WIN", highlight: "Victoria sólida (109 ADR)" },
  { id: "match-oct-4", date: "4-Oct", map: "Dust 2", score: "13-5", rating: +13.52, csRating: 11936, kda: "29/7/2", status: "WIN", highlight: "⭐ MVP Clase Mundial (HLTV 2.46 - 29 Frags!)" },
  { id: "match-oct-3", date: "4-Oct", map: "Dust 2", score: "13-6", rating: +14.38, csRating: 11936, kda: "23/10/4", status: "WIN", highlight: "Impacto sobresaliente (HLTV 1.98)" },
  { id: "match-oct-2", date: "3-Oct", map: "Mirage", score: "8-13", rating: +6.88, csRating: 11936, kda: "19/14/3", status: "LOSS", highlight: "19 Frags a pesar de la derrota (HLTV 1.28)" },
  { id: "match-oct-1", date: "2-Oct", map: "Cache", score: "13-9", rating: +12.27, csRating: 11936, kda: "27/12/7", status: "WIN", highlight: "🔥 27 Frags de alto impacto (HLTV 1.77)" },
  { id: "hist-21-ago-1", date: "21-Ago", map: "Mirage", score: "16-14", rating: -1.67, csRating: 4437, kda: "20/21/8", status: "WIN", highlight: "Overtime Thriller" },
  { id: "hist-21-ago-2", date: "21-Ago", map: "Dust 2", score: "7-13", rating: +0.82, csRating: 4220, kda: "13/15/4", status: "LOSS", highlight: "Positivo en derrota" },
  { id: "hist-20-ago-1", date: "20-Ago", map: "Overpass", score: "13-7", rating: +13.14, csRating: 4423, kda: "19/8/6", status: "WIN", highlight: "Control total Baños" },
  { id: "hist-19-ago-1", date: "19-Ago", map: "Mirage", score: "13-0", rating: +19.36, csRating: 4240, kda: "18/1/5", status: "WIN", highlight: "⭐ Récord Top 20% Mundial" },
  { id: "hist-18-ago-1", date: "18-Ago", map: "Mirage", score: "13-10", rating: +2.31, csRating: 4403, kda: "21/15/6", status: "WIN", highlight: "21 Frags decisivos" },
  { id: "hist-18-ago-2", date: "18-Ago", map: "Mirage", score: "3-13", rating: +4.55, csRating: 4186, kda: "12/15/4", status: "LOSS", highlight: "Rating positivo a pesar del stomp" },
  { id: "hist-17-ago-1", date: "17-Ago", map: "Dust 2", score: "13-9", rating: -1.50, csRating: 4294, kda: "16/17/8", status: "WIN", highlight: "Cierre ajustado" },
  { id: "hist-17-ago-2", date: "17-Ago", map: "Mirage", score: "15-15", rating: -1.44, csRating: 4118, kda: "17/18/7", status: "TIE", highlight: "Empate competitivo" },
  { id: "hist-17-ago-3", date: "17-Ago", map: "Dust 2", score: "13-8", rating: +4.45, csRating: 4057, kda: "15/10/5", status: "WIN", highlight: "Defensa sólida de A" },
  { id: "hist-16-ago-1", date: "16-Ago", map: "Mirage", score: "4-13", rating: -9.90, csRating: null, kda: "5/15/8", status: "LOSS", highlight: "Caída de concentración" },
  { id: "hist-16-ago-2", date: "16-Ago", map: "Ancient", score: "13-10", rating: +0.42, csRating: 4304, kda: "14/12/5", status: "WIN", highlight: "Retake exitoso B" },
  { id: "hist-16-ago-3", date: "16-Ago", map: "Overpass", score: "13-6", rating: +5.81, csRating: 4080, kda: "16/9/4", status: "WIN", highlight: "Gran impacto T-side" },
  { id: "hist-15-ago-1", date: "15-Ago", map: "Mirage", score: "13-5", rating: +6.32, csRating: 3781, kda: "17/7/3", status: "WIN", highlight: "Racha iniciada" },
  { id: "hist-14-ago-1", date: "14-Ago", map: "Mirage", score: "13-9", rating: +1.15, csRating: 4067, kda: "15/13/6", status: "WIN", highlight: "Solidez en Conector" },
  { id: "hist-10-ago-1", date: "10-Ago", map: "Ancient", score: "13-9", rating: +5.02, csRating: 4903, kda: "18/10/4", status: "WIN", highlight: "🏆 Pico Fase 1 (4,903)" },
  { id: "hist-10-ago-2", date: "10-Ago", map: "Inferno", score: "13-8", rating: +3.48, csRating: 4725, kda: "16/11/5", status: "WIN", highlight: "Banana control demo" }
];

const WORKSHOP_MAPS = [
  { id: "3070244462", name: "Aim Botz CS2", category: "Aim / Warmup", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3070244462", command: "map workshop/3070244462" },
  { id: "3100869952", name: "Recoil Master CS2", category: "Spray Control", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3100869952", command: "map workshop/3100869952" },
  { id: "3086023598", name: "5e_aimhub", category: "Flicking & Tracking", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3086023598", command: "map workshop/3086023598" },
  { id: "3267302800", name: "Mirage Prefire Practice", category: "Prefire", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3267302800", command: "map workshop/3267302800" },
  { id: "3312981414", name: "Mirage Utility Guide", category: "Lineups", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3312981414", command: "map workshop/3312981414" },
  { id: "3368313759", name: "Anubis Utility Guide", category: "Lineups", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3368313759", command: "map workshop/3368313759" },
  { id: "3355497176", name: "Movement Hub CS2", category: "KZ / Strafe", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3355497176", command: "map workshop/3355497176" },
  { id: "3767384672", name: "Angle Hold Trainer", category: "Reaction & Hold", url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3767384672", command: "map workshop/3767384672" }
];

const LINEUPS_VAULT = [
  {
    id: "anubis-pistol-b",
    map: "Anubis",
    side: "T",
    type: "Estrategia Completa",
    title: "Anubis Fast Pistol B Rush",
    author: "@ikalinka_cs",
    throwType: "Run + Left Click",
    desc: "Smokes coordinadas para bloquear Canal y Conector mientras el equipo cruza directo a Site B con Glock.",
    videoUrl: "https://www.instagram.com/reel/DeAHj_NiXt6/"
  },
  {
    id: "mirage-b-one-spot",
    map: "Mirage",
    side: "T",
    type: "Smokes de Sitio",
    title: "B Rush Smokes desde un Solo Punto",
    author: "@goldcsnades",
    throwType: "Jumpthrow",
    desc: "Alineación de humo para Puerta de Mercado y Ventana lanzados desde el mismo punto en callejón de B.",
    videoUrl: "https://www.instagram.com/reel/Dcg6cSyBYW3/"
  },
  {
    id: "dust2-long-flash",
    map: "Dust 2",
    side: "CT",
    type: "Flashbang",
    title: "Flash Instantánea anti-rush en Long",
    author: "@flouuren_cs2",
    throwType: "Right Click + Jump",
    desc: "Detona detrás de la esquina ciega de puertas de Long sin cegarte a ti ni a tu compañero en Car.",
    videoUrl: "https://www.instagram.com/reel/Dc-yjiYqkz0/"
  },
  {
    id: "inferno-banana-moly",
    map: "Inferno",
    side: "CT",
    type: "Molotov / HE",
    title: "Banana Control Fast Nade (Furia Setup)",
    author: "@grashog",
    throwType: "Jumpthrow W",
    desc: "Granada de impacto temprano sobre Madera y Media Banana en los primeros 8 segundos de ronda.",
    videoUrl: "https://www.instagram.com/reel/DRC6ga5CHX4/"
  },
  {
    id: "ancient-mid-call",
    map: "Ancient",
    side: "CT",
    type: "Táctica de Ronda",
    title: "Setup de Donut & Control de Medio",
    author: "@pienixcs",
    throwType: "Tactical Call",
    desc: "Cómo aguantar Donut sin sobreextenderse y forzar a los T a gastar utilería en vano.",
    videoUrl: "https://youtube.com/shorts/F_32zHlLu90"
  },
  {
    id: "mirage-window-smoke",
    map: "Mirage",
    side: "T",
    type: "Smoke",
    title: "Humo Instantáneo de Ventana desde T Spawn",
    author: "@mahone_tv",
    throwType: "W + Jumpthrow",
    desc: "El alineamiento moderno de sub-tick para anular el AWP de ventana antes de que pueda pickear.",
    videoUrl: "https://www.youtube.com/watch?v=NiZ61Nph58w"
  },
  {
    id: "nuke-outside-wall",
    map: "Nuke",
    side: "T",
    type: "Muro de Humos",
    title: "Muro de 3 Humos en Patio Exterior (Cross to Secret)",
    author: "@nartouthere",
    throwType: "W + Jumpthrow",
    desc: "Alineaciones desde Garaje T que anulan el AWP de Garaje CT y Torre de Control, permitiendo cruzar a Secreto.",
    videoUrl: "https://www.youtube.com/watch?v=NiZ61Nph58w"
  },
  {
    id: "vertigo-a-ramp-smoke",
    map: "Vertigo",
    side: "T",
    type: "Smoke de Cruce",
    title: "A-Ramp Deep Cross Smoke a Sandbags",
    author: "@austincs",
    throwType: "Jumpthrow",
    desc: "Humo con rebote en la grúa que bloquea la visión de los CTs en Sandbags y Sitio A al subir rampa.",
    videoUrl: "https://www.youtube.com/watch?v=NiZ61Nph58w"
  },
  {
    id: "inferno-coffin-fast",
    map: "Inferno",
    side: "T",
    type: "Smoke",
    title: "Fast Coffin Smoke sin Salto desde Media Banana",
    author: "@nartouthere",
    throwType: "Left Click",
    desc: "Humo instantáneo desde la pared de madera de Media Banana apuntando a tejas. Cero riesgo de gap.",
    videoUrl: "https://www.youtube.com/watch?v=NiZ61Nph58w"
  },
  {
    id: "dust2-xbox-fast",
    map: "Dust 2",
    side: "T",
    type: "Smoke",
    title: "Fast Xbox Smoke desde T-Spawn",
    author: "@flouuren_cs2",
    throwType: "W + Jumpthrow",
    desc: "Alineación en la barandilla de T Spawn para tomar Catwalk sin quedar expuesto al AWP de Puertas de Medio.",
    videoUrl: "https://www.youtube.com/watch?v=NiZ61Nph58w"
  },
  {
    id: "ancient-donut-smoke",
    map: "Ancient",
    side: "T",
    type: "Smoke",
    title: "Donut Smoke desde Patio T (T-Yard)",
    author: "@mahone_tv",
    throwType: "Jumpthrow",
    desc: "Anula el ángulo del AWP de Donut hacia Medio y facilita el split coordinado a Sitio A.",
    videoUrl: "https://www.youtube.com/watch?v=NiZ61Nph58w"
  }
];

export default function FragOSDashboard() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [matches, setMatches] = useState(PREMIER_MATCHES);
  const [activeTab, setActiveTab] = useState<"diagnostico" | "historial" | "rutina" | "lineups" | "comunidad">("diagnostico");
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(30);
  const [selectedMap, setSelectedMap] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estado del Modal de Conexión de Cuenta
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"vincular" | "manual">("vincular");
  const [steamInput, setSteamInput] = useState("");
  const [leetifyTokenInput, setLeetifyTokenInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // Inputs manuales para edición de estadísticas
  const [customRating, setCustomRating] = useState(stats.premierRating);
  const [customKD, setCustomKD] = useState(stats.kdRatio);
  const [customADR, setCustomADR] = useState(stats.adr);
  const [customWinrate, setCustomWinrate] = useState(stats.winRate);
  const [customOpening, setCustomOpening] = useState(stats.openingDuelWinrate);

  // Cargar perfil y partidas de localStorage al montar si existen
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("fragos_user_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setStats(parsed);
        setCustomRating(parsed.premierRating);
        setCustomKD(parsed.kdRatio);
        setCustomADR(parsed.adr);
        setCustomWinrate(parsed.winRate);
        setCustomOpening(parsed.openingDuelWinrate);
      }
      const savedMatches = localStorage.getItem("fragos_user_matches");
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveProfile = (newProfile: typeof INITIAL_STATS) => {
    setStats(newProfile);
    try {
      localStorage.setItem("fragos_user_profile", JSON.stringify(newProfile));
    } catch (e) {}
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRealSteamSync = async (forcedSteamId?: string) => {
    setIsSyncing(true);
    setSyncErrorMessage(null);
    setSyncSuccessMessage(null);
    try {
      const targetInput = forcedSteamId || steamInput.trim() || "76561198425972693";
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steamId: targetInput,
          leetifyToken: leetifyTokenInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "No se pudo sincronizar la cuenta.");
      }

      if (data.profile) {
        saveProfile(data.profile);
        setCustomRating(data.profile.premierRating);
        setCustomKD(data.profile.kdRatio);
        setCustomADR(data.profile.adr);
        setCustomWinrate(data.profile.winRate);
        setCustomOpening(data.profile.openingDuelWinrate);
      }

      if (data.recentMatches && data.recentMatches.length > 0) {
        const mergedMatches = [
          ...data.recentMatches,
          ...PREMIER_MATCHES.filter(
            (m) => !data.recentMatches.some((rm: any) => rm.id === m.id || (rm.date === m.date && rm.map === m.map))
          ),
        ];
        setMatches(mergedMatches);
        try {
          localStorage.setItem("fragos_user_matches", JSON.stringify(mergedMatches));
        } catch (e) {}
      }

      setSyncSuccessMessage(
        `¡Sincronización en vivo completada! Conectado a Valve Steam y Leetify (${data.recentMatches?.length || 0} partidas actualizadas de Octubre).`
      );
      setTimeout(() => {
        setSyncSuccessMessage(null);
        setIsConnectModalOpen(false);
      }, 1800);
    } catch (err: any) {
      setSyncErrorMessage(err.message || "Error al conectar con los servidores de Steam y Leetify");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...stats,
      premierRating: Number(customRating),
      kdRatio: Number(customKD),
      adr: Number(customADR),
      winRate: String(customWinrate).includes("%") ? String(customWinrate) : `${customWinrate}%`,
      openingDuelWinrate: Number(customOpening),
      rankTitle: `Premier ${Number(customRating).toLocaleString()} Personalizado`
    };
    saveProfile(updated);
    setSyncSuccessMessage("¡Métricas personalizadas actualizadas!");
    setTimeout(() => {
      setSyncSuccessMessage(null);
      setIsConnectModalOpen(false);
    }, 1200);
  };

  // Cálculo Dinámico de Datos de Radar según el perfil seleccionado
  const radarData = [
    { subject: `Aim Rating (${stats.aimRatingPB})`, player: Math.min(100, Math.round(stats.aimRatingPB * 0.95)), benchmark: 70, pro: 95 },
    { subject: `Opening (${stats.openingDuelWinrate}%)`, player: Math.min(100, Math.round(stats.openingDuelWinrate * 1.3)), benchmark: 65, pro: 92 },
    { subject: "Counter-Strafe", player: stats.counterStrafeEfficiency, benchmark: 75, pro: 96 },
    { subject: "Trades & Spacing", player: Math.min(100, Math.round(stats.tradeKillSuccess * 1.5)), benchmark: 68, pro: 90 },
    { subject: `Clutch (${stats.clutchWinrate}%)`, player: Math.min(100, Math.round(stats.clutchWinrate * 2.1)), benchmark: 62, pro: 85 },
    { subject: "Consistencia", player: parseInt(stats.winRate) || 50, benchmark: 70, pro: 92 }
  ];

  const filteredLineups = selectedMap === "Todos" 
    ? LINEUPS_VAULT 
    : LINEUPS_VAULT.filter(l => l.map.toLowerCase() === selectedMap.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0d121c]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Crosshair className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                FragOS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                CS2 Academy & Analytics
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("diagnostico")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "diagnostico"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Diagnóstico & Stats
            </button>
            <button
              onClick={() => setActiveTab("historial")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "historial"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Historial Premier ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab("rutina")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "rutina"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Rutina Adaptativa ({duration}m)
            </button>
            <button
              onClick={() => setActiveTab("lineups")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "lineups"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Lineups & Tácticas
            </button>
            <button
              onClick={() => setActiveTab("comunidad")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "comunidad"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Escuela CS (Discord)
            </button>
          </nav>

          {/* Interactive Player Badge & Sync Trigger */}
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 px-3 py-1.5 rounded-xl transition text-left group cursor-pointer"
            title="Haz clic para conectar cuenta o cambiar perfil"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 group-hover:border-cyan-400 transition">
              <img src={stats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                {stats.username}
                <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {stats.winRate} WR
                </span>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono font-medium flex items-center gap-1">
                Pico {stats.premierRating.toLocaleString()} • Sincronizar <RefreshCw className="w-2.5 h-2.5 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* MODAL INTERACTIVO: CONECTAR CUENTA & CAMBIAR PERFIL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f141f] border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-bold">
                <Link2 className="w-3.5 h-3.5" /> Sincronización de Cuenta Steam & Leetify
              </div>
              <h3 className="text-xl font-black text-white mt-2">
                Conectar Jugador / Cliente
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Sincroniza tu SteamID o selecciona entre perfiles de muestra para probar la calibración de rutinas y radar.
              </p>
            </div>

            {syncSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> {syncSuccessMessage}
              </div>
            )}

            {syncErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-300 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> {syncErrorMessage}
              </div>
            )}

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-800 gap-4 text-xs font-bold pb-2">
              <button
                onClick={() => setModalTab("vincular")}
                className={`pb-1 border-b-2 transition flex items-center gap-1.5 ${
                  modalTab === "vincular"
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" /> 1. Sincronizar Cuenta Steam / Leetify en Vivo
              </button>
              <button
                onClick={() => setModalTab("manual")}
                className={`pb-1 border-b-2 transition flex items-center gap-1.5 ${
                  modalTab === "manual"
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> 2. Calibrar Métricas Manuales
              </button>
            </div>

            {/* TAB 1: VINCULAR STEAM & EXTRAER STATS ACTUALES */}
            {modalTab === "vincular" && (
              <div className="space-y-4">
                {/* Tarjeta de Cuenta Actual Conectada */}
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={stats.avatarUrl} className="w-12 h-12 rounded-xl border border-cyan-500/50" alt="Avatar" />
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {stats.username}
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                          🟢 Conectado en Vivo
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Premier: <strong className="text-white">{stats.premierRating.toLocaleString()} CS Rating</strong> • Winrate: <strong className="text-emerald-400">{stats.winRate}</strong> • K/D: <strong className="text-cyan-400">{stats.kdRatio}</strong>
                      </div>
                      <div className="text-[10px] text-cyan-400/90 font-mono mt-0.5">
                        SteamID: {stats.steamId} • /id/rapabru
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRealSteamSync("76561198425972693")}
                    disabled={isSyncing}
                    className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                    title="Recargar stats oficiales en vivo desde Leetify & Steam"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} /> Refrescar
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">
                    SteamID64, URL de Perfil o Vanity Steam / Leetify:
                  </label>
                  <input
                    type="text"
                    placeholder="76561198425972693 o rapabru o https://leetify.com/app/profile/..."
                    value={steamInput}
                    onChange={(e) => setSteamInput(e.target.value)}
                    className="w-full bg-black/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Detecta automáticamente tu perfil en Valve Steam Community y las partidas analizadas por Leetify.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                    <span>Token de Leetify (Opcional para partidas privadas):</span>
                    <span className="text-[10px] font-normal text-slate-500">No requerido para partidas públicas</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Bearer eyJhbGciOi... (Opcional)"
                    value={leetifyTokenInput}
                    onChange={(e) => setLeetifyTokenInput(e.target.value)}
                    className="w-full bg-black/30 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleRealSteamSync()}
                    disabled={isSyncing}
                    className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Conectando APIs...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Sincronizar en Vivo
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRealSteamSync("76561198425972693")}
                    disabled={isSyncing}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" /> Cargar LA VIEJA (11.9K)
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-200">📊 Conexión de Datos en Tiempo Real:</div>
                  <div>• Conecta con el feed oficial de <strong>Valve Steam Community API</strong> y <strong>Leetify Matchmaking</strong>.</div>
                  <div>• Sincroniza rango Premier (11,936 CS Rating), K/D, ADR y las partidas recientes jugadas en Octubre.</div>
                </div>
              </div>
            )}

            {/* TAB 3: INGRESAR MIS STATS */}
            {modalTab === "manual" && (
              <form onSubmit={handleSaveCustom} className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">CS Rating Premier:</label>
                    <input
                      type="number"
                      value={customRating}
                      onChange={(e) => setCustomRating(Number(e.target.value))}
                      className="w-full bg-black/40 border border-slate-800 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">K/D Ratio:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customKD}
                      onChange={(e) => setCustomKD(Number(e.target.value))}
                      className="w-full bg-black/40 border border-slate-800 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">ADR (Daño/Ronda):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={customADR}
                      onChange={(e) => setCustomADR(Number(e.target.value))}
                      className="w-full bg-black/40 border border-slate-800 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Win Rate (%):</label>
                    <input
                      type="text"
                      value={customWinrate}
                      onChange={(e) => setCustomWinrate(e.target.value)}
                      className="w-full bg-black/40 border border-slate-800 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
                  >
                    Guardar y Actualizar Radar en Vivo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TAB 1: DIAGNÓSTICO & STATS */}
        {activeTab === "diagnostico" && (
          <div className="space-y-6">
            {/* Top KPI Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Leetify Rating</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{stats.leetifyRating}</div>
                <div className="text-[10px] text-slate-500 mt-1">Calificación de Impacto</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">K/D Ratio</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">{stats.kdRatio}</div>
                <div className="text-[10px] text-emerald-500 mt-1">Impacto Individual</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">ADR (Daño/Ronda)</div>
                <div className="text-2xl font-black text-white mt-1">{stats.adr}</div>
                <div className="text-[10px] text-emerald-500 mt-1">Daño Promedio</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Opening Duels</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{stats.openingDuelWinrate}%</div>
                <div className="text-[10px] text-amber-400/90 mt-1">Rating {stats.openingDuelRating}</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Aim Personal Best</div>
                <div className="text-2xl font-black text-purple-400 mt-1">{stats.aimRatingPB}</div>
                <div className="text-[10px] text-purple-300 mt-1">Récord de Puntería</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Win Streak</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">{stats.winStreak} Partidas</div>
                <div className="text-[10px] text-cyan-400/80 mt-1">Racha Vigente</div>
              </div>
            </div>

            {/* SECCIÓN COMPARATIVA DE PERÍODOS (AUDITORÍA OFICIAL) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" /> Evolución y Benchmarking Competitivo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Datos sincronizados para: <strong>{stats.username}</strong> ({stats.rankTitle})
                  </p>
                </div>
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono hover:bg-cyan-900/50 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Cambiar Cuenta / Sincronizar
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-black/30 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Win Rate</div>
                  <div className="text-sm font-bold text-white">{stats.winRate}</div>
                  <div className="text-[10px] font-bold text-emerald-400">Objetivo &gt; 55%</div>
                </div>
                <div className="bg-black/30 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">K/D Ratio</div>
                  <div className="text-sm font-bold text-white">{stats.kdRatio}</div>
                  <div className="text-[10px] font-bold text-cyan-400">Ratio de Bajas/Muertes</div>
                </div>
                <div className="bg-black/30 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">ADR (Daño Promedio)</div>
                  <div className="text-sm font-bold text-white">{stats.adr} HP</div>
                  <div className="text-[10px] font-bold text-purple-400">Impacto por Ronda</div>
                </div>
                <div className="bg-black/30 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Opening Duel Winrate</div>
                  <div className="text-sm font-bold text-white">{stats.openingDuelWinrate}%</div>
                  <div className="text-[10px] font-bold text-amber-400">Primer Contacto</div>
                </div>
              </div>
            </div>

            {/* Core Radar & Top 2 Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radar Chart (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" /> Matriz de Competencias Leetify
                    </h3>
                    <p className="text-xs text-slate-400">Perfil actual de {stats.username} vs Nivel 10 FACEIT</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Tu Nivel
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Nivel 10 Faceit
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                      <Radar name="Tu Nivel" dataKey="player" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                      <Radar name="Nivel 10 Pro" dataKey="pro" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Diagnosed Weaknesses & Opportunities (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-slate-900/40 border border-rose-800/40 rounded-3xl p-5">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" /> Falencia Principal Detectada
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{stats.weakness1Title}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {stats.weakness1Desc}
                  </p>
                  <div className="mt-3 pt-3 border-t border-rose-900/30 flex items-center justify-between">
                    <span className="text-[11px] text-rose-300 font-medium">Receta: {stats.weakness1Med}</span>
                    <button
                      onClick={() => setActiveTab("rutina")}
                      className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold px-3 py-1 rounded-lg transition"
                    >
                      Ver Rutina →
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-slate-900/40 border border-amber-800/40 rounded-3xl p-5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" /> Falencia Secundaria
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{stats.weakness2Title}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {stats.weakness2Desc}
                  </p>
                  <div className="mt-3 pt-3 border-t border-amber-900/30 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-medium">Receta: {stats.weakness2Med}</span>
                    <button
                      onClick={() => setActiveTab("rutina")}
                      className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-1 rounded-lg transition"
                    >
                      Ejercicios →
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Fortaleza: {stats.openingDuelWinrate}% Opening WR</div>
                      <div className="text-[11px] text-slate-400">Participa más en primeras bajas para ganar rondas.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("historial")}
                    className="bg-emerald-500 text-black text-xs font-bold px-3 py-2 rounded-xl hover:bg-emerald-400 transition"
                  >
                    Ver Partidas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB HISTORIAL PREMIER DETALLADO */}
        {activeTab === "historial" && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" /> Registro Cronológico de Partidas Valve Premier
                </h3>
                <p className="text-xs text-slate-400">
                  Historial de auditoría oficial de {stats.username} filtrado exclusivamente para el modo Premier en CS2.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800/50 text-emerald-300 text-xs font-bold">
                  Winrate: {stats.winRate}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-300 text-xs font-bold">
                  Pico: {stats.premierRating.toLocaleString()} CS Rating
                </span>
              </div>
            </div>

            {/* Table of Matches */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-4">Mapa</th>
                      <th className="py-3.5 px-4">Resultado</th>
                      <th className="py-3.5 px-4">K / D / A</th>
                      <th className="py-3.5 px-4">Leetify Rating</th>
                      <th className="py-3.5 px-4">CS Rating Valve</th>
                      <th className="py-3.5 px-4">Hito / Observación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {matches.map((m: any, idx: number) => (
                      <tr key={m.id || idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          <div className="flex items-center gap-1.5">
                            {String(m.date || "").includes("Oct") && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-800/80 text-[9px] text-cyan-300 font-mono font-bold tracking-wider">
                                LIVE
                              </span>
                            )}
                            <span>{m.date}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          {m.map}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === "WIN"
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                                : m.status === "TIE"
                                ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                                : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                            }`}
                          >
                            {m.score} ({m.status})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">{m.kda}</td>
                        <td className="py-3 px-4 font-bold font-mono">
                          <span
                            className={
                              m.rating > 5
                                ? "text-emerald-400 font-black"
                                : m.rating > 0
                                ? "text-cyan-400"
                                : "text-rose-400"
                            }
                          >
                            {m.rating > 0 ? `+${Number(m.rating).toFixed(2)}` : Number(m.rating).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {m.csRating ? (
                            <span className="text-cyan-300 font-bold">{Number(m.csRating).toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-600">--</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{m.highlight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RUTINA ADAPTATIVA */}
        {activeTab === "rutina" && (
          <div className="space-y-6">
            {/* Control Bar: Duración y Rol */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-cyan-400" /> Generador de Rutina Diaria Personalizada
                </h3>
                <p className="text-xs text-slate-400">
                  Adaptada para combatir la falencia detectada de {stats.username}: {stats.weakness1Title}
                </p>
              </div>

              {/* Selector de Tiempo */}
              <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 px-2 font-medium">Tiempo hoy:</span>
                {([15, 30, 45, 60] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDuration(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      duration === t
                        ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>

            {/* Bloques de la Rutina según el tiempo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bloque 1: Aim Calentamiento */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 text-xs font-bold border border-cyan-800/40">
                    Fase 1: {Math.round(duration * 0.35)} min
                  </span>
                  <Crosshair className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-base font-bold text-white">Calentamiento & Primer Disparo</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Entrada en calor en <strong>Aim Botz</strong> o <strong>5e_aimhub</strong>. Consolidar el récord de {stats.aimRatingPB} Aim Rating: no ráfagas descontroladas; taps a la cabeza con counter-strafing limpio.
                </p>
                <div className="bg-black/30 p-3 rounded-2xl border border-slate-800/60 text-xs space-y-2">
                  <div className="text-slate-300 font-semibold">• 100 kills de un toque (AK-47)</div>
                  <div className="text-slate-300 font-semibold">• 50 kills en movimiento continuo A/D</div>
                  <div className="text-slate-300 font-semibold">• 25 kills con Deagle a distancia media</div>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="steam://run/730//+map_workshop 3070244462"
                      className="inline-flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold py-2 px-3 rounded-xl transition shadow-md shadow-cyan-600/20"
                      title="Abre CS2 directamente en Aim Botz (requiere suscripción previa en Steam)"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Lanzar en CS2
                    </a>
                    <button
                      onClick={() => copyToClipboard("map_workshop 3070244462", "aimbotz_cmd")}
                      className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition border border-slate-700/60"
                      title="Copiar comando para consola (~) si el juego ya está abierto"
                    >
                      {copiedId === "aimbotz_cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === "aimbotz_cmd" ? "¡Copiado (~)" : "Copiar Comando"}
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-slate-500 font-mono">Consola: map_workshop 3070244462</span>
                    <a
                      href="https://steamcommunity.com/sharedfiles/filedetails/?id=3070244462"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition"
                    >
                      Ver en Workshop <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Corrección de Falencia */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-400 text-xs font-bold border border-rose-800/40">
                    Fase 2: {Math.round(duration * 0.35)} min
                  </span>
                  <Target className="w-5 h-5 text-rose-400" />
                </div>
                <h4 className="text-base font-bold text-white">Prefire & Ángulos de Trade</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Carga un mapa de <strong>Prefire Practice</strong> (Mirage o Dust2). Practica entrar inmediatamente detrás del bot simulado colocando la mira a nivel de cabeza para elevar el trade conversion.
                </p>
                <div className="bg-black/30 p-3 rounded-2xl border border-slate-800/60 text-xs space-y-2">
                  <div className="text-slate-300 font-semibold">• Limpieza de esquinas sin correr</div>
                  <div className="text-slate-300 font-semibold">• 0 balas falladas antes del contacto</div>
                  <div className="text-slate-300 font-semibold">• Time-to-damage objetivo: &lt; 380ms</div>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="steam://run/730//+map_workshop 3267302800"
                      className="inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-md shadow-rose-600/20"
                      title="Abre CS2 directamente en Mirage Prefire (requiere suscripción previa en Steam)"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Lanzar en CS2
                    </a>
                    <button
                      onClick={() => copyToClipboard("map_workshop 3267302800", "prefire_cmd")}
                      className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition border border-slate-700/60"
                      title="Copiar comando para consola (~) si el juego ya está abierto"
                    >
                      {copiedId === "prefire_cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === "prefire_cmd" ? "¡Copiado (~)" : "Copiar Comando"}
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-slate-500 font-mono">Consola: map_workshop 3267302800</span>
                    <a
                      href="https://steamcommunity.com/sharedfiles/filedetails/?id=3267302800"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 transition"
                    >
                      Ver en Workshop <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bloque 3: Aplicación en Combate */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800/40">
                    Fase 3: {Math.round(duration * 0.30)} min
                  </span>
                  <Flame className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white">Transferencia & Deathmatch FFA</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ingresa a un servidor comunitario de Deathmatch (FFA). Juega con volumen normal y disciplina de no disparar agachado a menos que sea a corta distancia.
                </p>
                <div className="bg-black/30 p-3 rounded-2xl border border-slate-800/60 text-xs space-y-2">
                  <div className="text-slate-300 font-semibold">• Mantener postura de mira a la cabeza</div>
                  <div className="text-slate-300 font-semibold">• Solo ráfagas de 2-3 balas (bursting)</div>
                  <div className="text-slate-300 font-semibold">• 50 frags antes de ingresar a Premier</div>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="steam://connect/45.235.98.178:27015"
                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-2 px-3 rounded-xl transition shadow-md shadow-emerald-500/20"
                      title="Conectar directamente al servidor Deathmatch en CS2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Conectar CS2
                    </a>
                    <button
                      onClick={() => copyToClipboard("connect 45.235.98.178:27015", "dm")}
                      className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition border border-slate-700/60"
                    >
                      {copiedId === "dm" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === "dm" ? "¡Copiado (~)" : "Copiar IP DM"}
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-slate-500 font-mono">Consola: connect 45.235.98.178:27015</span>
                    <span className="text-[10px] text-emerald-400 font-medium">128 Tick / Warmup FFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Workshop Command Bar */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Comandos Rápidos de Consola para Mapas de Workshop
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {WORKSHOP_MAPS.slice(0, 4).map((m) => (
                  <div key={m.id} className="bg-black/40 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{m.name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{m.command}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`steam://run/730//+map_workshop ${m.id}`}
                        className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-400 hover:text-cyan-200 transition"
                        title="Lanzar en CS2 directamente"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(m.command, m.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
                        title="Copiar comando de consola (~)"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LINEUPS VAULT */}
        {activeTab === "lineups" && (
          <div className="space-y-6">
            {/* Header & Map Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" /> Biblioteca de Lineups y Estrategias por Mapa
                </h3>
                <p className="text-xs text-slate-400">
                  Curaduría verificada de reels, clips y guías del canal #cs-guia
                </p>
              </div>

              {/* Map Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {["Todos", "Mirage", "Dust 2", "Inferno", "Anubis", "Nuke", "Ancient", "Vertigo"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMap(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedMap === m
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Lineups Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLineups.map((lineup) => (
                <div
                  key={lineup.id}
                  className="bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-5 flex flex-col justify-between transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                        {lineup.map} • {lineup.side}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{lineup.type}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                      {lineup.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">{lineup.desc}</p>

                    <div className="bg-black/30 p-2.5 rounded-xl border border-slate-800/60 text-[11px] text-slate-300 flex items-center justify-between">
                      <span>Mecánica: <strong className="text-white">{lineup.throwType}</strong></span>
                      <span className="text-slate-500 font-mono">{lineup.author}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <a
                      href={lineup.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold py-2.5 rounded-xl border border-cyan-500/20 transition"
                    >
                      Ver Clip de Referencia <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMUNIDAD & DISCORD */}
        {activeTab === "comunidad" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/40 border border-indigo-800/40 rounded-3xl p-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  <Users className="w-4 h-4" /> Servidor Oficial: Escuela CS
                </div>
                <h3 className="text-2xl font-black text-white">Comunidad & Sincronización en Tiempo Real</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tu servidor de Discord <strong>Escuela CS</strong> cuenta con 12 roles automáticos según tu nivel competitivo (Premier / FACEIT) y canales temáticos dedicados para cada mapa del pool activo.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://discord.com/channels/1556788306077810688"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition"
                  >
                    Abrir Escuela CS en Discord <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://app.notion.com/p/FragOS-CS2-Adaptive-Academy-Performance-Hub-3f00ebb914b081ed9637e2afd357e5e4"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
                  >
                    Abrir Espacio en Notion <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Matrix of Active Roles in Discord */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" /> Roles y Permisos Automáticos en Escuela CS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40">
                  <div className="font-bold text-rose-300">[Premier 20k+] Elite Master</div>
                  <div className="text-[11px] text-slate-400 mt-1">Canales tácticos pro y scrims privados</div>
                </div>
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40">
                  <div className="font-bold text-purple-300">[Premier 15k-20k] Veteran</div>
                  <div className="text-[11px] text-slate-400 mt-1">Micro-decisiones y retakes sincronizados</div>
                </div>
                <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-800/40">
                  <div className="font-bold text-blue-300">[Premier 8k-15k] Tactical</div>
                  <div className="text-[11px] text-slate-400 mt-1">Recoil control, prefire y setups base</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
                  <div className="font-bold text-emerald-300">[Premier &lt; 8k] Recruit</div>
                  <div className="text-[11px] text-slate-400 mt-1">Fundamentos, eDPI, postura y economía</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
