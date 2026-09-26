import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Send, CheckCheck, Play, Pause, Bot, ShieldCheck,
  Sparkles, Truck, ArrowRight, RotateCcw, Volume2, User
} from 'lucide-react';
import { ExpedienteRAC } from '../types/govtech';

interface WhatsAppBotSimulatorProps {
  onExpedienteCreated: (exp: ExpedienteRAC) => void;
  onViewExpediente: (codigo: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isAudio?: boolean;
  audioDuration?: string;
  timestamp: string;
  actions?: {
    label: string;
    actionKey: string;
    variant?: 'primary' | 'secondary';
  }[];
  expedienteData?: any;
}

export const WhatsAppBotSimulator: React.FC<WhatsAppBotSimulatorProps> = ({
  onExpedienteCreated,
  onViewExpediente
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isLoadingBot, setIsLoadingBot] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const getNowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Start with the classic official Doña Rosa flow
  const loadDonaRosaFlow = () => {
    setMessages([
      {
        id: 'msg-init-system',
        sender: 'bot',
        text: '🟢 Bienvenido a la Línea GovTech Oficial de Santiago de Cali para reactivación comercial post-sismo. Puedes escribir o enviarnos una nota de voz con lo que le ocurrió a tu negocio.',
        timestamp: '19:24'
      },
      {
        id: 'msg-user-voice-1',
        sender: 'user',
        text: 'Hola, soy Doña Rosa de San Fernando, se me dañó el horno y la harina está muy cara.',
        isAudio: true,
        audioDuration: '0:14',
        timestamp: '19:24'
      },
      {
        id: 'msg-bot-resp-1',
        sender: 'bot',
        text: '¡Hola, Doña Rosa! Bienvenida a Ruta Abierta Cali 🟢.\n\nIdentificamos tu negocio "Panadería La Espiga" en la Comuna 19 en el censo distrital de comercio.\n\nPara continuar sin formularios ni papeleo DIAN, autoriza el tratamiento de datos para la asignación de subsidios y compras colectivas (Ley 1581 de 2012):',
        timestamp: '19:24',
        actions: [
          {
            label: '🔘 Acepto Ley 1581 (Habeas Data)',
            actionKey: 'ACCEPT_HABEAS_DATA',
            variant: 'primary'
          }
        ]
      }
    ]);
  };

  useEffect(() => {
    loadDonaRosaFlow();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingBot]);

  const handleActionClick = (actionKey: string, msgId: string) => {
    if (actionKey === 'ACCEPT_HABEAS_DATA') {
      const userAcceptMsg: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: 'Acepto tratamiento de datos Ley 1581 de 2012.',
        timestamp: getNowTime()
      };

      const botTriajeMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: 'Identificamos tu necesidad principal: 📦 INSUMOS Y MATERIA PRIMA.\n\n🔥 ¡ALERTA DE RUTA COLECTIVA EN SAN FERNANDO!\n12 panaderías de tu cuadra registraron hoy escasez de harina de trigo.\n\nSi agrupas tu pedido con la Cámara de Comercio de Cali obtienes:\n💰 18% de descuento mayorista directo con molinos.\n🚚 Flete compartido único a tu puerta.',
        timestamp: getNowTime(),
        actions: [
          {
            label: '🔘 Unirme a la Ruta Colectiva',
            actionKey: 'JOIN_SWARM_SAN_FERNANDO',
            variant: 'primary'
          },
          {
            label: '🔘 Atención Individual',
            actionKey: 'SELECT_INDIVIDUAL',
            variant: 'secondary'
          }
        ]
      };

      setMessages(prev => [...prev, userAcceptMsg, botTriajeMsg]);
    } else if (actionKey === 'JOIN_SWARM_SAN_FERNANDO' || actionKey === 'SELECT_INDIVIDUAL') {
      const isSwarm = actionKey === 'JOIN_SWARM_SAN_FERNANDO';
      const userChoice: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: isSwarm ? 'Quiero unirme a la Ruta Colectiva de San Fernando.' : 'Prefiero atención individual.',
        timestamp: getNowTime()
      };

