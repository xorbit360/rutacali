import React, { useState } from 'react';
import {
  Layers, CheckCircle2, ShieldCheck, ArrowRight, Check,
  Clock, Database, RefreshCw, Send, AlertCircle
} from 'lucide-react';
import { ComercianteRow } from '../../types/sheets';

interface ScreenInteroperabilidadProps {
  comerciantes: ComercianteRow[];
  onOpenGoogleSheets: () => void;
  onApproveAllOrders?: () => void;
}

export const ScreenInteroperabilidad: React.FC<ScreenInteroperabilidadProps> = ({
  comerciantes,
  onOpenGoogleSheets,
  onApproveAllOrders
}) => {
  const [isBulkApproved, setIsBulkApproved] = useState(false);
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('all');

  const handleBulkApprove = () => {
    setIsBulkApproved(true);
    if (onApproveAllOrders) onApproveAllOrders();
  };

  const filteredList = comerciantes.filter(c => {
    if (selectedEntityFilter === 'alcaldia') return c.Entidad_Encargada.includes('Alcaldía') || c.Entidad_Encargada.includes('Desarrollo');
    if (selectedEntityFilter === 'ccc') return c.Entidad_Encargada.includes('Cámara') || c.Entidad_Encargada.includes('CCC');
    if (selectedEntityFilter === 'comfandi') return c.Entidad_Encargada.includes('Comfandi');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Role explanation header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 mb-6 shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  ROL INSTITUCIONAL · MESA UNIFICADA DE INTEROPERABILIDAD (RETO-02)
                </span>
                <span className="text-xs text-slate-400">· Alcaldía · CCC · Comfandi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Portal de Interoperabilidad Institucional - Expediente RAC-2026
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                <strong>¿Cuál es su rol?</strong> Evitar silos y duplicación de censos. Permite a los directores de las 3 entidades ver en tiempo real la misma cola de expedientes alimentada desde Google Sheets, verificar el cumplimiento de SLA de 24h y autorizar despachos en lote.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGoogleSheets}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all self-start md:self-center shrink-0 flex items-center gap-2"
          >
            <span>Ver Hojas Centrales</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Frame Mockup (Matching panel_interoperabilidad_entidades_pc.png) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border-4 border-slate-800">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Ruta Abierta Cali - Portal de Interoperabilidad Institucional (RETO-02)
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Vista de Gestión de Casos Interinstitucional - Expediente Único RAC-2026
              </h2>
            </div>
            <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sincronización Bidireccional en Vivo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Centralizada Casos Queue (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Centralizada Casos Queue (Cola Única de Atención)
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      Alimentada automáticamente desde WhatsApp y Google Sheets
                    </span>
                  </div>

                  {/* Interactive Entity Filter */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                    <button
                      onClick={() => setSelectedEntityFilter('all')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                        selectedEntityFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Todas ({comerciantes.length})
                    </button>
                    <button
                      onClick={() => setSelectedEntityFilter('alcaldia')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                        selectedEntityFilter === 'alcaldia'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Alcaldía
                    </button>
                    <button
                      onClick={() => setSelectedEntityFilter('ccc')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                        selectedEntityFilter === 'ccc'
                          ? 'bg-blue-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      CCC
                    </button>
                    <button
                      onClick={() => setSelectedEntityFilter('comfandi')}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                        selectedEntityFilter === 'comfandi'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Comfandi
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-white border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Nombre del Comerciante</th>
                        <th className="py-2.5 px-3">Ubicación</th>
                        <th className="py-2.5 px-3">Entidad Responsable</th>
                        <th className="py-2.5 px-3">Estado SLA</th>
                        <th className="py-2.5 px-3">Ruta Asignada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredList.map(c => (
                        <tr key={c.ID_Expediente} className="hover:bg-slate-100/70">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{c.Nombre_Comerciante}</span>
                            <span className="font-mono text-[10px] text-slate-500">{c.ID_Expediente}</span>
                          </td>
                          <td className="py-3 px-3">{c.Barrio_Comuna}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.Entidad_Encargada.includes('Alcaldía') || c.Entidad_Encargada.includes('Desarrollo')
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.Entidad_Encargada.includes('Cámara') || c.Entidad_Encargada.includes('CCC')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {c.Entidad_Encargada}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                              {c.Estado_SLA}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-emerald-800">
                            {c.Ruta_Asignada}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col: Panel de Sincronización & Acciones Rápidas (4 cols) */}
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
                  <span className="text-[11px] text-emerald-700 block ml-5">
                    Alivio Verificado ($5.000M)
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cámara de Comercio de Cali (CCC)</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 block ml-5">
                    Expediente Unificado (18% Descuento)
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Comfandi</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 block ml-5">
                    Cupo Aprobado (Sin Barrera RUT)
                  </span>
                </div>
              </div>

              {/* Acciones Rápidas matching image */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Acciones Rápidas Interinstitucionales
                </span>

                <button
                  onClick={handleBulkApprove}
                  disabled={isBulkApproved}
                  className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center ${
                    isBulkApproved
                      ? 'bg-emerald-600 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isBulkApproved ? (
                    '✓ Órdenes de Compra Masiva Aprobadas'
                  ) : (
                    'Aprobar Órdenes de Compra Colectiva (18% Desc. Proveedores)'
                  )}
                </button>

                <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                  Al pulsar, se genera la orden de despacho conjunta a Harinera del Valle y CAVASA para el cuadrante San Fernando.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
