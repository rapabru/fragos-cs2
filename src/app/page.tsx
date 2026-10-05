"use client";

import React, { useState } from "react";
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
  ArrowDownRight
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

// Datos de Auditoría Forense y Benchmarks tipo Leetify extraídos del caso real
const INITIAL_STATS = {
  username: "LA VIEJA (El Rapa!)",
  steamId: "76561198000000000",
  avatarUrl: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
  premierRating: 4903, // Pico histórico alcanzado en Ancient Premier
  rankTitle: "Silver Elite Master (Frontera Gold Nova ~5K)",
  faceitLevel: 4,
  leetifyRating: "+0.55",
  hltvRating: 0.97,
  kdRatio: 1.06,
  adr: 74.5,
  hsAccuracy: "37%",
  timeToDamageMs: 400,
  crosshairPlacementError: 7.8, // grados
  counterStrafeEfficiency: 79, // %
  openingDuelWinrate: 67, // %
  openingDuelRating: "+5.1",
  openingDuelAttempts: "15%",
  aimRatingPB: 96, // Récord en Dust 2 Premier (anterior 93)
  multikillsTotal: 53, // 47x 2K, 6x 3K
  clutchWinrate: 18, // %
  clutchRating: "+10.18",
  tradeKillSuccess: 29, // %
  tradeOpportunities: 75,
  roundsSurvived: "37%", // 130 / 348 rondas
  winRate: "65%", // 11W - 6L
  winStreak: 5 // Dust 2 -> Overpass -> Ancient -> Nuke -> Inferno
};

// Comparativa formal Período Anterior vs Período Actual (Extraída del PDF General Stats)
const PERIOD_COMPARISON = [
  { metric: "Win Rate", before: "40.0% (8W - 12L)", current: "65.0% (11W - 6L)", delta: "+25.0%", isPositive: true },
  { metric: "HLTV 2.0 Rating", before: "0.59", current: "0.97", delta: "+64.4%", isPositive: true },
  { metric: "K/D Ratio", before: "0.54", current: "1.06", delta: "+96.3% (x2)", isPositive: true },
  { metric: "ADR (Daño/Ronda)", before: "51.78 HP", current: "74.50 HP", delta: "+43.9%", isPositive: true },
  { metric: "KPR (Kills/Ronda)", before: "0.42", current: "0.66", delta: "+57.1%", isPositive: true },
  { metric: "DPR (Muertes/Ronda)", before: "0.78", current: "0.63", delta: "-19.2%", isPositive: true },
  { metric: "Opening Duel Winrate", before: "~45%", current: "67.0% (+5.1)", delta: "Élite", isPositive: true },
  { metric: "Aim Rating Personal Best", before: "93", current: "96 (Dust 2)", delta: "+3 pts", isPositive: true }
];

// Matriz de Competencias Leetify
const RADAR_DATA = [
  { subject: "Aim Rating (PB 96)", player: 88, benchmark: 70, pro: 95 },
  { subject: "Opening Duels (67%)", player: 94, benchmark: 65, pro: 92 },
  { subject: "Counter-Strafe", player: 79, benchmark: 75, pro: 96 },
  { subject: "Trade Conversion", player: 42, benchmark: 68, pro: 90 },
  { subject: "Conversión Clutches", player: 38, benchmark: 62, pro: 85 },
  { subject: "Consistencia / Regularidad", player: 52, benchmark: 70, pro: 92 }
];