      const codigoExp = 'RAC-2026-0418';
      const newExp: ExpedienteRAC = {
        codigo: codigoExp,
        fecha_registro: new Date().toISOString(),
        comerciante: {
          id_nido: 'NIT-31842099',
          nombre: 'Rosa Elena Pérez',
          negocio: 'Panadería La Espiga',
          comuna: 19,
          barrio: 'San Fernando',
          direccion: 'Carrera 34 # 4B-18',
          formal: true
        },
        triaje: {
          barrera_principal: 'INSUMOS_MATERIA_PRIMA',
          descripcion: 'Se me dañó el horno y la harina está muy cara en San Fernando.',
          metodo_registro: 'WHATSAPP_VOICE_NOTE',
          habeas_data_autorizado: true
        },
        ruta_asignada: {
          tipo_ruta: isSwarm ? 'RUTA_COLECTIVA_ENJAMBRE' : 'ATENCION_INDIVIDUAL',
          corredor_comercial: 'CORREDOR_SAN_FERNANDO_C19',
          entidad_responsable: 'CAMARA_COMERCIO_CALI',
          beneficio_colectivo: isSwarm ? '18% Ahorro Insumos + Flete Compartido' : 'Atención Técnica Individual'
        },
        verificacion_pasiva: {
          metodo: 'EMCALI_CONSUMO_KWH',
          cuenta_contrato_emcali: 'EE-994821-Cali',
          kwh_base: 420,
          kwh_actual: 120,
          porcentaje_recuperacion: 28.5,
          estado_reapertura: 'EN_PROCESO',
          ultima_lectura: new Date().toISOString()
        },
        beneficio_financiero: {
          fuente: 'CAMARA_COMERCIO_CALI',
          monto_estimado_ahorro: 1850000,
          aprobado: true
        }
      };

      onExpedienteCreated(newExp);

