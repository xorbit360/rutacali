import React, { useState } from 'react';
import {
  Building2, Landmark, Truck, DollarSign, CheckCircle2,
  Users, MapPin, BarChart3, ShieldCheck, ArrowRight,
  TrendingUp, Activity, Check, Clock, ChevronRight, Layers
} from 'lucide-react';
import { ComercianteRow } from '../../types/sheets';

interface ScreenEntidadesProps {
  comerciantes: ComercianteRow[];
  onOpenGoogleSheets: () => void;
}

export const ScreenEntidades: React.FC<ScreenEntidadesProps> = ({
  comerciantes,
  onOpenGoogleSheets
}) => {
  const [activeEntityView, setActiveEntityView] = useState<'alcaldia' | 'ccc' | 'comfandi' | 'interop'>('alcaldia');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PORTALES DE ENTIDADES INSTITUCIONALES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Sincronización Institucional desde Google Sheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Cada entidad consulta vistas filtradas de la base central con permisos de edición restringidos por columna.
          </p>
        </div>

        {/* Entity Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveEntityView('alcaldia')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeEntityView === 'alcaldia'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alcaldía ($5.000M)
          </button>

          <button
            onClick={() => setActiveEntityView('ccc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeEntityView === 'ccc'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cámara Comercio (CCC)
          </button>

          <button
            onClick={() => setActiveEntityView('comfandi')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeEntityView === 'comfandi'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Comfandi
          </button>

          <button
            onClick={() => setActiveEntityView('interop')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeEntityView === 'interop'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interoperabilidad (RETO-02)
          </button>
        </div>
      </div>

      {/* 1. ENTIDAD ALCALDÍA DE CALI - DESARROLLO ECONÓMICO (Matching entidad_alcaldia_desarrollo_economico.png) */}
      {activeEntityView === 'alcaldia' && (
        <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
            {/* Top Brand Lockup */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  CALI
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">
                    Secretaría de Desarrollo Económico
                  </h2>
                  <span className="text-xs text-slate-500">Alcaldía de Santiago de Cali</span>
                </div>
              </div>

              <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-mono font-semibold">
                Rol: Administrador Fondo Solidario
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-6">
              Portal de Alivios Económicos y Fondo Solidario $5.000M - RAC-2026
            </h3>

            {/* Layout matching image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: Solicitudes de Alivio Entrante (4 cols) */}
              <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Solicitudes de Alivio (Entrante)
                </span>

                <div className="space-y-2">
                  {comerciantes.slice(0, 5).map((c, i) => (
                    <div
                      key={c.ID_Expediente}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-slate-900">{c.Nombre_Comerciante}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
                        {c.Estado_SLA}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Col: Corredores Comerciales Map (4 cols) */}
              <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    Corredores Comerciales de Cali
                  </span>

                  {/* Schematized Map of Cali Comunas */}
                  <div className="h-52 bg-white rounded-xl border border-slate-200 p-3 relative flex items-center justify-center overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      {/* Polygon zones representing Cali Comunas */}
                      <polygon points="40,30 90,20 85,80 30,70" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
                      <polygon points="90,20 150,30 140,90 85,80" fill="#86EFAC" stroke="#10B981" strokeWidth="1.5" />
                      <polygon points="30,70 85,80 80,140 25,130" fill="#86EFAC" stroke="#10B981" strokeWidth="1.5" />
                      <polygon points="85,80 140,90 145,150 80,140" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
                      <polygon points="80,140 145,150 130,190 70,180" fill="#86EFAC" stroke="#10B981" strokeWidth="1.5" />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-bold bg-white/90 text-slate-800 px-2 py-0.5 rounded shadow">
                        Comuna 19: Prioritaria
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  Desembolso directo vía cuentas de nómina o convenios de arriendo.
                </div>
              </div>

              {/* Right Col: Métricas de Desembolso & Interoperabilidad (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Métricas de Desembolso
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900">
                    $3.200M
                  </div>
                  <span className="text-[11px] text-slate-500">
                    de $5.000M comprometidos en ayudas directas
                  </span>

                  {/* Small bar chart */}
                  <div className="h-16 flex items-end gap-2 pt-3">
                    {[30, 45, 60, 40, 75, 55, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-600 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Interoperabilidad de Caso
                  </span>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-700">Cámara de Comercio de Cali</span>
                    <span className="text-emerald-700 font-bold">Conectado</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-700">Comfandi Crédito</span>
                    <span className="text-emerald-700 font-bold">Conectado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ENTIDAD CÁMARA DE COMERCIO DE CALI (CCC) (Matching entidad_camara_comercio_cali.png) */}
      {activeEntityView === 'ccc' && (
        <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                CCC
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Cámara de Comercio de Cali (CCC)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                  Gestión de Reactivación Comercial y Compras Colectivas en Enjambre
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: Verification list & 18% Gauge (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-3">
                    Expediente Único RAC-2026 · Validación CCC
                  </h4>
                  <div className="space-y-2 text-xs">
                    {comerciantes.slice(0, 4).map(c => (
                      <div key={c.ID_Expediente} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="font-medium text-slate-800">{c.Nombre_Comerciante}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 18% Discount Gauge (Matching image entidad_camara_comercio_cali.png) */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-center gap-6">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90">
                      <circle cx="56" cy="56" r="45" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                      <circle cx="56" cy="56" r="45" stroke="#2563EB" strokeWidth="8" fill="none" strokeDasharray="282" strokeDashoffset="50" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-slate-900">18%</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Discount</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Active Enjambre Clusters
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Ahorro directo pactado con molinos y distribuidoras mayoristas de CAVASA para tenderos de Cali.
                    </p>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">Cluster A</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">Cluster B</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Map & Wholesale Supplier Network (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    Commercial Corridor Reactivation Map
                  </span>
                  <div className="h-40 bg-slate-900 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-700">
                      Corredor Comuna 19 & La 14 de la 80
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    Wholesale Supplier Network
                  </h4>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-semibold text-slate-800">Molino Harinera del Valle</span>
                      <span className="text-emerald-700 font-bold">Harinas y Premezclas</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-semibold text-slate-800">CAVASA Mayorista</span>
                      <span className="text-emerald-700 font-bold">Granos y Abarrotes</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-slate-800">Distribuidora Siderúrgica</span>
                      <span className="text-emerald-700 font-bold">Materiales Básicos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ENTIDAD COMFANDI (Matching entidad_comfandi.png) */}
      {activeEntityView === 'comfandi' && (
        <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                CF
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Comfandi - Caja de Compensación Familiar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                  Programa de Subsidios de Reequipamiento y Crédito Social - RAC-2026
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: Incoming Applications (4 cols) */}
              <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Incoming Micro-Business Applications (RAC-2026)
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg block">
                  ✓ Sin Barrera de RUT
                </span>

                <div className="space-y-2 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-base font-black text-slate-900 block">256</span>
                      <span className="text-[11px] text-slate-500">Nuevas Solicitudes</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Recibida</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-base font-black text-slate-900 block">172</span>
                      <span className="text-[11px] text-slate-500">En Revisión Técnica</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">En Revisión</span>
                  </div>
                </div>
              </div>

              {/* Middle Col: Pre-approved Credit Badges & Delivery Tracker (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    Pre-approved Credit Status Badges
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Crédito Aprobado (Tipo A)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Pre-aprobación (Tipo B)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Social Welfare & Equipment Delivery Tracker
                  </span>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Entregas en Curso:</span>
                    <span className="font-bold text-emerald-700">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* Right Col: Family Relief Metrics (3 cols) */}
              <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Family Relief Support
                  </span>
                  <div className="space-y-3 mt-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Familias Asistidas:</span>
                      <span className="font-mono text-xl font-black text-slate-900">1,200</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Valor Total Entregado:</span>
                      <span className="font-mono text-xl font-black text-emerald-700">$500M</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenGoogleSheets}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors mt-4"
                >
                  Auditar en Google Sheets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PORTAL DE INTEROPERABILIDAD INSTITUCIONAL (RETO-02) (Matching panel_interoperabilidad_entidades_pc.png) */}
      {activeEntityView === 'interop' && (
        <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                  Ruta Abierta Cali - Portal de Interoperabilidad Institucional (RETO-02)
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Vista de Gestión de Casos Interinstitucional - Expediente Único RAC-2026
                </h2>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Sincronizado vía Google Sheets API
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: Centralizada Casos Queue (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      Centralizada Casos Queue
                    </span>
                    <span className="text-xs text-slate-500">
                      Filas sincronizadas en vivo
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-white border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-2 px-2.5">Nombre Comerciante</th>
                          <th className="py-2 px-2.5">Ubicación</th>
                          <th className="py-2 px-2.5">Estado</th>
                          <th className="py-2 px-2.5">Ruta Asignada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {comerciantes.slice(0, 5).map(c => (
                          <tr key={c.ID_Expediente} className="hover:bg-slate-100/60">
                            <td className="py-2.5 px-2.5 font-bold text-slate-900">{c.Nombre_Comerciante}</td>
                            <td className="py-2.5 px-2.5">{c.Barrio_Comuna}</td>
                            <td className="py-2.5 px-2.5">
                              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                                {c.Estado_SLA}
                              </span>
                            </td>
                            <td className="py-2.5 px-2.5 font-medium text-emerald-800">{c.Ruta_Asignada}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Col: Panel de Sincronización (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    Panel de Sincronización de Interoperabilidad
                  </span>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Secretaría de Desarrollo Económico</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 block ml-5">Verificado y Sincronizado</span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cámara de Comercio de Cali (CCC)</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 block ml-5">Expediente Unificado</span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Comfandi</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 block ml-5">Cupo Aprobado</span>
                  </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    Acciones Rápidas
                  </span>
                  <button
                    onClick={() => alert('Órdenes de Compra Colectiva Aprobadas (18% Descuento con Proveedores).')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
                  >
                    Aprobar Órdenes de Compra Colectiva (18% Desc. Proveedores)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
