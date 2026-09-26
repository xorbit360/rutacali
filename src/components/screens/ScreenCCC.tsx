import React, { useState } from 'react';
import {
  Truck, ShoppingCart, CheckCircle2, MapPin, Users,
  ArrowRight, ShieldCheck, Check, Package, Store, Sparkles,
  Calculator, TrendingDown, DollarSign, Clock, Layers,
  ShoppingBag, Calendar, Eye, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { ComercianteRow, EnjambreRow } from '../../types/sheets';

interface ScreenCCCProps {
  comerciantes: ComercianteRow[];
  enjambres: EnjambreRow[];
  onOpenGoogleSheets: () => void;
  onConsolidarPedido?: (idEnjambre: string) => void;
}

export const ScreenCCC: React.FC<ScreenCCCProps> = ({
  comerciantes,
  enjambres,
  onOpenGoogleSheets,
  onConsolidarPedido
}) => {
  const [activeCccTab, setActiveCccTab] = useState<'ruta3_insumos' | 'ruta4_clientes'>('ruta3_insumos');
  const [activeEnjambres, setActiveEnjambres] = useState(enjambres);
  const [confirmedClusters, setConfirmedClusters] = useState<string[]>(['ENJ-C19-001']);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Ruta 4 state: Puestos en La 14 de la 80 y Ruedas de Negocio
  const [assignedStalls, setAssignedStalls] = useState<string[]>(['RAC-2026-0422']);
  const [scheduledB2B, setScheduledB2B] = useState<string[]>(['RAC-2026-0418']);

  // Interactive 18% Savings Calculator state
  const [calcInsumo, setCalcInsumo] = useState<'harina' | 'aceite' | 'cemento' | 'azucar'>('harina');
  const [calcCantidad, setCalcCantidad] = useState<number>(30); // bultos o cajas

  const INSUMOS_CONFIG = {
    harina: {
      nombre: 'Bulto Harina de Trigo (50 kg) - Harinera del Valle',
      precioIndividual: 165000,
      proveedor: 'Harinera del Valle S.A.',
      unidad: 'bultos'
    },
    aceite: {
      nombre: 'Caja Aceite Vegetal (12 x 1000ml) - CAVASA Mayorista',
      precioIndividual: 98000,
      proveedor: 'Central CAVASA Mayorista',
      unidad: 'cajas'
    },
    cemento: {
      nombre: 'Bulto Cemento Gris Uso General (50 kg)',
      precioIndividual: 38000,
      proveedor: 'Distribuidora Siderúrgica de Occidente',
      unidad: 'bultos'
    },
    azucar: {
      nombre: 'Bulto Azúcar Blanco Refinado (50 kg) - Ingenio del Valle',
      precioIndividual: 190000,
      proveedor: 'Distribuidora de Azúcares de Occidente',
      unidad: 'bultos'
    }
  };

  const currentItem = INSUMOS_CONFIG[calcInsumo];
  const precioUnitarioConDescuento = Math.round(currentItem.precioIndividual * 0.82); // 18% discount
  const costoTotalSinDescuento = currentItem.precioIndividual * calcCantidad;
  const costoTotalConDescuento = precioUnitarioConDescuento * calcCantidad;
  const ahorroTotalPesos = costoTotalSinDescuento - costoTotalConDescuento;

  const handleConsolidar = (id: string, nombre: string) => {
    if (!confirmedClusters.includes(id)) {
      setConfirmedClusters(prev => [...prev, id]);
      if (onConsolidarPedido) onConsolidarPedido(id);
      setNotificationMsg(`¡Camión de carga consolidado para ${nombre}! Despacho programado con 18% de ahorro.`);
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  const handleAssignStall = (id: string, negocio: string) => {
    if (!assignedStalls.includes(id)) {
      setAssignedStalls(prev => [...prev, id]);
      setNotificationMsg(`¡Puesto comercial temporal asignado a ${negocio} en La 14 de la 80!`);
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  const handleScheduleB2B = (id: string, negocio: string) => {
    if (!scheduledB2B.includes(id)) {
      setScheduledB2B(prev => [...prev, id]);
      setNotificationMsg(`¡Rueda de negocios CCC agendada para ${negocio} con 5 empresas compradoras de Cali!`);
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  // Ruedas de Negocios Corporativas CCC
  const B2B_BUYERS = [
    { empresa: 'Grupo Éxito & Superinter Cali', demanda: 'Proveeduría de Panadería y Abarrotes', cupos: '15 Comercios' },
    { empresa: 'Asociación de Restaurantes de Granada (ACODRES)', demanda: 'Suministro diario de verduras y cárnicos', cupos: '28 Comercios' },
    { empresa: 'Hoteles del Valle del Cauca (COTELCO)', demanda: 'Productos de repostería y pan de bono tradicional', cupos: '12 Comercios' },
    { empresa: 'Comedores Comunitarios de Cali', demanda: 'Granos, aceites y harinas en bulto', cupos: '40 Comercios' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* 1. FICHA OFICIAL DE ROL INSTITUCIONAL: RUTA 3 Y RUTA 4 */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 mb-6 shadow-xl border border-blue-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/40 border border-blue-400/30">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 px-3 py-0.5 rounded-full border border-blue-500/30">
                  ROL INSTITUCIONAL 2 DE 3 · OPERA RUTA 3 Y RUTA 4
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Cámara de Comercio de Cali (CCC) · Articulación Gremial y Mercados
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Cámara de Comercio de Cali · Compras en Enjambre (18%) & Vitrina Comercial
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                <strong>¿Cuál es el rol exclusivo de la CCC?</strong> Lidera dos frentes críticos de la reactivación:
                <br />
                <strong>1. Ruta 3 (Insumos):</strong> Agrupa la demanda de tenderos y panaderos para negociar compras mayoristas directas con el <strong>18% de ahorro</strong> y fletes compartidos.
                <br />
                <strong>2. Ruta 4 (Clientes y Ventas):</strong> Habilita <strong>vitrinas comerciales y puestos de venta temporales en La 14 de la 80</strong> y conecta a comerciantes afectados en <strong>ruedas de negocio B2B</strong> para recuperar clientes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenGoogleSheets}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Ver Hoja "Enjambres_Insumos"</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reglas de Oro y Competencias de la CCC */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-blue-400 font-bold block mb-0.5">✓ RUTA 3 (COMPRAS EN ENJAMBRE):</span>
            <span className="text-slate-300">Consolida pedidos masivos de 3 a 5 comerciantes por cuadra para fletes y precios mayoristas directos.</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-orange-400 font-bold block mb-0.5">✓ RUTA 4 (CLIENTES Y VENTAS CCC):</span>
            <span className="text-slate-300">Puestos comerciales en La 14 de la 80, ferias de corredor y ruedas de negocios con empresas compradoras.</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block mb-0.5">🚫 CERO BUROCRACIA:</span>
            <span className="text-slate-300">No exige registro mercantil vigente ni cuotas de afiliación; incluye a todos los comerciantes populares.</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="mb-6 p-4 bg-blue-500 text-slate-950 rounded-2xl shadow-lg border border-blue-400 flex items-center justify-between font-bold text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded font-mono">
            Acción Confirmada
          </span>
        </div>
      )}

      {/* 2. TABLERO INTERACTIVO DE LA CCC CON CONMUTADOR DE RUTA 3 Y RUTA 4 */}
      <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200">
          {/* Header & Sub-Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                CCC
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Cámara de Comercio de Cali · Centro de Operaciones Comerciales
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Reactivación Comercial por Corredores: Comunas 19, 3, 9 y La 14 de la 80
                </p>
              </div>
            </div>

            {/* Sub-Tab Selector for Ruta 3 vs Ruta 4 */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold self-start sm:self-center">
              <button
                onClick={() => setActiveCccTab('ruta3_insumos')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeCccTab === 'ruta3_insumos'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Ruta 3: Compras Colectivas (18%)</span>
              </button>

              <button
                onClick={() => setActiveCccTab('ruta4_clientes')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeCccTab === 'ruta4_clientes'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Ruta 4: Vitrina Comercial & La 14 de la 80</span>
              </button>
            </div>
          </div>

          {/* VISTA RUTA 3: COMPRAS COLECTIVAS EN ENJAMBRE */}
          {activeCccTab === 'ruta3_insumos' && (
            <div className="space-y-6">
              {/* CALCULADORA INTERACTIVA DE AHORRO 18% EN ENJAMBRE */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 rounded-2xl border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-blue-700" />
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Simulador Interactivo de Ahorro Colectivo CCC (18%)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Pruebe cómo cambia el costo al agrupar la compra de varios tenderos de una misma cuadra con proveedores verificados por la CCC.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Selector de Insumo */}
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Seleccionar Insumo de Alta Demanda:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCalcInsumo('harina')}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                          calcInsumo === 'harina'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        🍞 Harina Trigo 50kg
                      </button>
                      <button
                        onClick={() => setCalcInsumo('aceite')}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                          calcInsumo === 'aceite'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        🛢️ Aceite Vegetal
                      </button>
                      <button
                        onClick={() => setCalcInsumo('cemento')}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                          calcInsumo === 'cemento'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        🧱 Cemento Gris
                      </button>
                      <button
                        onClick={() => setCalcInsumo('azucar')}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                          calcInsumo === 'azucar'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        🍬 Azúcar Blanco
                      </button>
                    </div>
                  </div>

                  {/* Slider de Cantidad Agrupada */}
                  <div className="md:col-span-3 space-y-1.5 bg-white p-3.5 rounded-xl border border-blue-200/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Cantidad Agrupada:</span>
                      <span className="font-mono font-black text-blue-700 text-sm">
                        {calcCantidad} {currentItem.unidad}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={calcCantidad}
                      onChange={(e) => setCalcCantidad(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Demanda combinada de 3 tenderos
                    </span>
                  </div>

                  {/* Resultado del Ahorro */}
                  <div className="md:col-span-4 bg-emerald-600 text-white p-4 rounded-xl shadow-md space-y-1">
                    <span className="text-[11px] text-emerald-100 font-semibold block uppercase tracking-wider">
                      Ahorro Directo Obtenido (18%):
                    </span>
                    <div className="font-mono text-2xl font-black text-white">
                      ${ahorroTotalPesos.toLocaleString('es-CO')} COP
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-100 pt-1 border-t border-emerald-500/50">
                      <span>Pago Individual: ${(costoTotalSinDescuento / 1000).toFixed(0)}k</span>
                      <span className="font-bold text-white">Pago Enjambre: ${(costoTotalConDescuento / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Enjambres Activos & Directorio de Proveedores */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Col: Enjambres Comerciales Activos (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        Enjambres Comerciales por Corredor ({enjambres.length})
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        Hojas centralizadas en Google Sheets "Enjambres_Insumos"
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Fletes Compartidos
                    </span>
                  </div>

                  <div className="space-y-3">
                    {enjambres.map((enj) => {
                      const isConfirmed = confirmedClusters.includes(enj.ID_Enjambre);
                      return (
                        <div
                          key={enj.ID_Enjambre}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-black text-slate-900 block">
                                {enj.Insumo_Requerido}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500">
                                {enj.ID_Enjambre} · {enj.Cuadrante_Zona}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                isConfirmed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {isConfirmed ? 'Camión Despachado' : enj.Estado_Entrega}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Demanda:</span>
                              <span className="font-bold text-slate-900">{enj.Cantidad_Total}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Tenderos:</span>
                              <span className="font-bold text-blue-700">{enj.Tenderos_Agrupados}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Ahorro Pactado:</span>
                              <span className="font-bold text-emerald-700">{enj.Descuento_Logrado}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="text-xs text-slate-600 font-medium">
                              Mayorista: <strong>{enj.Mayorista_Asignado}</strong>
                            </span>

                            <button
                              onClick={() => handleConsolidar(enj.ID_Enjambre, enj.Insumo_Requerido)}
                              disabled={isConfirmed}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isConfirmed
                                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5'
                              }`}
                            >
                              {isConfirmed ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Ruta Consolidada</span>
                                </>
                              ) : (
                                <>
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Consolidar Camión</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Col: Proveedores Verificados de la CCC (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-900 mb-1">
                      Red de Mayoristas Verificados (Convenio CCC)
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Empresas afiliadas con cupo asegurado para abastecer a tenderos populares.
                    </p>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900 block">Harinera del Valle S.A.</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">18% Dto</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Harinas panificables y premezclas</span>
                        <span className="text-[10px] text-blue-700 font-semibold block mt-1">Cobertura: Comuna 19 y Comuna 9</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900 block">Central CAVASA Mayorista</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">18% Dto</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Abarrotes, aceites, granos y enlatados</span>
                        <span className="text-[10px] text-blue-700 font-semibold block mt-1">Cobertura: Todo Santiago de Cali</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900 block">Siderúrgica de Occidente</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">22% Dto</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Cemento, perfiles y láminas de techo</span>
                        <span className="text-[10px] text-blue-700 font-semibold block mt-1">Cobertura: Comuna 3 (San Nicolás)</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
                      <span className="font-bold block">Compromiso Logístico CCC:</span>
                      <span>Los fletes se dividen proporcionalmente entre los negocios participantes, reduciendo el costo de transporte en un 65%.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA RUTA 4: CLIENTES, VITRINA COMERCIAL Y RUEDAS DE NEGOCIO (CCC) */}
          {activeCccTab === 'ruta4_clientes' && (
            <div className="space-y-6">
              {/* Banner Ruta 4 */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-orange-50 via-amber-50/50 to-slate-50 rounded-2xl border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Ruta 4: Vitrina Comercial y Reactivación de Ventas (Cámara de Comercio de Cali)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Para los comerciantes con calles cerradas, escombros o baja afluencia, la <strong>Cámara de Comercio de Cali</strong> habilita espacios provisionales en <strong>La 14 de la 80</strong> y conecta la oferta con compradores corporativos mediante ruedas de negocio B2B.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Col 1: Puestos en La 14 de la 80 y Sedes Temporales (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Comercios Asignados a Vitrinas Comerciales y La 14 de la 80
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Puestos temporales equipados y con alta afluencia de público
                      </span>
                    </div>
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                      Cero Costo de Arriendo
                    </span>
                  </div>

                  <div className="space-y-3">
                    {comerciantes.slice(0, 5).map((c) => {
                      const isStallAssigned = assignedStalls.includes(c.ID_Expediente);
                      return (
                        <div
                          key={c.ID_Expediente}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-orange-300 transition-all shadow-sm space-y-2.5"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-xs font-black text-slate-900 block leading-tight">
                                {c.Nombre_Comerciante}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {c.ID_Expediente} · {c.Barrio_Comuna}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isStallAssigned
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {isStallAssigned ? 'Puesto Asignado' : 'Pendiente de Traslado'}
                            </span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                            <span>Sede Temporal: <strong>La 14 de la 80 (Isla Comercial CCC)</strong></span>
                            <span className="text-[10px] text-emerald-700 font-bold">100% Subsidiado</span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-500">
                              Sector: Abarrotes / Panadería
                            </span>

                            <button
                              onClick={() => handleAssignStall(c.ID_Expediente, c.Nombre_Comerciante)}
                              disabled={isStallAssigned}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isStallAssigned
                                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm flex items-center gap-1.5'
                              }`}
                            >
                              {isStallAssigned ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Puesto Habilitado</span>
                                </>
                              ) : (
                                <>
                                  <Store className="w-3.5 h-3.5" />
                                  <span>Asignar Puesto en La 14</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Col 2: Ruedas de Negocios Corporativas CCC (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      Ruedas de Negocio Virtuales CCC (B2B)
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Empresas y cadenas que compran directamente a los comerciantes de la red.
                    </p>

                    <div className="space-y-3 text-xs">
                      {B2B_BUYERS.map((buyer, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 block">{buyer.empresa}</span>
                            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                              {buyer.cupos}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{buyer.demanda}</p>
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => handleScheduleB2B(`BUYER-${idx}`, buyer.empresa)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors"
                            >
                              Agendar Encuentro B2B
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-950 space-y-1">
                      <span className="font-bold block">Vitrina Virtual "Compre Caleño":</span>
                      <p>
                        Todos los comerciantes con código RAC-2026 son incluidos automáticamente en el mapa geolocalizado de ventas de la CCC para clientes residenciales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
