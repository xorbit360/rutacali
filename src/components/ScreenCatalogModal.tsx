import React, { useState } from 'react';
import {
  Layers, ExternalLink, Smartphone, Globe, Landmark,
  Zap, Truck, FileText, CheckCircle2, ChevronRight, Eye
} from 'lucide-react';
import { SCREEN_CATALOG } from '../data/nidoData';

interface ScreenCatalogModalProps {
  onNavigateToModule: (module: string) => void;
}

export const ScreenCatalogModal: React.FC<ScreenCatalogModalProps> = ({
  onNavigateToModule
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedScreen, setSelectedScreen] = useState<typeof SCREEN_CATALOG[0] | null>(SCREEN_CATALOG[0]);

  const categories = [
    { id: 'all', label: 'Todos los Artefactos (16)' },
    { id: 'COMERCIANTE_WHATSAPP', label: 'WhatsApp Bot' },
    { id: 'COMERCIANTE_WEB', label: 'Web Comerciante' },
    { id: 'GESTOR_CALLE', label: 'Gestor de Cuadra' },
    { id: 'OFICINA_ALCALDIA', label: 'Alcaldía / DATIC' },
    { id: 'OFICINA_CCC', label: 'Cámara de Comercio (CCC)' },
    { id: 'OFICINA_EMCALI', label: 'EMCALI Pasiva' },
    { id: 'DASHBOARD_CONTROL', label: 'Tablero Distrital' }
  ];

  const filtered = selectedFilter === 'all'
    ? SCREEN_CATALOG
    : SCREEN_CATALOG.filter(s => s.modulo === selectedFilter || (selectedFilter === 'COMERCIANTE_WEB' && (s.modulo === 'COMERCIANTE_WEB' || s.modulo === 'CONSULTA_PUBLICA')));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
          <Layers className="w-4 h-4" />
          <span>SECCIÓN 3 · CATÁLOGO DE PANTALLAS E IMÁGENES ASOCIADAS</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Catálogo de Artefactos de la Infraestructura Digital
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Visualizador de identificadores de archivo para la arquitectura técnica y trazabilidad de componentes del asistente GovTech de Santiago de Cali.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of 16 screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => {
          const isSelected = selectedScreen?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedScreen(item)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/20 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.canal}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.descripcion}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  #0{idx + 1}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.modulo === 'COMERCIANTE_WHATSAPP') onNavigateToModule('whatsapp');
                    else if (item.modulo === 'GESTOR_CALLE') onNavigateToModule('gestor');
                    else if (item.modulo.startsWith('OFICINA_')) onNavigateToModule('oficinas');
                    else onNavigateToModule('comerciante');
                  }}
                  className="text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1 group"
                >
                  <span>Abrir Canal</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Screen Deep-Dive Card */}
      {selectedScreen && (
        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div>
              <span className="font-mono text-xs text-emerald-400 font-bold block mb-1">
                ARTEFACTO ACTIVO: {selectedScreen.id}
              </span>
              <h2 className="text-xl font-bold text-white">
                {selectedScreen.title}
              </h2>
            </div>

            <button
              onClick={() => {
                if (selectedScreen.modulo === 'COMERCIANTE_WHATSAPP') onNavigateToModule('whatsapp');
                else if (selectedScreen.modulo === 'GESTOR_CALLE') onNavigateToModule('gestor');
                else if (selectedScreen.modulo.startsWith('OFICINA_')) onNavigateToModule('oficinas');
                else onNavigateToModule('comerciante');
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors self-start md:self-center shadow-sm"
            >
              Probar Este Módulo en Vivo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px]">Canal Operativo</span>
              <span className="font-semibold text-white">{selectedScreen.canal}</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px]">Identificador de Estudio</span>
              <span className="font-mono font-semibold text-emerald-300">{selectedScreen.id}</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px]">Cumplimiento Regla de Oro</span>
              <span className="font-semibold text-white">Cero Burocracia RAC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