// Historial Cronológico de Partidas Premier Valve (Extraído del dataset de Leetify)
const PREMIER_MATCHES = [
  { date: "21-Ago", map: "Mirage", score: "16-14", rating: -1.67, csRating: 4437, kda: "20/21/8", status: "WIN", highlight: "Overtime Thriller" },
  { date: "21-Ago", map: "Dust 2", score: "7-13", rating: +0.82, csRating: 4220, kda: "13/15/4", status: "LOSS", highlight: "Positivo en derrota" },
  { date: "20-Ago", map: "Overpass", score: "13-7", rating: +13.14, csRating: 4423, kda: "19/8/6", status: "WIN", highlight: "Control total Baños" },
  { date: "19-Ago", map: "Mirage", score: "13-0", rating: +19.36, csRating: 4240, kda: "18/1/5", status: "WIN", highlight: "⭐ Récord Top 20% Mundial" },
  { date: "18-Ago", map: "Mirage", score: "13-10", rating: +2.31, csRating: 4403, kda: "21/15/6", status: "WIN", highlight: "21 Frags decisivos" },
  { date: "18-Ago", map: "Mirage", score: "3-13", rating: +4.55, csRating: 4186, kda: "12/15/4", status: "LOSS", highlight: "Rating positivo a pesar del stomp" },
  { date: "17-Ago", map: "Dust 2", score: "13-9", rating: -1.50, csRating: 4294, kda: "16/17/8", status: "WIN", highlight: "Cierre ajustado" },
  { date: "17-Ago", map: "Mirage", score: "15-15", rating: -1.44, csRating: 4118, kda: "17/18/7", status: "TIE", highlight: "Empate competitivo" },
  { date: "17-Ago", map: "Dust 2", score: "13-8", rating: +4.45, csRating: 4057, kda: "15/10/5", status: "WIN", highlight: "Defensa sólida de A" },
  { date: "16-Ago", map: "Mirage", score: "4-13", rating: -9.90, csRating: null, kda: "5/15/8", status: "LOSS", highlight: "Caída de concentración" },
  { date: "16-Ago", map: "Ancient", score: "13-10", rating: +0.42, csRating: 4304, kda: "14/12/5", status: "WIN", highlight: "Retake exitoso B" },
  { date: "16-Ago", map: "Overpass", score: "13-6", rating: +5.81, csRating: 4080, kda: "16/9/4", status: "WIN", highlight: "Gran impacto T-side" },
  { date: "15-Ago", map: "Mirage", score: "13-5", rating: +6.32, csRating: 3781, kda: "17/7/3", status: "WIN", highlight: "Racha iniciada" },
  { date: "14-Ago", map: "Mirage", score: "13-9", rating: +1.15, csRating: 4067, kda: "15/13/6", status: "WIN", highlight: "Solidez en Conector" },
  { date: "10-Ago", map: "Ancient", score: "13-9", rating: +5.02, csRating: 4903, kda: "18/10/4", status: "WIN", highlight: "🏆 Pico Histórico 4,903" },
  { date: "10-Ago", map: "Inferno", score: "13-8", rating: +3.48, csRating: 4725, kda: "16/11/5", status: "WIN", highlight: "Banana control demo" }
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
  const [activeTab, setActiveTab] = useState<"diagnostico" | "historial" | "rutina" | "lineups" | "comunidad">("diagnostico");
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(30);
  const [selectedMap, setSelectedMap] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLineups = selectedMap === "Todos" 
    ? LINEUPS_VAULT 
    : LINEUPS_VAULT.filter(l => l.map.toLowerCase() === selectedMap.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0d121c]/80 backdrop-blur sticky top-0 z-50">
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
              Historial Premier ({PREMIER_MATCHES.length})
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

          {/* Player Badge */}
          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
              <img src={INITIAL_STATS.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                {INITIAL_STATS.username}
                <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {INITIAL_STATS.winRate} WR
                </span>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono font-medium">
                Pico {INITIAL_STATS.premierRating.toLocaleString()} CS Rating • {INITIAL_STATS.rankTitle}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TAB 1: DIAGNÓSTICO & STATS */}
        {activeTab === "diagnostico" && (
          <div className="space-y-6">
            {/* Top KPI Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Leetify Rating</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{INITIAL_STATS.leetifyRating}</div>
                <div className="text-[10px] text-slate-500 mt-1">Calificación: Bueno (Pico +19.36)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">K/D Ratio</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">{INITIAL_STATS.kdRatio}</div>
                <div className="text-[10px] text-emerald-500 mt-1">↑ +96% (Duplicó impacto)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">ADR (Daño/Ronda)</div>
                <div className="text-2xl font-black text-white mt-1">{INITIAL_STATS.adr}</div>
                <div className="text-[10px] text-emerald-500 mt-1">↑ +44% (51.8 ➔ 74.5 HP)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Opening Duels</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{INITIAL_STATS.openingDuelWinrate}%</div>
                <div className="text-[10px] text-amber-400/90 mt-1">Rating +5.1 (Nivel Élite)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Aim Personal Best</div>
                <div className="text-2xl font-black text-purple-400 mt-1">{INITIAL_STATS.aimRatingPB}</div>
                <div className="text-[10px] text-purple-300 mt-1">Dust 2 Premier (antes 93)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="text-slate-400 text-xs font-medium">Win Streak Premier</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">{INITIAL_STATS.winStreak} Partidas</div>
                <div className="text-[10px] text-cyan-400/80 mt-1">Dust2-Ovp-Anc-Nuke-Inf</div>
              </div>
            </div>

            {/* SECCIÓN COMPARATIVA DE PERÍODOS (ANTES VS AHORA) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" /> Evolución de Estadísticas (Período Anterior vs Actual)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Extracción formal de Leetify PDF: 21 partidas (Ene-Jul) vs 18 partidas (Jul-Ago) exclusivamente Premier.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
                  Pico Premier: 4,903 CS Rating
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PERIOD_COMPARISON.map((c, i) => (
                  <div key={i} className="bg-black/30 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">{c.metric}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs line-through">{c.before}</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1">
                        {c.current}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> {c.delta}
                    </div>
                  </div>
                ))}
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
                    <p className="text-xs text-slate-400">Perfil actual de LA VIEJA vs Promedio Premier vs Nivel 10 FACEIT</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Tu Rendimiento
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Nivel 10 Faceit
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
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
                    <ShieldAlert className="w-4 h-4" /> Debilidad #1: Inconsistencia y Volatilidad
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Picos de +19.36 pero caídas de -9.90</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Tu techo ya es de nivel profesional (top 20% mundial en Mirage 13-0), pero alternas días con ratings de -9.90 y -11.54. Falta consolidar un piso mínimo disciplinado sin depender del día mecánico.
                  </p>
                  <div className="mt-3 pt-3 border-t border-rose-900/30 flex items-center justify-between">
                    <span className="text-[11px] text-rose-300 font-medium">Receta: Protocolo 15m Calentamiento</span>
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
                    <ShieldAlert className="w-4 h-4" /> Debilidad #2: Conversión de Trade Kills (29%)
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Intentas 91% pero solo rematas 29%</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    De 75 oportunidades de trade kill, entraste a pelear en 68 ocasiones pero solo lograste la baja en 22. Necesitas mejorar el spacing (tándem de 1 metro) y altura de mira al asomar después de tu compañero.
                  </p>
                  <div className="mt-3 pt-3 border-t border-amber-900/30 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-medium">Receta: Prefire & Retake Drills</span>
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
                      <div className="text-xs font-bold text-white">Superpoder: Opening Duels (67% Winrate)</div>
                      <div className="text-[11px] text-slate-400">Leetify Rating +5.1 en primeras bajas. Participa más como Entry!</div>
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

        {/* TAB NUEVO: HISTORIAL PREMIER DETALLADO */}
        {activeTab === "historial" && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" /> Registro Cronológico de Partidas Valve Premier
                </h3>
                <p className="text-xs text-slate-400">
                  Historial de auditoría oficial de LA VIEJA filtrado exclusivamente para el modo Premier en CS2.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800/50 text-emerald-300 text-xs font-bold">
                  Winrate: 65% (11W - 6L)
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-300 text-xs font-bold">
                  Pico: 4,903 CS Rating
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
                    {PREMIER_MATCHES.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 text-slate-300 font-mono">{m.date}</td>
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
                            {m.rating > 0 ? `+${m.rating.toFixed(2)}` : m.rating.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {m.csRating ? (
                            <span className="text-cyan-300 font-bold">{m.csRating.toLocaleString()}</span>
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
                  Adaptada para combatir la inconsistencia y elevar el Trade Kill Success de 29% a &gt; 45%
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
                  Entrada en calor en <strong>Aim Botz</strong> o <strong>5e_aimhub</strong>. Consolidar el récord de 96 Aim Rating: no ráfagas descontroladas; taps a la cabeza con counter-strafing limpio.
                </p>
                <div className="bg-black/30 p-3 rounded-2xl border border-slate-800/60 text-xs space-y-2">
                  <div className="text-slate-300 font-semibold">• 100 kills de un toque (AK-47)</div>
                  <div className="text-slate-300 font-semibold">• 50 kills en movimiento continuo A/D</div>
                  <div className="text-slate-300 font-semibold">• 25 kills con Deagle a distancia media</div>
                </div>
                <div className="pt-2">
                  <a
                    href="https://steamcommunity.com/sharedfiles/filedetails/?id=3070244462"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold py-2.5 rounded-xl transition text-white"
                  >
                    Abrir Aim Botz en Workshop <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
                <div className="pt-2">
                  <a
                    href="https://steamcommunity.com/sharedfiles/filedetails/?id=3267302800"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold py-2.5 rounded-xl transition text-white"
                  >
                    Abrir Mirage Prefire <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
                <div className="pt-2">
                  <button
                    onClick={() => copyToClipboard("connect 45.235.98.178:27015", "dm")}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold py-2.5 rounded-xl transition"
                  >
                    {copiedId === "dm" ? "¡Comando Copiado!" : "Copiar IP de Servidor DM"} <Copy className="w-3.5 h-3.5" />
                  </button>
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
                    <button
                      onClick={() => copyToClipboard(m.command, m.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Copiar comando de consola"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
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