      const botConfirmation: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: `🎉 ¡Te has sumado a la Ruta Colectiva Comuna 19!\n\n📄 Expediente Único: ${codigoExp}\n🏢 Entidad Encargada: Cámara de Comercio de Cali (CCC)\n📦 Beneficio: 18% Descuento Insumos + Camión Compartido\n🌐 Consulta tu avance en tiempo real:\nhttps://rutaabiertacali.gov.co/expediente/${codigoExp}\n\n⚡ Verificación Pasiva: EMCALI verificará automáticamente la reapertura mediante tu medidor eléctrico comercial (EE-994821-Cali), sin que debas enviar fotos ni certificados.`,
        timestamp: getNowTime(),
        expedienteData: newExp,
        actions: [
          {
            label: '📄 Ver Expediente en Portal Web',
            actionKey: 'VIEW_EXPEDIENTE',
            variant: 'primary'
          }
        ]
      };

      setMessages(prev => [...prev, userChoice, botConfirmation]);
    } else if (actionKey === 'VIEW_EXPEDIENTE') {
      onViewExpediente('RAC-2026-0418');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getNowTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoadingBot(true);

    try {
      const res = await fetch('/api/gemini/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: text,
          nombre_usuario: 'Comerciante de Cali'
        })
      });
      const data = await res.json();

      const botReply: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: data.mensaje_whatsapp_respuesta || data.mensaje_respuesta ||
          `Hemos recibido tu solicitud para: ${data.barrera_principal?.replace(/_/g, ' ')}. Se ha asignado a ${data.entidad_responsable?.replace(/_/g, ' ')}.`,
        timestamp: getNowTime(),
        actions: data.enjambre_detectado ? [
          {
            label: '🔘 Unirme a la Ruta Colectiva del Corredor',
            actionKey: 'JOIN_SWARM_SAN_FERNANDO',
            variant: 'primary'
          }
        ] : undefined
      };

      setMessages(prev => [...prev, botReply]);
    } catch {
      const fallbackReply: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: '¡Hola! Hemos registrado tu mensaje en la plataforma distrital. Tu negocio ha sido priorizado para los apoyos del Fondo Solidario de la Alcaldía y la Cámara de Comercio de Cali sin exigencia de RUT ni DIAN.',
        timestamp: getNowTime()
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoadingBot(false);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    clearInterval(timerRef.current);
    setIsRecording(false);

    // Send voice simulation
    const audioMsg: ChatMessage = {
      id: `msg-voice-${Date.now()}`,
      sender: 'user',
      text: 'Nota de voz: "Hola, necesitamos apoyo en nuestro local de calzado en San Bosco, se cayeron las máquinas y la luz está cortada."',
      isAudio: true,
      audioDuration: `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 8}`,
      timestamp: getNowTime()
    };

    setMessages(prev => [...prev, audioMsg]);
    setIsLoadingBot(true);

    setTimeout(() => {
      const botVoiceResp: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: '🟢 Nota de voz transcrita con éxito:\n"Necesitamos apoyo en nuestro local de calzado en San Bosco..."\n\nIdentificamos en el registro de comercio: "Taller Calzado San Bosco" (Comuna 3).\n\nBarrera detectada: 🛠️ MAQUINARIA / INFRAESTRUCTURA.\nSe habilita subsidio de adecuación física y microcrédito de emergencia con Comfandi (tasa subsidiada 0.6% mes).',
        timestamp: getNowTime(),
        actions: [
          {
            label: '🔘 Acepto Ley 1581 y Generar Radicado',
            actionKey: 'ACCEPT_HABEAS_DATA',
            variant: 'primary'
          }
        ]
      };
      setMessages(prev => [...prev, botVoiceResp]);
      setIsLoadingBot(false);
    }, 1200);
  };

  const playVoiceNote = (id: string) => {
    if (isPlayingAudio === id) {
      setIsPlayingAudio(null);
    } else {
      setIsPlayingAudio(id);
      setTimeout(() => setIsPlayingAudio(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro info */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CANAL WHATSAPP OFICIAL DISTRITAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Simulador de Asistente WhatsApp GovTech
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Interacción por texto y notas de voz para comerciantes sin barreras digitales. Cruce censal institucional en tiempo real.
          </p>
        </div>

        <button
          onClick={loadDonaRosaFlow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reiniciar Caso Oficial (Doña Rosa)</span>
        </button>
      </div>

      {/* Realistic Mobile Mockup with WhatsApp styling */}
      <div className="max-w-md mx-auto bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
        {/* Phone Notch / Speaker */}
        <div className="h-4 flex items-center justify-center mb-1">
          <div className="w-16 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* WhatsApp App Container */}
        <div className="bg-[#ECE5DD] rounded-[2rem] overflow-hidden flex flex-col h-[650px] shadow-inner relative border border-slate-300">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-700 border border-emerald-400 flex items-center justify-center font-bold text-xs text-white">
                  RAC
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1">
                  <span>Ruta Abierta Cali 🟢</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </h3>
                <span className="text-[10px] text-emerald-100 block leading-tight">
                  Alcaldía · CCC · EMCALI (En Línea)
                </span>
              </div>
            </div>

            <div className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-100 font-mono">
              GovTech Cali
            </div>
          </div>

          {/* Subheader Notice */}
          <div className="bg-[#000000]/5 text-[10px] text-slate-600 text-center py-1 px-3 border-b border-black/5 flex items-center justify-center gap-1">
            <span>🔒 Cifrado de extremo a extremo · Habeas Data Ley 1581</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs shadow-sm relative ${
                      isUser
                        ? 'bg-[#E7FFDB] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none border border-black/5'
                    }`}
                  >
                    {/* Voice Note Player */}
                    {msg.isAudio ? (
                      <div className="flex items-center gap-2.5 py-1 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => playVoiceNote(msg.id)}
                          className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          {isPlayingAudio === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="h-4 flex items-center gap-0.5">
                            {[4, 12, 8, 16, 10, 14, 6, 12, 16, 8, 14, 10, 12, 6, 4].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                  isPlayingAudio === msg.id && i < 8
                                    ? 'bg-emerald-600'
                                    : 'bg-slate-300'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>{msg.audioDuration || '0:14'}</span>
                            <span className="font-semibold text-emerald-800">Nota de Voz</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    )}

                    {/* Interactive Action Buttons inside WhatsApp bubble */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1.5">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(act.actionKey, msg.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between ${
                              act.variant === 'primary'
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            }`}
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & double tick */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3 h-3 text-sky-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoadingBot && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl rounded-tl-none shadow-sm text-xs text-slate-500 w-fit">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">Escribiendo respuesta...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice Note Simulator Prompts */}
          <div className="bg-slate-100 px-3 py-1.5 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-slate-500 shrink-0 font-medium">Ejemplos rápidos:</span>
            <button
              onClick={() => {
                setInputText('Hola, necesito ayuda para reubicar mi puesto de frutas en Siloé.');
              }}
              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 shrink-0 font-medium"
            >
              Luz Dary (Siloé)
            </button>
            <button
              onClick={() => {
                setInputText('Se me dañaron las vitrinas de la ferretería en San Nicolás.');
              }}
              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 shrink-0 font-medium"
            >
              Don Carlos (San Nicolás)
            </button>
            <button
              onClick={() => {
                setInputText('Hola, soy Sandra de Confecciones La Sultana, necesito liquidez para nómina.');
              }}
              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 shrink-0 font-medium"
            >
              Sandra (Comuna 8)
            </button>
          </div>

          {/* Input Bar */}
          <div className="bg-[#F0F2F5] p-2 flex items-center gap-1.5 border-t border-slate-300">
            {isRecording ? (
              <div className="flex-1 bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                  <span className="font-semibold">Grabando nota de voz... 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
                </div>
                <button
                  onClick={stopVoiceRecording}
                  className="text-xs font-bold text-red-800 underline"
                >
                  Enviar Audio
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe un mensaje o envía nota de voz..."
                className="flex-1 bg-white rounded-full px-4 py-2 text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            )}

            {inputText.trim() ? (
              <button
                type="button"
                onClick={handleSendMessage}
                className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#075E54] hover:bg-emerald-700 text-white'
                }`}
                title="Grabar nota de voz"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
