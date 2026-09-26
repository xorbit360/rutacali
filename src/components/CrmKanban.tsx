import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  RefreshCw,
  MessageCircle,
  FileText,
  ShieldCheck,
  Clock,
  User,
  Building2,
  MapPin,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Headphones,
  Image as ImageIcon
} from 'lucide-react';

export type ContactItem = {
  id: number;
  remote_jid: string;
  phone_number: string;
  display_name: string | null;
  business_name: string | null;
  neighborhood: string | null;
  commune: string | null;
  consent_status: 'pending' | 'granted' | 'denied';
  conversation_stage: 'intake' | 'awaiting_consent' | 'triaged' | 'case_created' | 'human_handoff';
  current_route: number | null;
  route_label: string | null;
  barrier_summary: string | null;
  assigned_entity: string | null;
  created_at: string;
  updated_at: string;
  latest_case?: {
    case_code: string;
    status: string;
    route: number;
    assigned_entity: string;
    summary: string;
  } | null;
  last_message?: {
    body: string;
    direction: 'inbound' | 'outbound';
    created_at: string;
  } | null;
  messages_count: number;
};

type ChatMessage = {
  id: number;
  direction: 'inbound' | 'outbound';
  body: string;
  created_at: string;
  llm_model?: string | null;
  processing_error?: string | null;
};

const PIPELINE_COLUMNS: {
  id: ContactItem['conversation_stage'];
  label: string;
  badgeColor: string;
  borderColor: string;
  desc: string;
}[] = [
  {
    id: 'intake',
    label: '1. Nuevo Ingreso',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderColor: 'border-t-blue-500',
    desc: 'Primer contacto y bienvenida'
  },
  {
    id: 'awaiting_consent',
    label: '2. En Triaje / Consentimiento',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'border-t-amber-500',
    desc: 'Validando Ley 1581 o necesidades'
  },
  {
    id: 'triaged',
    label: '3. Triaje Completado',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'border-t-emerald-500',
    desc: 'Ruta 1 - 4 asignada'
  },
  {
    id: 'case_created',
    label: '4. Expediente Radicado',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    borderColor: 'border-t-purple-500',
    desc: 'Código oficial RAC-2026'
  },
  {
    id: 'human_handoff',
    label: '5. Atención Humana',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    borderColor: 'border-t-rose-500',
    desc: 'Derivado a gestor territorial'
  }
];

interface CrmKanbanProps {
  adminToken: string;
  onBackToQr: () => void;
}

