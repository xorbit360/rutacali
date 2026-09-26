import React, { useState } from 'react';
import {
  Zap, ArrowUpRight, TrendingUp, MapPin, RefreshCw,
  Building, CheckCircle2, ChevronDown, Activity, ShieldCheck
} from 'lucide-react';
import { TrackingEmcaliRow } from '../../types/sheets';

interface ScreenP5DashboardControlProps {
  trackingData: TrackingEmcaliRow[];
  onOpenGoogleSheets: () => void;
  onRefreshTelemetry?: () => void;
}

export const ScreenP5DashboardControl: React.FC<ScreenP5DashboardControlProps> = ({
  trackingData,
  onOpenGoogleSheets,
  onRefreshTelemetry
}) => {
  const [selectedComuna, setSelectedComuna] = useState('Comuna 19');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PASO E / PANTALLA 5 · MONITOREO PASIVO DE REAPERTURA EMCALI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Tablero Distrital de Reactivación y Telemetría Eléctrica
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Cruce pasivo de retorno de consumo comercial (kWh) y micro-confirmaciones de 1 clic por WhatsApp a los 15 y 30 días.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGoogleSheets}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
          >
            Ver Hoja "Tracking_EMCALI"
          </button>
        </div>
      </div>

      {/* Screen Frame Mockup (Matching pc_p5_dashboard_control.png dark monitor) */}
      <div className="bg-[#0B132B] text-slate-100 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800 font-sans">
        {/* Top Dark Header */}
        <div className="bg-[#1C2541] px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 mb-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
              RAC
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Alcaldía de Cali - Monitoreo de Reactivación Comercial
              </h2>
              <span className="text-[10px] text-slate-400">
                Secretaría de Desarrollo Económico · DATIC · EMCALI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#0B132B] px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedComuna}
                onChange={(e) => setSelectedComuna(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Comuna 19" className="bg-slate-900">Comuna 19 (San Fernando)</option>
                <option value="Comuna 3" className="bg-slate-900">Comuna 3 (San Nicolás)</option>
                <option value="Comuna 9" className="bg-slate-900">Comuna 9 (Alameda)</option>
                <option value="Todas" className="bg-slate-900">Todas las Comunas</option>
              </select>
            </div>

            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart Grid EMCALI Activo</span>
            </div>
          </div>
        </div>

        {/* Top 2 Big Hero Stat Boxes matching image pc_p5_dashboard_control.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Hero 1: 1.240 Comercios Reactivados */}
          <div className="bg-[#1C2541] rounded-2xl p-6 border border-slate-700 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-2">
                Impacto Distrital Acumulado
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-sky-400 tracking-tight">
                  1.240
                </span>
                <span className="text-emerald-400 flex items-center text-xl font-bold">
                  <ArrowUpRight className="w-6 h-6" />
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                Comercios Reactivados con Expediente RAC-2026
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-700/60">
              Corroborado sin visitas presenciales: 100% mediante retorno de consumo energético y confirmaciones en WhatsApp.
            </p>
          </div>

          {/* Hero 2: Retorno de Consumo Eléctrico Comercial (kWh EMCALI) */}
          <div className="bg-[#1C2541] rounded-2xl p-6 border border-slate-700 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-2">
                Medición Telemétrica Automatizada
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Retorno de Consumo Eléctrico Comercial (kWh EMCALI)
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Seguimiento a los contadores comerciales de cuadrantes para evaluar la operatividad real de panaderías, tiendas y talleres.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Umbral de Cierre Exitoso:</span>
              <span className="font-bold text-emerald-400 font-mono">&gt; 65% del nivel base</span>
            </div>
          </div>
        </div>

        {/* Bottom 2 Grid Items: Line Chart & Comuna 19 Heat Map matching pc_p5_dashboard_control.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Left (7 cols) */}
          <div className="lg:col-span-7 bg-[#1C2541] rounded-2xl p-6 border border-slate-700 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>Recuperación Energía kWh</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Tasa de Reapertura (%)</span>
                </span>
              </div>
            </div>

            {/* SVG Line / Area Graph */}
            <div className="h-60 relative w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="500" y2="65" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="155" x2="500" y2="155" stroke="#334155" strokeDasharray="3 3" />

                {/* Energy Recovery Curve (Sky Blue) */}
                <polyline
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  points="20,180 80,165 140,140 200,105 260,115 320,80 380,60 440,40 480,30"
                />

                {/* Tasa Reapertura Curve (Emerald Green) */}
                <polyline
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="3"
                  points="20,190 80,180 140,150 200,120 260,95 320,70 380,50 440,35 480,25"
                />

                {/* Data Points */}
                {[[20,180], [80,165], [140,140], [200,105], [260,115], [320,80], [380,60], [440,40], [480,30]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#38BDF8" />
                ))}
                {[[20,190], [80,180], [140,150], [200,120], [260,95], [320,70], [380,50], [440,35], [480,25]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#34D399" />
                ))}
              </svg>

              {/* Month labels bottom */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2">
                <span>Ene</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Ago</span>
                <span>Sep</span>
              </div>
            </div>
          </div>

          {/* Thermal Heat Map Right (5 cols) matching pc_p5_dashboard_control.png */}
          <div className="lg:col-span-5 bg-[#1C2541] rounded-2xl p-6 border border-slate-700 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Mapa de Calor · Comuna 19 San Fernando</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                Densidad Comercial
              </span>
            </div>

            {/* Thermal Infrared Satellite graphic simulation */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-700 h-52 flex items-center justify-center">
              {/* Street grid sketch */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <pattern id="streetGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94A3B8" strokeWidth="0.8" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#streetGrid)" />
              </svg>

              {/* Thermal color blobs (orange/red/yellow heat glow) */}
              <div className="absolute w-36 h-36 rounded-full bg-red-600/60 blur-2xl animate-pulse" />
              <div className="absolute w-28 h-28 rounded-full bg-amber-500/70 blur-xl" />
              <div className="absolute w-16 h-16 rounded-full bg-yellow-300/80 blur-md" />

              {/* Hotspot commercial corridors */}
              <div className="relative z-10 text-center">
                <span className="font-mono text-xs font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 backdrop-blur-sm block mb-1">
                  Corredor Cra 34 con Calle 5ta
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold block">
                  78% Comercios con kWh Restablecido
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-300 flex items-center justify-between">
              <span>Puestos La 14 de la 80 (Cámara de Comercio de Cali):</span>
              <span className="font-bold text-emerald-400">Puestos Activos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
