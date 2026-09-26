import React, { useState } from 'react';
import {
  DollarSign, Wrench, ShoppingCart, Users, ArrowRight,
  ShieldCheck, CheckCircle2, Bot, Sparkles, Clock, Check
} from 'lucide-react';
import { ComercianteRow } from '../../types/sheets';

interface ScreenP2Triaje60sProps {
  onSelectRoute: (routeName: string, entidad: string) => void;
  onAdvanceToExpediente: () => void;
  onOpenGoogleSheets: () => void;
  currentSelectedRoute?: string;
}

export const ScreenP2Triaje60s: React.FC<ScreenP2Triaje60sProps> = ({
  onSelectRoute,
  onAdvanceToExpediente,
  onOpenGoogleSheets,
  currentSelectedRoute = 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)'
}) => {
  const [selectedRoute, setSelectedRoute] = useState(currentSelectedRoute);
  const [progressSec] = useState(60);

  const handlePick = (route: string, entidad: string) => {
    setSelectedRoute(route);
    onSelectRoute(route, entidad);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PASO B / PANTALLA 2 · TRIAJE E INTELIGENCIA EN 60 SEGUNDOS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Triaje Automatizado en 60 Segundos (Dual Screen)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Clasificación automatizada en las 4 rutas institucionales sin exigir RUT al día ni balances financieros.
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
            onClick={onAdvanceToExpediente}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>Generar Expediente RAC-2026</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Screen Desktop Frame (Exactly matching pc_p2_triaje_60s.png) */}
      <div className="bg-slate-900 rounded-[2rem] p-3 sm:p-4 shadow-2xl border-4 border-slate-800">
        <div className="bg-slate-800 px-4 py-2 rounded-t-[1.5rem] flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="font-bold ml-2">Monitor de Operaciones · Triaje No-Code & WhatsApp Dual</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Sincronizado con Google Sheets Central
          </span>
        </div>

        {/* Dual Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-b-[1.5rem] border border-slate-700 bg-white">
          {/* Left Side: Ruta Abierta Cali - AI Triaje Dashboard (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60">
            <div>
              {/* Header inside dashboard */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  RAC
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Ruta Abierta Cali - AI Triaje Dashboard
                  </h2>
                  <span className="text-xs text-slate-500">
                    Motor conversacional de clasificación de necesidades
                  </span>
                </div>
              </div>

              {/* Progress Bar: Clasificación automatizada en 60 segundos */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Clasificación automatizada en 60 segundos</span>
                  <span className="font-mono text-emerald-700">{progressSec} segundos</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* 4 Colorful Route Cards (Exactly matching image pc_p2_triaje_60s.png) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Ruta 1: Blue Card */}
                <div
                  onClick={() => handlePick('Ruta 1: Liquidez y Fondo Solidario', 'Secretaría de Desarrollo Económico')}
                  className={`p-5 rounded-2xl cursor-pointer transition-all shadow-sm flex flex-col justify-between text-white relative ${
                    selectedRoute.includes('Ruta 1')
                      ? 'ring-4 ring-blue-400 scale-[1.02]'
                      : 'hover:opacity-95'
                  }`}
                  style={{ backgroundColor: '#0284C7' }} // Blue
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                      Ruta 1: Liquidez y Fondo Solidario
                    </h3>
                    <p className="text-[11px] text-blue-100 mt-1">
                      Fondo $5.000M Alcaldía de Cali para nómina y arriendo.
                    </p>
                  </div>
                  {selectedRoute.includes('Ruta 1') && (
                    <div className="absolute top-3 right-3 bg-white text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Seleccionada
                    </div>
                  )}
                </div>

                {/* Ruta 2: Green Card */}
                <div
                  onClick={() => handlePick('Ruta 2: Maquinaria e Infraestructura', 'Comfandi')}
                  className={`p-5 rounded-2xl cursor-pointer transition-all shadow-sm flex flex-col justify-between text-white relative ${
                    selectedRoute.includes('Ruta 2')
                      ? 'ring-4 ring-emerald-400 scale-[1.02]'
                      : 'hover:opacity-95'
                  }`}
                  style={{ backgroundColor: '#16A34A' }} // Green
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                      Ruta 2: Maquinaria e Infraestructura
                    </h3>
                    <p className="text-[11px] text-emerald-100 mt-1">
                      Comfandi: Reparación de vitrinas, hornos y adecuaciones.
                    </p>
                  </div>
                  {selectedRoute.includes('Ruta 2') && (
                    <div className="absolute top-3 right-3 bg-white text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Seleccionada
                    </div>
                  )}
                </div>

                {/* Ruta 3: Purple Card (Highlighted in Doña María flow) */}
                <div
                  onClick={() => handlePick('Ruta 3: Compras Colectivas en Enjambre (18% Descuento)', 'Cámara de Comercio de Cali (CCC)')}
                  className={`p-5 rounded-2xl cursor-pointer transition-all shadow-sm flex flex-col justify-between text-white relative ${
                    selectedRoute.includes('Ruta 3')
                      ? 'ring-4 ring-purple-400 scale-[1.02]'
                      : 'hover:opacity-95'
                  }`}
                  style={{ backgroundColor: '#7C3AED' }} // Purple
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                      Ruta 3: Compras Colectivas en Enjambre (18% Descuento)
                    </h3>
                    <p className="text-[11px] text-purple-100 mt-1">
                      Cámara de Comercio de Cali: Ahorro masivo en insumos.
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Recomendada IA</span>
                  </div>
                </div>

                {/* Ruta 4: Orange Card - CÁMARA DE COMERCIO DE CALI */}
                <div
                  onClick={() => handlePick('Ruta 4: Clientes y Visibilidad Comercial', 'Cámara de Comercio de Cali (CCC)')}
                  className={`p-5 rounded-2xl cursor-pointer transition-all shadow-sm flex flex-col justify-between text-white relative ${
                    selectedRoute.includes('Ruta 4')
                      ? 'ring-4 ring-orange-400 scale-[1.02]'
                      : 'hover:opacity-95'
                  }`}
                  style={{ backgroundColor: '#EA580C' }} // Orange
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 text-orange-100 border border-white/20">
                      Cámara de Comercio (CCC)
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                      Ruta 4: Clientes y Visibilidad Comercial
                    </h3>
                    <p className="text-[11px] text-orange-100 mt-1 leading-snug">
                      <strong>Cámara de Comercio de Cali (CCC):</strong> Vitrina comercial, ruedas de negocios B2B y puestos de venta equipados en La 14 de la 80.
                    </p>
                  </div>
                  {selectedRoute.includes('Ruta 4') && (
                    <div className="absolute top-3 right-3 bg-white text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Seleccionada
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                Caso Activo: <strong>Doña María (San Fernando)</strong> → Asignada a <strong>{selectedRoute}</strong>
              </span>

              <button
                onClick={onAdvanceToExpediente}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Generar Ficha Única RAC-2026</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side: Live WhatsApp Web view (5 cols) */}
          <div className="lg:col-span-5 bg-[#EFEAE2] flex flex-col h-[580px] border-t lg:border-t-0 border-slate-200">
            {/* Header */}
            <div className="bg-[#00A884] text-white px-4 py-2.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  RAC
                </div>
                <div>
                  <h3 className="text-xs font-bold">Ruta Abierta Cali - Bot Oficial</h3>
                  <span className="text-[10px] text-emerald-100">En línea</span>
                </div>
              </div>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {/* User Voice note */}
              <div className="flex justify-end">
                <div className="bg-[#D9FDD3] p-3 rounded-xl rounded-tr-none shadow-sm max-w-[90%]">
                  <span className="font-bold text-emerald-900 block text-[11px] mb-1">
                    Doña María (San Fernando)
                  </span>
                  <p className="text-slate-800">
                    "Se cayeron las ventas y la harina está cara"
                  </p>
                  <span className="text-[9px] text-slate-400 text-right block mt-1">10:32 AM</span>
                </div>
              </div>

              {/* Bot response */}
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[90%] border border-slate-200">
                  <span className="font-bold text-slate-900 block text-[11px] mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Garantía Ley 1581</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Sus datos están protegidos y NO se comparten con la DIAN ni para cobros tributarios.
                  </p>
                  <span className="text-[9px] text-slate-400 text-right block mt-1">10:32 AM</span>
                </div>
              </div>

              {/* Route auto-suggest card */}
              <div className="flex justify-start">
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl rounded-tl-none shadow-sm max-w-[95%]">
                  <span className="font-bold text-purple-900 text-xs flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Triaje Automatizado (60s):</span>
                  </span>
                  <p className="text-purple-800 text-[11px] leading-relaxed mb-2">
                    Detectamos escasez de harina en el cuadrante San Fernando. Se recomienda agrupar con 3-5 panaderías del sector para <strong>18% de descuento</strong> con molinos.
                  </p>
                  <div className="bg-white p-2 rounded-lg border border-purple-200 text-[11px] font-bold text-purple-900">
                    Ruta Activa: {selectedRoute}
                  </div>
                </div>
              </div>
            </div>

            {/* Input mock */}
            <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200">
              <input
                type="text"
                readOnly
                value="[Ruta 3 asignada en Google Sheets]"
                className="flex-1 bg-white px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