export function CrmKanban({ adminToken, onBackToQr }: CrmKanbanProps) {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [manualText, setManualText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-admin`;

  const fetchPipeline = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ action: 'crm-pipeline' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No fue posible cargar el pipeline.');
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al consultar pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchPipeline();
    }
  }, [adminToken]);

  const openChat = async (contact: ContactItem) => {
    setSelectedContact(contact);
    setLoadingChat(true);
    try {
      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ action: 'get-chat-messages', remote_jid: contact.remote_jid })
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleUpdateStage = async (contactId: number, stage: ContactItem['conversation_stage']) => {
    try {
      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ action: 'update-contact-stage', contact_id: contactId, stage })
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, conversation_stage: stage } : c))
        );
        if (selectedContact?.id === contactId) {
          setSelectedContact((prev) => (prev ? { ...prev, conversation_stage: stage } : null));
        }
      }
    } catch (err) {
      console.error('Error updating stage:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !manualText.trim()) return;
    setSendingMessage(true);
    try {
      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          action: 'send-manual-message',
          remote_jid: selectedContact.remote_jid,
          phone_number: selectedContact.phone_number,
          text: manualText.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setChatMessages((prev) => [...prev, data.message]);
        setManualText('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const q = searchTerm.toLowerCase();
    return contacts.filter(
      (c) =>
        (c.display_name && c.display_name.toLowerCase().includes(q)) ||
        (c.business_name && c.business_name.toLowerCase().includes(q)) ||
        (c.phone_number && c.phone_number.includes(q)) ||
        (c.neighborhood && c.neighborhood.toLowerCase().includes(q)) ||
        (c.commune && c.commune.toLowerCase().includes(q)) ||
        (c.latest_case?.case_code && c.latest_case.case_code.toLowerCase().includes(q)) ||
        (c.barrier_summary && c.barrier_summary.toLowerCase().includes(q))
    );
  }, [contacts, searchTerm]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Barra de Navegación Superior */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToQr}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
            title="Volver a la pantalla del código QR"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a QR
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">CRM de Conversaciones & Pipeline Kanban</h1>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                WhatsApp en Vivo
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Estado de los comerciantes, triaje automatizado por IA y atención directa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o barrio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={fetchPipeline}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Total Comerciantes</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{contacts.length}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-xs text-amber-600 font-semibold">En Triaje / Consentimiento</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {contacts.filter((c) => c.conversation_stage === 'awaiting_consent' || c.conversation_stage === 'intake').length}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-xs text-emerald-600 font-semibold">Ruta Asignada (Triaje)</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {contacts.filter((c) => c.conversation_stage === 'triaged' || c.current_route !== null).length}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-xs text-purple-600 font-semibold">Expedientes RAC-2026</p>
          <p className="text-2xl font-black text-purple-700 mt-1">
            {contacts.filter((c) => c.latest_case || c.conversation_stage === 'case_created').length}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {PIPELINE_COLUMNS.map((col) => {
          const colContacts = filteredContacts.filter((c) => {
            if (col.id === 'intake') return c.conversation_stage === 'intake' || !c.conversation_stage;
            return c.conversation_stage === col.id;
          });

          return (
            <div
              key={col.id}
              className={`bg-slate-50/70 border border-slate-200 rounded-xl p-3 border-t-4 ${col.borderColor} min-h-[500px] flex flex-col`}
            >
              {/* Encabezado de Columna */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                  {col.label}
                </span>
                <span className="text-xs font-black text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  {colContacts.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">{col.desc}</p>

              {/* Lista de Tarjetas */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colContacts.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer relative group"
                    onClick={() => openChat(c)}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                          {(c.business_name || c.display_name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {c.business_name || c.display_name || 'Comerciante'}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {c.phone_number ? `+${c.phone_number}` : c.remote_jid.replace('@lid', '')}
                          </p>
                        </div>
                      </div>
                      {c.latest_case && (
                        <span className="text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
                          {c.latest_case.case_code.split('-').slice(0, 2).join('-')}
                        </span>
                      )}
                    </div>

                    {/* Ubicación y Ruta */}
                    {(c.neighborhood || c.commune) && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-1.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{[c.neighborhood, c.commune].filter(Boolean).join(', ')}</span>
                      </div>
                    )}

                    {c.current_route && (
                      <div className="mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 block truncate">
                          {c.route_label || `Ruta ${c.current_route}`}
                        </span>
                      </div>
                    )}

                    {/* Último Mensaje */}
                    {c.last_message && (
                      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] text-slate-600 mb-2 line-clamp-2">
                        <span className="font-semibold text-slate-700">
                          {c.last_message.direction === 'inbound' ? 'Él: ' : 'Bot: '}
                        </span>
                        {c.last_message.body}
                      </div>
                    )}

                    {/* Pie de tarjeta con acciones y cambio de etapa */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {c.messages_count} msgs
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openChat(c);
                        }}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Ver Chat <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Selector de mover de columna rápido */}
                    <div
                      className="mt-2 pt-1.5 border-t border-dashed border-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Mover etapa:</label>
                      <select
                        value={c.conversation_stage || 'intake'}
                        onChange={(e) =>
                          handleUpdateStage(c.id, e.target.value as ContactItem['conversation_stage'])
                        }
                        className="w-full text-[10px] py-0.5 px-1 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none"
                      >
                        {PIPELINE_COLUMNS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {colContacts.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Sin contactos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Drawer de Chat de Conversación */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header del Chat */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {(selectedContact.business_name || selectedContact.display_name || 'C')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedContact.business_name || selectedContact.display_name || 'Comerciante'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    +{selectedContact.phone_number || selectedContact.remote_jid} •{' '}
                    <span className="font-semibold text-emerald-700">
                      {PIPELINE_COLUMNS.find((p) => p.id === selectedContact.conversation_stage)?.label}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha rápida de información */}
            <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-xs grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="font-bold text-slate-700">Ubicación:</span>{' '}
                {[selectedContact.neighborhood, selectedContact.commune].filter(Boolean).join(' - ') || 'No especificada'}
              </div>
              <div>
                <span className="font-bold text-slate-700">Ley 1581:</span>{' '}
                <span
                  className={
                    selectedContact.consent_status === 'granted'
                      ? 'text-emerald-700 font-bold'
                      : 'text-amber-700 font-bold'
                  }
                >
                  {selectedContact.consent_status === 'granted' ? 'Autorizado' : 'Pendiente'}
                </span>
              </div>
              {selectedContact.latest_case && (
                <div className="col-span-2 bg-purple-50 p-1.5 rounded border border-purple-200 text-purple-900">
                  <span className="font-bold">Expediente:</span> {selectedContact.latest_case.case_code} (
                  {selectedContact.latest_case.assigned_entity})
                </div>
              )}
            </div>

            {/* Mensajes del Chat */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Cargando historial de WhatsApp...
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  No hay mensajes registrados con este contacto.
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isInbound = msg.direction === 'inbound';
                  const isAudio = msg.body.includes('[Nota de voz') || msg.body.includes('[Audio');
                  const isImage = msg.body.includes('[Imagen');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                          isInbound
                            ? 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                            : 'bg-emerald-600 text-white rounded-br-xs'
                        }`}
                      >
                        {/* Badges de multimedia */}
                        {isAudio && (
                          <div className={`flex items-center gap-1.5 mb-1 font-bold ${isInbound ? 'text-blue-600' : 'text-emerald-100'}`}>
                            <Headphones className="w-3.5 h-3.5" />
                            <span>Audio / Nota de voz</span>
                          </div>
                        )}
                        {isImage && (
                          <div className={`flex items-center gap-1.5 mb-1 font-bold ${isInbound ? 'text-amber-600' : 'text-emerald-100'}`}>
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Imagen recibida</span>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isInbound ? 'text-slate-400' : 'text-emerald-200'
                          }`}
                        >
                          {!isInbound && (
                            <span>{msg.llm_model === 'human_agent' ? 'Agente Humano' : 'Bot IA'} • </span>
                          )}
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Formulario para Enviar Mensaje Manual */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje de WhatsApp para el comerciante..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                disabled={sendingMessage}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={sendingMessage || !manualText.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {sendingMessage ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Enviar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
