import React, { useState } from 'react';
import {
  Building2, Landmark, Truck, Zap, DollarSign, Users,
  CheckCircle2, AlertTriangle, ArrowUpRight, Clock,
  Filter, RefreshCw, BarChart3, ShieldCheck, ChevronRight
} from 'lucide-react';
import { ExpedienteRAC, ColectivaEnjambre, FondoSolidarioInfo } from '../types/govtech';

interface VirtualOfficesProps {
  expedientes: ExpedienteRAC[];
  colectivas: ColectivaEnjambre[];
  fondoInfo: FondoSolidarioInfo;
  onUpdateEmcali: (codigo: string, kwh_adicional: number) => void;
  onViewExpediente: (codigo: string) => void;
}

export const VirtualOffices: React.FC<VirtualOfficesProps> = ({
  expedientes,
  colectivas,
  fondoInfo,
  onUpdateEmcali,
  onViewExpediente
}) => {
  const [activeOffice, setActiveOffice] = useState<'alcaldia' | 'ccc' | 'comfandi' | 'emcali'>('alcaldia');
  const [selectedComuna, setSelectedComuna] = useState<number | 'all'>('all');
  const [updatingCode, setUpdatingCode] = useState<string | null>(null);

  // Communes heat map data for Cali post-sismo
  const COMUNAS_HEATMAP = [
    { comuna: 19, nombre: 'San Fernando / Miraflores', comerciosAfectados: 142, fondoAsignado: 1250000000, reactivacionPct: 78, riesgo: 'MEDIO' },
    { comuna: 3, nombre: 'San Nicolás / San Bosco', comerciosAfectados: 98, fondoAsignado: 890000000, reactivacionPct: 62, riesgo: 'ALTO' },
    { comuna: 9, nombre: 'Alameda / Bretaña', comerciosAfectados: 76, fondoAsignado: 640000000, reactivacionPct: 84, riesgo: 'BAJO' },
    { comuna: 2, nombre: 'Granada / Centenario', comerciosAfectados: 54, fondoAsignado: 480000000, reactivacionPct: 71, riesgo: 'MEDIO' },
    { comuna: 20, nombre: 'Siloé / Cañaveralejo', comerciosAfectados: 88, fondoAsignado: 720000000, reactivacionPct: 53, riesgo: 'ALTO' },
    { comuna: 8, nombre: 'El Troncal / Chapinero', comerciosAfectados: 42, fondoAsignado: 380000000, reactivacionPct: 89, riesgo: 'BAJO' }
  ];

  // Verified suppliers list for CCC
  const CCC_SUPPLIERS = [
    { nombre: 'Harinera del Valle S.A.', insumo: 'Harinas y Premezclas Industriales', descuento: '18% Mayorista', stock: 'Disponible Inmediato', corredor: 'San Fernando / Alameda' },
    { nombre: 'Distribuidora Siderúrgica de Occidente', insumo: 'Cemento, Perfiles y Tejas', descuento: '22% Agrupado', stock: 'Alta Demanda', corredor: 'San Nicolás' },
    { nombre: 'Central CAVASA Mayorista', insumo: 'Granos, Aceites y Abarrotes', descuento: '15% Directo', stock: 'Disponible Inmediato', corredor: 'Alameda / Galerías' },
    { nombre: 'Energía Alternativa del Valle', insumo: 'Generadores Diésel y Plantas', descuento: 'Tarifa Gremial CCC', stock: 'Stock Limitado', corredor: 'Granada' }
  ];

  // Comfandi emergency microcredits
  const COMFANDI_CREDITS = [
    { linea: 'Microcrédito Capital Semilla Sismo', montoMax: '$10.000.000 COP', tasa: '0.6% Nominal Mes (Subsidiada)', gracia: '3 meses', destino: 'Nómina y Arriendo' },
    { linea: 'Subsidio al Empleo Comfandi', montoMax: '$850.000 COP / Empleado', tasa: 'No Reembolsable', gracia: 'Inmediato', destino: 'Conservación de puestos formales' },
    { linea: 'Crédito Rotativo Insumos CCC', montoMax: '$25.000.000 COP', tasa: '0.8% Mes', gracia: '1 mes', destino: 'Compras masivas en enjambre' }
  ];

  const handleSimulateEnergyReturn = async (codigo: string) => {
    setUpdatingCode(codigo);
    await onUpdateEmcali(codigo, 150);
    setTimeout(() => setUpdatingCode(null), 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Office Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Módulo C · Back-Office Interinstitucional
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            Oficinas Virtuales de Reactivación Post-Sismo
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Coordinación unificada entre la Alcaldía de Cali, Cámara de Comercio, Comfandi y EMCALI.
          </p>
        </div>

        {/* Office Switcher Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
          <button
            onClick={() => setActiveOffice('alcaldia')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeOffice === 'alcaldia'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>Alcaldía / DATIC</span>
          </button>

          <button
            onClick={() => setActiveOffice('ccc')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeOffice === 'ccc'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Cámara de Comercio (CCC)</span>
          </button>

          <button
            onClick={() => setActiveOffice('comfandi')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeOffice === 'comfandi'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>Comfandi</span>
          </button>

          <button
            onClick={() => setActiveOffice('emcali')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeOffice === 'emcali'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>EMCALI (Pasiva)</span>
          </button>
        </div>
      </div>

      {/* 1. OFICINA VIRTUAL ALCALDÍA DE CALI / DATIC */}
      {activeOffice === 'alcaldia' && (
        <div className="space-y-8">
          {/* Fund Balance Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Fondo Solidario Distrital</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                ${(fondoInfo.total / 1000000).toLocaleString('es-CO')}M COP
              </span>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                <span>Presupuesto total decretado</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Recursos Comprometidos</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">
                ${(fondoInfo.comprometido / 1000000).toLocaleString('es-CO')}M COP
              </span>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <span>36.9% del fondo en ejecución</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Saldo Disponible</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-blue-700 tabular-nums">
                ${(fondoInfo.disponible / 1000000).toLocaleString('es-CO')}M COP
              </span>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                <span>Garantía de liquidez comercial</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Reactivación Telemétrica</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                {fondoInfo.tasa_reactivacion_emcali}%
              </span>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmado por EMCALI (kWh)</span>
              </div>
            </div>
          </div>

          {/* Communes Heat Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Mapa de Calor por Comunas y Corredores Comerciales
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoreo de afectación, desembolsos y tasa de reapertura física de comercios.
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-semibold self-start sm:self-center">
                6 Corredores Prioritarios Post-Sismo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMUNAS_HEATMAP.map((item) => (
                <div
                  key={item.comuna}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Comuna {item.comuna}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{item.nombre}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.riesgo === 'ALTO'
                          ? 'bg-red-100 text-red-800'
                          : item.riesgo === 'MEDIO'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Riesgo {item.riesgo}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 my-3">
                    <div className="flex justify-between">
                      <span>Comercios Afectados:</span>
                      <span className="font-bold text-slate-900">{item.comerciosAfectados}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subsidios Asignados:</span>
                      <span className="font-mono text-slate-900 font-semibold">
                        ${(item.fondoAsignado / 1000000).toFixed(0)}M COP
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                      <span>Reactivación física real</span>
                      <span className="font-bold text-slate-900">{item.reactivacionPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${item.reactivacionPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. OFICINA VIRTUAL CÁMARA DE COMERCIO DE CALI (CCC) */}
      {activeOffice === 'ccc' && (
        <div className="space-y-8">
          {/* Active Swarm Clusters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  Compras Colectivas por Corredor
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Consolidación de Enjambres Comerciales Activos
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Agrupación de demanda para obtener un 18% de ahorro en compras al por mayor y fletes compartidos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colectivas.map((col) => (
                <div
                  key={col.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        Comuna {col.comuna} · {col.barrio}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{col.nombre}</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                      {col.estado.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">{col.rubro}</p>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Comercios Agrupados:</span>
                      <span className="font-bold text-slate-900">{col.comerciantes_agrupados} negocios</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Beneficio Pactado:</span>
                      <span className="font-bold text-emerald-700">{col.ahorro_pactado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Proveedor Verificado:</span>
                      <span className="text-slate-800 font-medium">{col.proveedor_colectivo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-500 text-[11px]">
                      Próximo Despacho: <strong>{col.fecha_proximo_despacho}</strong>
                    </span>
                    <button
                      onClick={() => alert(`Despacho de camión colectivo para ${col.nombre} programado.`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Consolidar Camión
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Suppliers Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Red de Proveedores Verificados de la Cámara de Comercio de Cali
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Empresa Proveedora</th>
                    <th className="py-2.5 px-3">Línea de Insumos</th>
                    <th className="py-2.5 px-3">Descuento Mayorista Pactado</th>
                    <th className="py-2.5 px-3">Corredor de Cobertura</th>
                    <th className="py-2.5 px-3">Disponibilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CCC_SUPPLIERS.map((sup, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sup.nombre}</td>
                      <td className="py-2.5 px-3">{sup.insumo}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">{sup.descuento}</td>
                      <td className="py-2.5 px-3">{sup.corredor}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {sup.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. OFICINA VIRTUAL COMFANDI */}
      {activeOffice === 'comfandi' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                Líneas de Apoyo Financiero Comfandi
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Microcréditos de Emergencia Post-Sismo & Subsidios de Caja
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Financiación sin burocracia con desembolso ágil para microempresarios y trabajadores de Cali.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMFANDI_CREDITS.map((cred, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">{cred.linea}</h3>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Monto Máximo:</span>
                        <span className="font-bold text-slate-900">{cred.montoMax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tasa de Interés:</span>
                        <span className="font-semibold text-emerald-700">{cred.tasa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Periodo de Gracia:</span>
                        <span className="text-slate-800 font-medium">{cred.gracia}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Destinación:</span>
                        <span className="text-slate-800 font-medium">{cred.destino}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Solicitud de microcrédito Comfandi iniciada para ${cred.linea}`)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Aprobar Cupo de Emergencia
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. OFICINA VIRTUAL EMCALI (VERIFICACIÓN PASIVA KWH) */}
      {activeOffice === 'emcali' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Principio 5 de Diseño · Verificación Pasiva
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Panel Telemétrico de Retorno de Consumo Eléctrico Comercial (kWh)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  El comerciante NO envía informes ni fotos. El sistema detecta el encendido de hornos, vitrinas y motores mediante la telemetría del medidor.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold">Telemetría Smart Grid EMCALI en Vivo</span>
              </div>
            </div>

            {/* Expedientes Table with EMCALI telemetry status */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Radicado RAC</th>
                    <th className="py-2.5 px-3">Comercio & Titular</th>
                    <th className="py-2.5 px-3">Cuenta Contrato EMCALI</th>
                    <th className="py-2.5 px-3">Consumo Base</th>
                    <th className="py-2.5 px-3">Lectura Actual (kWh)</th>
                    <th className="py-2.5 px-3">% Recuperación</th>
                    <th className="py-2.5 px-3">Semáforo Físico</th>
                    <th className="py-2.5 px-3 text-right">Simular Telemetría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expedientes.map((exp) => {
                    const vp = exp.verificacion_pasiva;
                    const isReopened = vp.estado_reapertura === 'REAPERTURA_CONFIRMADA' || (vp.porcentaje_recuperacion || 0) >= 65;

                    return (
                      <tr key={exp.codigo} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3">
                          <button
                            onClick={() => onViewExpediente(exp.codigo)}
                            className="font-mono font-bold text-emerald-700 hover:underline"
                          >
                            {exp.codigo}
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{exp.comerciante.negocio}</span>
                          <span className="text-[11px] text-slate-500">{exp.comerciante.barrio} (C{exp.comerciante.comuna})</span>
                        </td>

                        <td className="py-3 px-3 font-mono font-medium text-slate-800">
                          {vp.cuenta_contrato_emcali}
                        </td>

                        <td className="py-3 px-3 tabular-nums font-mono">
                          {vp.kwh_base || 350} kWh/mes
                        </td>

                        <td className="py-3 px-3 tabular-nums font-mono font-bold text-slate-900">
                          {vp.kwh_actual || 45} kWh
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold tabular-nums text-slate-900 text-xs">
                              {vp.porcentaje_recuperacion || 20}%
                            </span>
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isReopened ? 'bg-emerald-600' : 'bg-amber-500'}`}
                                style={{ width: `${Math.min(100, vp.porcentaje_recuperacion || 20)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 w-fit ${
                              isReopened
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isReopened ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                            <span>{isReopened ? 'Reactivado' : 'En Proceso'}</span>
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleSimulateEnergyReturn(exp.codigo)}
                            disabled={updatingCode === exp.codigo}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200 transition-colors disabled:opacity-50"
                            title="Simula que el medidor registra recuperación de consumo eléctrico"
                          >
                            {updatingCode === exp.codigo ? 'Midiendo...' : '+150 kWh (Simular)'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
