import React, { useState } from 'react';
import { Search, X, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { ExpedienteRAC } from '../types/govtech';

interface QuickLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  expedientes: ExpedienteRAC[];
  onSelectExpediente: (codigo: string) => void;
}

export const QuickLookupModal: React.FC<QuickLookupModalProps> = ({
  isOpen,
  onClose,
  expedientes,
  onSelectExpediente
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = expedientes.filter(e =>
    e.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.comerciante.negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.comerciante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.comerciante.id_nido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.comerciante.barrio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Consulta de Expediente RAC-2026-XXXX
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe el código (ej. RAC-2026-0418) o nombre del negocio..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-4 max-h-72 overflow-y-auto space-y-2">
          {results.length > 0 ? (
            results.map((exp) => (
              <div
                key={exp.codigo}
                onClick={() => {
                  onSelectExpediente(exp.codigo);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {exp.codigo}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {exp.comerciante.negocio}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {exp.comerciante.nombre} · Comuna {exp.comerciante.comuna} ({exp.comerciante.barrio})
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No se encontraron radicados coincidentes.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{expedientes.length} radicados activos en el sistema</span>
          <span className="font-medium text-emerald-700">Verificación Pasiva EMCALI</span>
        </div>
      </div>
    </div>
  );
};
