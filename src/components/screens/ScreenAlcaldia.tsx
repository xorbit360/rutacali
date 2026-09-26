import React, { useState } from 'react';
import {
  Landmark, DollarSign, CheckCircle2, MapPin, Users,
  ArrowRight, ShieldCheck, Check, Clock, AlertCircle, RefreshCw,
  Search, Filter, Sparkles, Building2, Wallet, ArrowUpRight
} from 'lucide-react';
import { ComercianteRow } from '../../types/sheets';

interface ScreenAlcaldiaProps {
  comerciantes: ComercianteRow[];
  onApproveAlivio: (idExpediente: string) => void;
  onOpenGoogleSheets: () => void;
}

export const ScreenAlcaldia: React.FC<ScreenAlcaldiaProps> = ({
  comerciantes,
  onApproveAlivio,
  onOpenGoogleSheets
}) => {
  const [selectedComuna, setSelectedComuna] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [approvedIds, setApprovedIds] = useState<string[]>(['RAC-2026-0424']);
  const [disbursedTotal, setDisbursedTotal] = useState(3200); // Millions COP
  const [recentApprovalMessage, setRecentApprovalMessage] = useState<string | null>(null);

  const handleApprove = (id: string, nombre: string) => {
    if (!approvedIds.includes(id)) {
      setApprovedIds(prev => [...prev, id]);
      setDisbursedTotal(prev => prev + 5); // +$5M COP
      onApproveAlivio(id);
      setRecentApprovalMessage(`¡Alivio de $5.000.000 COP aprobado y transferido a ${nombre} (${id})!`);
      setTimeout(() => setRecentApprovalMessage(null), 5000);
    }
  };

  const comunasList = [
    { id: 'all', label: 'Todas las Comunas', count: comerciantes.length },
    { id: 'Comuna 19', label: 'C19 · San Fernando', count: comerciantes.filter(c => c.Barrio_Comuna.includes('19')).length },
    { id: 'Comuna 3', label: 'C3 · San Nicolás', count: comerciantes.filter(c => c.Barrio_Comuna.includes('3')).length },
    { id: 'Comuna 9', label: 'C9 · Alameda', count: comerciantes.filter(c => c.Barrio_Comuna.includes('9')).length },
    { id: 'Comuna 20', label: 'C20 · Siloé', count: comerciantes.filter(c => c.Barrio_Comuna.includes('20')).length }
  ];

  const filteredComerciantes = comerciantes.filter(c => {
    const matchesComuna = selectedComuna === 'all' || c.Barrio_Comuna.includes(selectedComuna.replace('Comuna ', ''));
    const matchesSearch = !searchQuery ||
      c.Nombre_Comerciante.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ID_Expediente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.Barrio_Comuna.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesComuna && matchesSearch;
  });

  const availableBalance = 5000 - disbursedTotal;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* 1. FICHA OFICIAL DE ROL INSTITUCIONAL */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 mb-6 shadow-xl border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30">
                  ROL INSTITUCIONAL 1 DE 3
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Alcaldía Distrital de Santiago de Cali · DATIC & Desarrollo Económico
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Secretaría de Desarrollo Económico · Fondo Solidario $5.000M
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                <strong>¿Cuál es el rol exclusivo de la Alcaldía?</strong> Disponer y transferir de forma ágil e inmediata los recursos públicos no reembolsables del <strong>Fondo Solidario de $5.000M COP</strong> decretado para atender emergencias post-sismo (auxilio de arriendos, pago de nóminas básicas y servicios).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenGoogleSheets}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Ver Base Google Sheets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reglas de Oro y Competencias */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block mb-0.5">✓ QUÉ HACE LA ALCALDÍA:</span>
            <span className="text-slate-300">Desembolsa giros directos de hasta $5.000.000 COP por negocio afectado y coordina la mesa distrital.</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-amber-400 font-bold block mb-0.5">🚫 QUÉ NO PIDE (CERO BUROCRACIA):</span>
            <span className="text-slate-300">No exige RUT actualizado, no pide estados financieros ni facturación DIAN a comerciantes populares.</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-blue-400 font-bold block mb-0.5">⏱️ COMPROMISO DE SLA:</span>
            <span className="text-slate-300">Resolución y autorización de desembolso en menos de 24 horas mediante firma digital y Ficha Única RAC-2026.</span>
          </div>
        </div>
      </div>

      {/* Notification Toast for instant approval */}
      {recentApprovalMessage && (
        <div className="mb-6 p-4 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg border border-emerald-400 flex items-center justify-between animate-fadeIn font-bold text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{recentApprovalMessage}</span>
          </div>
          <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded font-mono">
            Transferencia Exitosa
          </span>
        </div>
      )}

      {/* 2. TABLERO INTERACTIVO INSTITUCIONAL */}
      <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200">
          {/* Header lockup */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
                CALI
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Oficina de Desembolsos del Fondo Solidario Distrital
                </h2>
                <span className="text-xs text-slate-500 font-medium">Decreto Extraordinario de Reactivación Comercial Post-Sismo</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg font-mono font-bold border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Permiso Institucional: Autorización de Giro</span>
              </span>
            </div>
          </div>

          {/* Interactive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block mb-0.5">Presupuesto del Fondo</span>
              <div className="font-mono text-2xl font-black text-slate-900">$5.000M COP</div>
              <span className="text-[10px] text-slate-500">Decretado por Alcaldía</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-semibold block mb-0.5">Recursos Comprometidos</span>
              <div className="font-mono text-2xl font-black text-emerald-800">${disbursedTotal.toLocaleString('es-CO')}M COP</div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${(disbursedTotal / 5000) * 100}%` }} />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-xs text-blue-800 font-semibold block mb-0.5">Saldo Disponible para Giro</span>
              <div className="font-mono text-2xl font-black text-blue-900">${availableBalance.toLocaleString('es-CO')}M COP</div>
              <span className="text-[10px] text-blue-700 font-semibold">Listo para desembolso inmediato</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block mb-0.5">Comercios Beneficiados</span>
              <div className="font-mono text-2xl font-black text-slate-900">
                {418 + approvedIds.length}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Tiempo promedio: 4.8 horas</span>
            </div>
          </div>

          {/* Interactive Filters: Comuna & Search */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Comuna Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar Corredor:</span>
              </span>
              {comunasList.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedComuna(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedComuna === c.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.label} ({c.count})
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar tendero o radicado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 3-Column Layout from GovTech Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Col 1: Solicitudes de Alivio (Entrante) (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">
                  Solicitudes de Alivio en Espera de Giro ({filteredComerciantes.length})
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  SLA Máximo: 24h
                </span>
              </div>

              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {filteredComerciantes.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                    No se encontraron solicitudes con el filtro actual.
                  </div>
                ) : (
                  filteredComerciantes.map((c) => {
                    const isApproved = approvedIds.includes(c.ID_Expediente) || c.Estado_SLA.includes('Aprobado');
                    return (
                      <div
                        key={c.ID_Expediente}
                        className={`p-3.5 rounded-xl border transition-all shadow-sm space-y-2.5 ${
                          isApproved
                            ? 'bg-emerald-50/70 border-emerald-300'
                            : 'bg-white border-slate-200 hover:border-emerald-500'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {c.Nombre_Comerciante}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {c.ID_Expediente} · {c.Barrio_Comuna}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                              isApproved
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isApproved ? 'Aprobado para Giro' : c.Estado_SLA}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Ruta Asignada:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[190px]">{c.Ruta_Asignada}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Monto Subsidio:</span>
                            <span className="font-bold text-emerald-700 font-mono">$5.000.000 COP</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Habeas Data Ley 1581: Aprobada
                          </span>

                          <button
                            onClick={() => handleApprove(c.ID_Expediente, c.Nombre_Comerciante)}
                            disabled={isApproved}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isApproved
                                ? 'bg-emerald-600 text-white cursor-default flex items-center gap-1'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1'
                            }`}
                          >
                            {isApproved ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Giro Aprobado</span>
                              </>
                            ) : (
                              <>
                                <Wallet className="w-3.5 h-3.5" />
                                <span>Aprobar Giro ($5M)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Col 2: Interactive Corredores Map (4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Mapa de Corredores Prioritarios Post-Sismo
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Clic para Filtrar
                  </span>
                </div>

                {/* Interactive Map of Cali Comunas */}
                <div className="h-60 bg-white rounded-xl border border-slate-200 p-2 relative flex items-center justify-center overflow-hidden shadow-inner">
                  <svg className="w-full h-full cursor-pointer" viewBox="0 0 200 200">
                    {/* Comuna 3 */}
                    <polygon
                      points="40,30 90,20 85,80 30,70"
                      fill={selectedComuna.includes('3') ? '#3B82F6' : '#93C5FD'}
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      onClick={() => setSelectedComuna('Comuna 3')}
                      className="transition-colors hover:opacity-80"
                    />
                    {/* Comuna 19 */}
                    <polygon
                      points="90,20 150,30 140,90 85,80"
                      fill={selectedComuna.includes('19') ? '#059669' : '#86EFAC'}
                      stroke="#10B981"
                      strokeWidth="1.5"
                      onClick={() => setSelectedComuna('Comuna 19')}
                      className="transition-colors hover:opacity-80"
                    />
                    {/* Comuna 9 */}
                    <polygon
                      points="30,70 85,80 80,140 25,130"
                      fill={selectedComuna.includes('9') ? '#2563EB' : '#93C5FD'}
                      stroke="#1D4ED8"
                      strokeWidth="1.5"
                      onClick={() => setSelectedComuna('Comuna 9')}
                      className="transition-colors hover:opacity-80"
                    />
                    {/* Comuna 20 */}
                    <polygon
                      points="85,80 140,90 145,150 80,140"
                      fill={selectedComuna.includes('20') ? '#D97706' : '#FDE68A'}
                      stroke="#D97706"
                      strokeWidth="1.5"
                      onClick={() => setSelectedComuna('Comuna 20')}
                      className="transition-colors hover:opacity-80"
                    />
                    {/* Comuna 2 */}
                    <polygon
                      points="80,140 145,150 130,190 70,180"
                      fill="#86EFAC"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      className="transition-colors"
                    />
                  </svg>

                  {/* Comuna Pins */}
                  <button
                    onClick={() => setSelectedComuna('Comuna 3')}
                    className="absolute top-8 left-12 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow cursor-pointer transition-transform hover:scale-110"
                  >
                    C3 (San Nicolás)
                  </button>
                  <button
                    onClick={() => setSelectedComuna('Comuna 19')}
                    className="absolute top-20 left-20 bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow animate-pulse cursor-pointer transition-transform hover:scale-110"
                  >
                    ★ C19 (San Fernando)
                  </button>
                  <button
                    onClick={() => setSelectedComuna('Comuna 9')}
                    className="absolute top-28 left-10 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow cursor-pointer transition-transform hover:scale-110"
                  >
                    C9 (Alameda)
                  </button>
                  <button
                    onClick={() => setSelectedComuna('Comuna 20')}
                    className="absolute top-28 left-28 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow cursor-pointer transition-transform hover:scale-110"
                  >
                    C20 (Siloé)
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-900 block">Mecanismo de Desembolso Directo:</span>
                <p className="leading-relaxed text-[11px]">
                  Transferencia directa a cuentas de ahorros, nómina o convenios de arriendo en menos de 24 horas hábiles.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cruce automático con censo comercial distrital verificado</span>
                </div>
              </div>
            </div>

            {/* Col 3: Métricas de Desembolso & Canal de Pago (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  Métricas de Desembolso
                </span>
                <div className="font-mono text-3xl font-black text-slate-900">
                  ${disbursedTotal.toLocaleString('es-CO')}M
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  de $5.000M decretados en ayudas directas
                </span>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3 mb-4">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${(disbursedTotal / 5000) * 100}%` }}
                  />
                </div>

                <div className="h-20 flex items-end gap-2 pt-2 border-t border-slate-200">
                  {[30, 45, 60, 40, 75, 55, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-600 rounded-t transition-all hover:bg-emerald-500" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
                </div>
              </div>

              {/* Canales de Pago */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-bold text-slate-900 block">
                  Canales de Dispersión de Fondos
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-700 font-medium">Bancolombia / Daviplata</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">68%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-700 font-medium">Banco de Bogotá</span>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">24%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-700 font-medium">Giro en Efectivo (Gestor)</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
