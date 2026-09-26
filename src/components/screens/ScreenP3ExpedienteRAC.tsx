import React from 'react';
import {
  ShieldCheck, CheckCircle2, ArrowRight, QrCode, Building2,
  Download, Printer, Share2, ExternalLink
} from 'lucide-react';

interface ScreenP3ExpedienteRACProps {
  onAdvanceToCompras: () => void;
  onOpenGoogleSheets: () => void;
}

export const ScreenP3ExpedienteRAC: React.FC<ScreenP3ExpedienteRACProps> = ({
  onAdvanceToCompras,
  onOpenGoogleSheets
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PASO C / PANTALLA 3 · EXPEDIENTE ÚNICO RAC-2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Ficha Unificada de Atención Interinstitucional
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Cámara de Comercio de Cali, Alcaldía y Comfandi consultan el mismo registro sin duplicar papeleos ni pedir RUT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGoogleSheets}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
          >
            Ver Fila en Google Sheets
          </button>
          <button
            onClick={onAdvanceToCompras}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>Ir a Paso 4: Compras Colectivas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monitor Display Frame (Exactly matching pc_p3_expediente_rac.png) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-4 sm:p-8 shadow-2xl border-4 border-slate-800">
        {/* Browser Top */}
        <div className="bg-slate-800 px-4 py-2 rounded-t-xl flex items-center justify-between text-white text-xs mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-slate-300 font-mono text-[11px] ml-2">official.cali.gov.co/expediente/RAC-2026-0418</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">EXPEDIENTE CERTIFICADO</span>
        </div>

        {/* White Card Screen matching image */}
        <div className="bg-white rounded-xl p-6 sm:p-12 shadow-lg border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Merchant Info & Title */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Expediente Único<br />
                <span className="text-emerald-700">RAC-2026</span>
              </h2>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Comerciante</span>
                <p className="text-lg font-bold text-slate-800">
                  Doña María - Tienda San Fernando
                </p>
                <p className="text-xs text-slate-500">
                  Comuna 19 · San Fernando, Santiago de Cali
                </p>
              </div>

              {/* Orange Pill Badge (Exactly matching pc_p3_expediente_rac.png) */}
              <div className="inline-block bg-[#F97316] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-sm">
                En Atención Prioritaria (SLA: 24h)
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Validado contra hoja central de Google Sheets (Cero Burocracia)</span>
              </div>
            </div>

            {/* Middle Col: Large QR Code */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
                {/* SVG QR Code */}
                <svg
                  className="w-48 h-48 sm:w-56 sm:h-56"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="white" />
                  {/* Top-left locator */}
                  <rect x="5" y="5" width="26" height="26" fill="#0f172a" />
                  <rect x="8" y="8" width="20" height="20" fill="white" />
                  <rect x="11" y="11" width="14" height="14" fill="#0f172a" />
                  {/* Top-right locator */}
                  <rect x="69" y="5" width="26" height="26" fill="#0f172a" />
                  <rect x="72" y="8" width="20" height="20" fill="white" />
                  <rect x="75" y="11" width="14" height="14" fill="#0f172a" />
                  {/* Bottom-left locator */}
                  <rect x="5" y="69" width="26" height="26" fill="#0f172a" />
                  <rect x="8" y="72" width="20" height="20" fill="white" />
                  <rect x="11" y="75" width="14" height="14" fill="#0f172a" />
                  {/* Data patterns */}
                  <rect x="37" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="49" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="43" y="18" width="6" height="6" fill="#0f172a" />
                  <rect x="55" y="18" width="6" height="6" fill="#0f172a" />
                  <rect x="37" y="28" width="6" height="6" fill="#0f172a" />
                  <rect x="49" y="28" width="6" height="6" fill="#0f172a" />
                  <rect x="8" y="37" width="6" height="6" fill="#0f172a" />
                  <rect x="18" y="43" width="6" height="6" fill="#0f172a" />
                  <rect x="28" y="37" width="6" height="6" fill="#0f172a" />
                  <rect x="8" y="49" width="6" height="6" fill="#0f172a" />
                  <rect x="37" y="37" width="26" height="26" fill="#0f172a" />
                  <rect x="41" y="41" width="18" height="18" fill="white" />
                  <rect x="45" y="45" width="10" height="10" fill="#059669" />
                  <rect x="69" y="37" width="6" height="6" fill="#0f172a" />
                  <rect x="79" y="43" width="6" height="6" fill="#0f172a" />
                  <rect x="89" y="37" width="6" height="6" fill="#0f172a" />
                  <rect x="69" y="49" width="6" height="6" fill="#0f172a" />
                  <rect x="37" y="69" width="6" height="6" fill="#0f172a" />
                  <rect x="49" y="69" width="6" height="6" fill="#0f172a" />
                  <rect x="43" y="79" width="6" height="6" fill="#0f172a" />
                  <rect x="55" y="79" width="6" height="6" fill="#0f172a" />
                  <rect x="69" y="69" width="6" height="6" fill="#0f172a" />
                  <rect x="79" y="75" width="6" height="6" fill="#0f172a" />
                  <rect x="89" y="69" width="6" height="6" fill="#0f172a" />
                  <rect x="69" y="85" width="6" height="6" fill="#0f172a" />
                  <rect x="85" y="85" width="6" height="6" fill="#0f172a" />
                </svg>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800 mt-2">
                RAC-2026-0418
              </span>
            </div>

            {/* Right Col: Interconnected Entities with Dotted lines & Checks */}
            <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
              {/* Entity 1: Alcaldía de Cali */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Alcaldía de Cali
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Fondo Solidario $5.000M
                  </span>
                </div>
              </div>

              {/* Dotted connecting line */}
              <div className="w-0.5 h-6 border-l-2 border-dashed border-slate-300 ml-4 -my-3" />

              {/* Entity 2: Cámara de Comercio de Cali (CCC) */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Cámara de Comercio de Cali (CCC)
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Enjambre 18% Descuento
                  </span>
                </div>
              </div>

              {/* Dotted connecting line */}
              <div className="w-0.5 h-6 border-l-2 border-dashed border-slate-300 ml-4 -my-3" />

              {/* Entity 3: Comfandi */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Comfandi
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Crédito y Reequipamiento
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
