import React from 'react';
import {
  FileSpreadsheet, Landmark, Truck, Wrench,
  Layers, Smartphone
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab
}) => {
  // Navigation tabs: each entity has its own first-class interactive screen
  const entityTabs = [
    { id: 'alcaldia', label: 'Alcaldía (Fondo $5.000M)', icon: Landmark, tag: 'Ruta 1: Liquidez' },
    { id: 'ccc', label: 'Cámara Comercio (CCC)', icon: Truck, tag: 'Rutas 3 y 4 (Enjambres & Vitrina)' },
    { id: 'comfandi', label: 'Comfandi', icon: Wrench, tag: 'Ruta 2: Máquinas' },
    { id: 'interoperabilidad', label: 'Mesa Interoperabilidad', icon: Layers, tag: 'Gobernanza Unificada' }
  ];

  const primaryTabs = [
    { id: 'sheets', label: 'Google Sheets (Base Central)', icon: FileSpreadsheet },
    { id: 'paso1_whatsapp', label: 'Flujo Comerciante (WhatsApp)', icon: Smartphone }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar strictly following Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Entity & Core Nav Links) — Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('sheets')}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0F9D58] flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                Ruta Abierta Cali
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-none">
                Ecosistema Interactivo por Entidad
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Each Entity */}
        <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold overflow-x-auto scrollbar-none py-1 max-w-[50vw] sm:max-w-none">
          {/* Entity screens with clear roles */}
          {entityTabs.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Google Sheets toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('sheets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap ${
              currentTab === 'sheets'
                ? 'bg-[#0F9D58] text-white border-[#0F9D58] shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={() => onSelectTab('paso1_whatsapp')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap ${
              currentTab.startsWith('paso')
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Flujo Comerciante</span>
          </button>
        </div>
      </div>
    </header>
  );
};
