import React, { useState } from 'react';
import {
  Mic, Play, Pause, ShieldCheck, CheckCheck, Send,
  ArrowRight, Phone, Video, Search, MoreVertical, Paperclip, Smile
} from 'lucide-react';

interface ScreenP1IngresoWhatsAppProps {
  onAdvanceToTriage: () => void;
  onOpenGoogleSheets: () => void;
}

export const ScreenP1IngresoWhatsApp: React.FC<ScreenP1IngresoWhatsAppProps> = ({
  onAdvanceToTriage,
  onOpenGoogleSheets
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PASO A / PANTALLA 1 · INGRESO ACCESIBLE WHATSAPP</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Registro e Ingreso Accesible (WhatsApp Web / Móvil)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Nota de voz en lenguaje natural y garantía inmediata de Habeas Data (Ley 1581) sin reportes a la DIAN.
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
            onClick={onAdvanceToTriage}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>Ir a Paso 2: Triaje 60s</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Frame Mockup (Desktop / Browser styling matching pc_p1_ingreso_whatsapp.png) */}
      <div className="bg-slate-900 rounded-[2rem] p-3 sm:p-4 shadow-2xl border-4 border-slate-800">
        {/* Browser Top Bar */}
        <div className="bg-[#00A884] text-white px-4 py-2 rounded-t-[1.5rem] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs font-bold text-white ml-2 flex items-center gap-1.5">
              <span>WhatsApp Web</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-100">
            https://web.whatsapp.com/ruta-abierta-cali
          </span>
        </div>

        {/* WhatsApp Web Split App Window */}
        <div className="bg-[#EFEAE2] flex flex-col md:flex-row h-[620px] overflow-hidden rounded-b-[1.5rem] border border-slate-300">
          {/* Left: Chat List Panel */}
          <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
            {/* User profile bar */}
            <div className="bg-[#F0F2F5] px-4 py-3 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  RAC
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 leading-tight">Santiago de Cali</h3>
                  <span className="text-[10px] text-slate-500">Reactivación Comercial</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MoreVertical className="w-4 h-4 cursor-pointer" />
              </div>
            </div>

            {/* Search chats */}
            <div className="p-2 bg-white border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar o empezar un nuevo chat"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F0F2F5] rounded-lg border-none focus:outline-none"
                />
              </div>
            </div>

            {/* Chat List Items */}
            <div className="flex-1 overflow-y-auto">
              {/* Active official bot item */}
              <div className="p-3 bg-[#F0F2F5] flex items-center gap-3 cursor-pointer border-l-4 border-[#00A884]">
                <div className="w-11 h-11 rounded-full bg-[#00A884] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  RAC
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      Ruta Abierta Cali - Bot Oficial
                    </span>
                    <span className="text-[10px] text-[#00A884] font-semibold">10:33 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Garantía Ley 1581 - Sus datos están protegidos...</span>
                  </p>
                </div>
              </div>

              {/* Other mock chats for realism */}
              <div className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 opacity-60">
                <div className="w-11 h-11 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                  CC
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-xs font-bold text-slate-800 truncate">Cámara de Comercio de Cali</span>
                    <span className="text-[10px] text-slate-400">09:12 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    Red Mayorista Comuna 19 disponible
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Active Chat Conversation (Exactly matching image pc_p1_ingreso_whatsapp.png) */}
          <div className="flex-1 flex flex-col bg-[#EFEAE2] relative">
            {/* Chat header */}
            <div className="bg-[#F0F2F5] px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00A884] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  RAC
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Ruta Abierta Cali - Bot Oficial</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00A884]" />
                  </h2>
                  <span className="text-[10px] text-slate-500">
                    Alcaldía de Cali · CCC · Comfandi (En línea)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <Video className="w-4 h-4 cursor-pointer" />
                <Phone className="w-4 h-4 cursor-pointer" />
                <MoreVertical className="w-4 h-4 cursor-pointer" />
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Day divider */}
              <div className="flex justify-center">
                <span className="bg-white/90 text-slate-600 text-[10px] font-semibold px-3 py-1 rounded-lg shadow-sm uppercase tracking-wide">
                  Hoy · 25 de Septiembre
                </span>
              </div>

              {/* Message 1: User Voice Note & Text: "Doña María (San Fernando)" */}
              <div className="flex flex-col items-end">
                <div className="bg-[#D9FDD3] rounded-2xl rounded-tr-none px-4 py-3 shadow-md max-w-lg border border-emerald-200/60">
                  {/* Sender Name */}
                  <span className="text-xs font-bold text-emerald-900 block mb-1.5">
                    Doña María (San Fernando)
                  </span>

                  {/* Voice Note Player (Matching pc_p1_ingreso_whatsapp.png) */}
                  <div className="flex items-center gap-3 bg-white/70 p-2.5 rounded-xl border border-emerald-200/50 mb-2">
                    <button
                      onClick={toggleAudio}
                      className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1">
                      {/* Audio waveform line simulation */}
                      <div className="h-4 flex items-center gap-0.5">
                        {[6, 14, 8, 18, 12, 16, 8, 14, 20, 10, 16, 12, 14, 8, 6].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              isPlayingAudio && i < 8 ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono mt-1">
                        <span>{isPlayingAudio ? '0:08' : '0:15'}</span>
                        <span className="text-slate-400">10:32 AM</span>
                      </div>
                    </div>

                    {/* Microphone icon orange like the mockup */}
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Transcribed text note */}
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    "Se cayeron las ventas y la harina está cara"
                  </p>

                  <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                    <span>10:32 AM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                </div>
              </div>

              {/* Message 2: Bot Reply - Garantía Ley 1581 (Matching pc_p1_ingreso_whatsapp.png) */}
              <div className="flex flex-col items-start">
                <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md max-w-lg border border-slate-200">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                        Garantía Ley 1581
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Sus datos están protegidos y <strong>NO se comparten con la DIAN ni para cobros tributarios</strong>. Su información se utiliza exclusivamente para la asignación de alivios económicos, compras colectivas de insumos con la CCC y verificación pasiva.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">10:32 AM</span>
                    <button
                      onClick={onAdvanceToTriage}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <span>Continuar al Triaje (60s)</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Bottom Input bar */}
            <div className="bg-[#F0F2F5] px-4 py-2.5 flex items-center gap-2 border-t border-slate-200">
              <Smile className="w-5 h-5 text-slate-500 cursor-pointer" />
              <Paperclip className="w-5 h-5 text-slate-500 cursor-pointer" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Typa a mensaje"
                className="flex-1 bg-white rounded-lg px-4 py-2 text-xs border-none focus:outline-none shadow-sm"
              />
              <button className="w-9 h-9 rounded-full bg-[#00A884] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
