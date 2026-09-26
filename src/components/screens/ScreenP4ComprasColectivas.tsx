import React from 'react';
import {
  MapPin, Shield, CheckCircle2, Truck, Clock, Store,
  ArrowRight, Users, Check, ShoppingBag, Package
} from 'lucide-react';

interface ScreenP4ComprasColectivasProps {
  onAdvanceToDashboard: () => void;
  onOpenGoogleSheets: () => void;
}

export const ScreenP4ComprasColectivas: React.FC<ScreenP4ComprasColectivasProps> = ({
  onAdvanceToDashboard,
  onOpenGoogleSheets
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PASO D / PANTALLA 4 · MOTOR DE COMPRAS COLECTIVAS EN ENJAMBRE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Compras Colectivas en Enjambre (18% Ahorro Directo)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Agrupación de demanda de 3 a 5 tenderos por cuadrante para pedidos consolidados a mayoristas con la CCC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGoogleSheets}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
          >
            Ver Hoja "Enjambres_Insumos"
          </button>
          <button
            onClick={onAdvanceToDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>Ver Portales Institucionales (Alcaldía / CCC / Comfandi)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Frame Mockup (Matching pc_p4_compras_colectivas.png exactly) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
        {/* Inside Canvas */}
        <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-inner">
          {/* Top Bar with Title and 18% Blue Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Ruta de Compras Colectivas en Enjambre - Cali
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Comuna 19 San Fernando, Cali</span>
              </div>
            </div>

            {/* Blue 18% Highlight Badge (Matching pc_p4_compras_colectivas.png) */}
            <div className="bg-[#2563EB] text-white px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center gap-3 self-start md:self-center">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black block leading-tight">
                  18% de Ahorro
                </span>
                <span className="text-xs text-blue-100 block leading-tight font-medium">
                  Colectivo en Insumos
                </span>
              </div>
            </div>
          </div>

          {/* 3-Column Layout from image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Col 1: Store Icon & Estado Pedido Masivo (3 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Store illustration card */}
              <div className="bg-[#EFF6FF] rounded-2xl p-8 flex items-center justify-center border border-blue-100 shadow-sm aspect-square max-h-64">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-blue-100 flex items-center justify-center">
                    <Store className="w-20 h-20 text-[#2563EB]" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Cuadrante C19
                  </span>
                </div>
              </div>

              {/* Estado del Pedido Masivo */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-semibold block">
                  Estado del Pedido Masivo
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      Confirmado:
                    </h4>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">
                      Listo para Proveedor
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Tiendas Participantes (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              {/* Mini store icons top row */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Store className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Store className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                Tiendas Participantes
              </h3>

              {/* List of 4 stores */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      DC
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        Don Carlos - Tienda La Esquina
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      DE
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        Doña Elena - Mini-Market Sol
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      TA
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        Tienda Los Almendros
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      BV
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        Abarrotes El Buen Vecino
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: Pedido Grupal & Desglose de Insumos (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Pedido Grupal en Curso */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs text-slate-500 font-semibold block">
                  Pedido Grupal en Curso
                </span>
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span className="text-blue-600 font-bold">Abierto</span>
                  <span className="text-blue-600 font-bold">Recaudando</span>
                  <span className="text-emerald-700 font-bold">Confirmado</span>
                  <span className="text-slate-400">Despachado</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Desglose de Insumos (Toneladas) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 mb-3">
                  Desglose de Insumos (Toneladas)
                </h4>

                {/* Vertical bar chart matching image pc_p4_compras_colectivas.png */}
                <div className="h-32 flex items-end gap-6 justify-center pt-4 pb-2 border-b border-slate-100">
                  {/* Harina 3T (Orange) */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-700 font-mono">3.0T</span>
                    <div className="w-10 bg-[#EA580C] rounded-t-lg transition-all" style={{ height: '90px' }} />
                    <span className="text-[10px] font-semibold text-slate-600 mt-1">Harina (3T)</span>
                  </div>

                  {/* Aceite 1.5T (Yellow) */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-700 font-mono">1.5T</span>
                    <div className="w-10 bg-[#EAB308] rounded-t-lg transition-all" style={{ height: '48px' }} />
                    <span className="text-[10px] font-semibold text-slate-600 mt-1">Aceite (1.5T)</span>
                  </div>

                  {/* Granos 2T (Green) */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-700 font-mono">2.0T</span>
                    <div className="w-10 bg-[#22C55E] rounded-t-lg transition-all" style={{ height: '65px' }} />
                    <span className="text-[10px] font-semibold text-slate-600 mt-1">Granos (2T)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-2">
                  Total volumen de 101 granos (2T) consolidado
                </p>
              </div>

              {/* Despacho del Proveedor Timer */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    Despacho del Proveedor en:
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                    14:32:08
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Tiempo estimado de llegada a Comuna 19
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
