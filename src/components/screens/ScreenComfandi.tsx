import React, { useState } from 'react';
import {
  Wrench, CheckCircle2, Truck, DollarSign, Users,
  ArrowRight, ShieldCheck, Check, Clock, PackageCheck,
  Calculator, Sparkles, Building, FileCheck, ArrowUpRight
} from 'lucide-react';
import { ComercianteRow } from '../../types/sheets';

interface ScreenComfandiProps {
  comerciantes: ComercianteRow[];
  onOpenGoogleSheets: () => void;
}

export const ScreenComfandi: React.FC<ScreenComfandiProps> = ({
  comerciantes,
  onOpenGoogleSheets
}) => {
  const [preapprovedCount, setPreapprovedCount] = useState(256);
  const [approvedStatus, setApprovedStatus] = useState<Record<string, string>>({
    'RAC-2026-0423': 'Bono Maquinaria Aprobado'
  });
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Microcredit simulator state
  const [montoCredito, setMontoCredito] = useState<number>(10000000); // $10M COP
  const [plazoMeses, setPlazoMeses] = useState<number>(24);
  const [periodoGracia, setPeriodoGracia] = useState<number>(3); // 3 meses

  // Calculation with subsidized 0.6% monthly interest rate
  const tasaMensual = 0.006;
  const cuotaMensual = Math.round((montoCredito * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses))) / (Math.pow(1 + tasaMensual, plazoMeses) - 1));
  const cuotaBancariaComun = Math.round((montoCredito * (0.019 * Math.pow(1 + 0.019, plazoMeses))) / (Math.pow(1 + 0.019, plazoMeses) - 1));
  const ahorroMensualInteres = cuotaBancariaComun - cuotaMensual;

  const handleApproveMachinery = (id: string, negocio: string) => {
    setApprovedStatus(prev => ({
      ...prev,
      [id]: 'Bono Maquinaria Aprobado ($8.000.000 COP)'
    }));
    setNotificationMsg(`¡Subsidio de maquinaria aprobado para ${negocio} (${id})! Despacho prioritario de equipamiento.`);
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* 1. FICHA OFICIAL DE ROL INSTITUCIONAL */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 mb-6 shadow-xl border border-amber-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-900/40 border border-amber-400/30">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full border border-amber-500/30">
                  ROL INSTITUCIONAL 3 DE 3
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Comfandi · Caja de Compensación Familiar del Valle del Cauca
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Comfandi · Microcrédito Social y Reposición de Maquinaria
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                <strong>¿Cuál es el rol exclusivo de Comfandi?</strong> Proteger el empleo y financiar la <strong>reposición inmediata de maquinaria dañada</strong> (hornos, vitrinas refrigeradas, motores eléctricos, herramientas) mediante <strong>microcrédito de emergencia con tasa subsidiada del 0.6% nominal mes</strong> y periodos de gracia de hasta 3 meses.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenGoogleSheets}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Ver Fila en Google Sheets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reglas de Oro y Competencias de Comfandi */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-amber-400 font-bold block mb-0.5">✓ QUÉ HACE COMFANDI:</span>
            <span className="text-slate-300">Otorga créditos blandos de emergencia, entrega bonos de reposición de maquinaria y gira subsidios de nómina familiar.</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block mb-0.5">🚫 QUÉ NO PIDE (CERO BUROCRACIA):</span>
            <span className="text-slate-300">Sin exigencia de estados contables dictaminados, sin codeudores con finca raíz ni comprobantes tributarios DIAN.</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-blue-400 font-bold block mb-0.5">⏱️ CONDICIONES POST-SISMO:</span>
            <span className="text-slate-300">Tasa preferencial de 0.6% mes (frente a 1.9% comercial) con 3 meses de gracia para empezar a pagar.</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="mb-6 p-4 bg-amber-500 text-slate-950 rounded-2xl shadow-lg border border-amber-400 flex items-center justify-between font-bold text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded font-mono">
            Bono Aprobado
          </span>
        </div>
      )}

      {/* 2. TABLERO INTERACTIVO DE COMFANDI */}
      <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                CF
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Oficina Virtual de Crédito Social y Adecuación de Maquinaria
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Atención Prioritaria a Microempresarios y Empleados de Cali Post-Sismo
                </p>
              </div>
            </div>

            <div className="text-xs bg-amber-50 text-amber-900 font-bold px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tasa Subsidiada Comfandi: 0.6% Nominal Mes</span>
            </div>
          </div>

          {/* SIMULADOR INTERACTIVO DE CRÉDITO DE EMERGENCIA */}
          <div className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-amber-50 via-orange-50/40 to-slate-50 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Simulador de Microcrédito de Emergencia Post-Sismo (0.6% Mes)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Consulte cómo queda la cuota mensual subsidiada de un comerciante de Cali sin pagar cuotas durante los primeros 3 meses de reactivación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Slider Monto */}
              <div className="md:col-span-4 space-y-1.5 bg-white p-3.5 rounded-xl border border-amber-200/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Monto Solicitado:</span>
                  <span className="font-mono font-black text-amber-800 text-sm">
                    ${(montoCredito / 1000000).toFixed(1)}M COP
                  </span>
                </div>
                <input
                  type="range"
                  min="2000000"
                  max="25000000"
                  step="1000000"
                  value={montoCredito}
                  onChange={(e) => setMontoCredito(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$2M (Básico)</span>
                  <span>$25M (Máximo)</span>
                </div>
              </div>

              {/* Selector Plazo & Gracia */}
              <div className="md:col-span-4 space-y-2 bg-white p-3.5 rounded-xl border border-amber-200/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Plazo de Pago:</span>
                  <div className="flex gap-1">
                    {[12, 24, 36].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlazoMeses(p)}
                        className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                          plazoMeses === p
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {p}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Periodo de Gracia:</span>
                  <div className="flex gap-1">
                    {[1, 3, 6].map((g) => (
                      <button
                        key={g}
                        onClick={() => setPeriodoGracia(g)}
                        className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                          periodoGracia === g
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {g} meses
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resultado de la Cuota */}
              <div className="md:col-span-4 bg-amber-600 text-slate-950 p-4 rounded-xl shadow-md space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-900">
                  Cuota Mensual Subsidiada (0.6% mes):
                </span>
                <div className="font-mono text-2xl font-black text-slate-950">
                  ${cuotaMensual.toLocaleString('es-CO')} COP/mes
                </div>
                <div className="text-[11px] font-medium pt-1 border-t border-amber-700/30 text-amber-950">
                  Ahorro vs crédito bancario tradicional: <strong>${ahorroMensualInteres.toLocaleString('es-CO')} COP/mes</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Columns matching GovTech Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Col 1: Solicitudes de Reequipamiento de Maquinaria (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">
                  Solicitudes de Maquinaria e Infraestructura
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Sin RUT DIAN
                </span>
              </div>

              <div className="space-y-3">
                {comerciantes
                  .filter(c => c.Ruta_Asignada.includes('Ruta 2') || c.Ruta_Asignada.includes('Maquinaria') || c.ID_Expediente.includes('0423'))
                  .concat(comerciantes.slice(0, 3))
                  .slice(0, 4)
                  .map((c) => {
                    const isApproved = approvedStatus[c.ID_Expediente];
                    return (
                      <div
                        key={c.ID_Expediente}
                        className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2.5"
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
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isApproved ? 'Aprobado' : 'En Evaluación'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-500 block text-[10px]">Daño Reportado Post-Sismo:</span>
                          <span className="font-semibold text-slate-800">
                            Horno rotatorio y vitrina exhibidora con fisuras estructurales.
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-amber-800 font-mono">
                            Cupo: $8.000.000 COP
                          </span>

                          <button
                            onClick={() => handleApproveMachinery(c.ID_Expediente, c.Nombre_Comerciante)}
                            disabled={!!isApproved}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800 cursor-default flex items-center gap-1'
                                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1'
                            }`}
                          >
                            {isApproved ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Bono Despachado</span>
                              </>
                            ) : (
                              <>
                                <PackageCheck className="w-3.5 h-3.5" />
                                <span>Aprobar Maquinaria</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Col 2: Líneas de Crédito & Estado de Entregas (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                <span className="text-xs font-bold text-slate-900 block mb-3">
                  Líneas Especiales Comfandi Post-Sismo
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>Línea Capital Semilla Sismo</span>
                      <span className="text-emerald-700 font-mono">Tasa 0.6%</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Hasta $10M para nómina y arriendo</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span>Subsidio al Empleo Familiar</span>
                      <span className="text-blue-700 font-mono">No Reembolsable</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">$850.000 COP por empleado protegido</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span>Crédito Rotativo Insumos CCC</span>
                      <span className="text-amber-700 font-mono">Tasa 0.8%</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Hasta $25M para compras en enjambre</span>
                  </div>
                </div>
              </div>

              {/* Delivery Tracker */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Reposición Física de Equipos:</span>
                  <span className="font-bold text-emerald-700 font-mono">85% Entregado</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Técnicos de Comfandi realizan el montaje de hornos y vitrinas directamente en los locales de San Fernando y Alameda.
                </p>
              </div>
            </div>

            {/* Col 3: Métricas de Apoyo Social (3 cols) */}
            <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-3">
                  Impacto Social y Familias Asistidas
                </span>

                <div className="space-y-3 my-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Familias de Comerciantes:</span>
                    <span className="font-mono text-2xl font-black text-slate-900">1,240</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">Empleos salvaguardados</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Maquinaria Despachada:</span>
                    <span className="font-mono text-2xl font-black text-amber-700">$500M COP</span>
                    <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">En kits de equipamiento</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] text-amber-900 font-bold block">
                  Sin Burocracia DIAN
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5">
                  Articulado con Google Sheets
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
