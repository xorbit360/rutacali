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
  Image as ImageIcon,
  Layers,
  Filter,
  Users
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
  conversation_stage: string;
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

export type PipelineStageId = 
  | 'NUEVO_REGISTRO' 
  | 'EN_TRIAJE_IA' 
  | 'ASIGNADO_ENTIDAD' 
  | 'EN_ATENCION_SLA' 
  | 'ENJAMBRE_ACTIVO' 
  | 'ATENDIDO';

const PIPELINE_COLUMNS: {
  id: PipelineStageId;
  label: string;
  shortLabel: string;
  badgeColor: string;
  borderColor: string;
  desc: string;
}[] = [
  {
    id: 'NUEVO_REGISTRO',
    label: '1. Nuevo Registro',
    shortLabel: 'Registro',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderColor: 'border-t-blue-500',
    desc: 'Primer contacto recibido'
  },
  {
    id: 'EN_TRIAJE_IA',
    label: '2. En Triaje IA',
    shortLabel: 'Triaje IA',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'border-t-amber-500',
    desc: 'Evaluación y Ley 1581'
  },
  {
    id: 'ASIGNADO_ENTIDAD',
    label: '3. Asignado a Entidad',
    shortLabel: 'Asignado',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'border-t-emerald-500',
    desc: 'Ruta 1 a 4 definida'
  },
  {
    id: 'EN_ATENCION_SLA',
    label: '4. En Atención SLA',
    shortLabel: 'SLA 24h',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    borderColor: 'border-t-purple-500',
    desc: 'Expediente RAC-2026'
  },
  {
    id: 'ENJAMBRE_ACTIVO',
    label: '5. Enjambre Activo',
    shortLabel: 'Enjambre',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    borderColor: 'border-t-orange-500',
    desc: 'Compras colectivas insumos'
  },
  {
    id: 'ATENDIDO',
    label: '6. Atendido',
    shortLabel: 'Atendido',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    borderColor: 'border-t-teal-500',
    desc: 'Alivio entregado / Resuelto'
  }
];

function matchesStage(stage: string | undefined, colId: PipelineStageId): boolean {
  const s = (stage || 'NUEVO_REGISTRO').toUpperCase();
  if (colId === 'NUEVO_REGISTRO') return s === 'NUEVO_REGISTRO' || s === 'INTAKE';
  if (colId === 'EN_TRIAJE_IA') return s === 'EN_TRIAJE_IA' || s === 'AWAITING_CONSENT';
  if (colId === 'ASIGNADO_ENTIDAD') return s === 'ASIGNADO_ENTIDAD' || s === 'TRIAGED';
  if (colId === 'EN_ATENCION_SLA') return s === 'EN_ATENCION_SLA' || s === 'CASE_CREATED';
  if (colId === 'ENJAMBRE_ACTIVO') return s === 'ENJAMBRE_ACTIVO' || s === 'ENJAMBRE';
  if (colId === 'ATENDIDO') return s === 'ATENDIDO' || s === 'HUMAN_HANDOFF' || s === 'RESOLVED';
  return false;
}

interface CrmKanbanProps {
  adminToken: string;
  onBackToQr: () => void;
}

export function CrmKanban({ adminToken, onBackToQr }: CrmKanbanProps) {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMobileTab, setActiveMobileTab] = useState<'all' | PipelineStageId>('all');
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

  const handleUpdateStage = async (contactId: number, stage: PipelineStageId) => {
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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
      {/* Barra de Navegación Superior Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToQr}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
            title="Volver a la pantalla del código QR"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Volver a</span> QR
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight">
                CRM & Pipeline Kanban (6 Estados)
              </h1>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                WhatsApp en Vivo
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
              Monitoreo, triaje y seguimiento de comerciantes bajo SLA oficial
            </p>
          </div>
        </div>

        {/* Buscador y botón de sincronizar */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar comerciante, teléfono o barrio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={fetchPipeline}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>
        </div>
      </div>

      {/* Métricas rápidas adaptativas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">Total Comerciantes</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{contacts.length}</p>
        </div>
        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] sm:text-xs text-amber-600 font-semibold truncate">En Triaje IA</p>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">
            {contacts.filter((c) => matchesStage(c.conversation_stage, 'EN_TRIAJE_IA')).length}
          </p>
        </div>
        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] sm:text-xs text-purple-600 font-semibold truncate">En Atención SLA (24h)</p>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-0.5">
            {contacts.filter((c) => matchesStage(c.conversation_stage, 'EN_ATENCION_SLA') || Boolean(c.latest_case)).length}
          </p>
        </div>
        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] sm:text-xs text-teal-600 font-semibold truncate">Casos Atendidos</p>
          <p className="text-xl sm:text-2xl font-black text-teal-700 mt-0.5">
            {contacts.filter((c) => matchesStage(c.conversation_stage, 'ATENDIDO')).length}
          </p>
        </div>
      </div>

      {/* Pestañas para Móviles / Tablets (para cambiar rápido de columna entre los 6 estados) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        <button
          onClick={() => setActiveMobileTab('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeMobileTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Todos ({filteredContacts.length})
        </button>
        {PIPELINE_COLUMNS.map((col) => {
          const count = filteredContacts.filter((c) => matchesStage(c.conversation_stage, col.id)).length;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileTab(col.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                activeMobileTab === col.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <span>{col.shortLabel}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeMobileTab === col.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tablero Kanban: 6 Columnas con scroll horizontal fluido en móvil/tablet y grid en desktop */}
      <div className="flex md:grid md:grid-cols-3 xl:grid-cols-6 gap-3 items-start overflow-x-auto pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory">
        {PIPELINE_COLUMNS.map((col) => {
          if (activeMobileTab !== 'all' && activeMobileTab !== col.id) {
            return null;
          }

          const colContacts = filteredContacts.filter((c) => matchesStage(c.conversation_stage, col.id));

          return (
            <div
              key={col.id}
              className={`bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 sm:p-3 border-t-4 ${col.borderColor} min-h-[420px] sm:min-h-[480px] flex flex-col w-[85vw] sm:w-[300px] md:w-auto md:min-w-0 shrink-0 snap-center shadow-2xs`}
            >
              {/* Encabezado de Columna */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[80%] ${col.badgeColor}`}>
                  {col.label}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  {colContacts.length}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2.5 line-clamp-1">{col.desc}</p>

              {/* Lista de Tarjetas */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colContacts.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3 shadow-2xs hover:shadow-md transition-shadow cursor-pointer relative group"
                    onClick={() => openChat(c)}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                          {(c.business_name || c.display_name || 'C')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                            {c.business_name || c.display_name || 'Comerciante'}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {c.phone_number ? `+${c.phone_number}` : c.remote_jid.replace('@lid', '')}
                          </p>
                        </div>
                      </div>
                      {c.latest_case && (
                        <span className="text-[9px] font-black bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded shrink-0">
                          {c.latest_case.case_code.split('-').slice(0, 2).join('-')}
                        </span>
                      )}
                    </div>

                    {/* Ubicación */}
                    {(c.neighborhood || c.commune) && (
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600 mb-1.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{[c.neighborhood, c.commune].filter(Boolean).join(', ')}</span>
                      </div>
                    )}

                    {/* Ruta asignada */}
                    {c.current_route && (
                      <div className="mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 block truncate">
                          {c.route_label || `Ruta ${c.current_route}`}
                        </span>
                      </div>
                    )}

                    {/* Último Mensaje */}
                    {c.last_message && (
                      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[10px] sm:text-[11px] text-slate-600 mb-2 line-clamp-2">
                        <span className="font-semibold text-slate-700">
                          {c.last_message.direction === 'inbound' ? 'Él: ' : 'Bot: '}
                        </span>
                        {c.last_message.body}
                      </div>
                    )}

                    {/* Acciones y cambio de etapa */}
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
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer py-1"
                      >
                        Ver Chat <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Selector de mover de columna rápido (6 estados oficiales) */}
                    <div
                      className="mt-2 pt-1.5 border-t border-dashed border-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Mover etapa:</label>
                      <select
                        value={
                          PIPELINE_COLUMNS.find((p) => matchesStage(c.conversation_stage, p.id))?.id || 'NUEVO_REGISTRO'
                        }
                        onChange={(e) =>
                          handleUpdateStage(c.id, e.target.value as PipelineStageId)
                        }
                        className="w-full text-[10px] py-1 px-1 border border-slate-200 rounded bg-white text-slate-700 focus:outline-none"
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
                  <div className="h-28 sm:h-32 flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Sin comerciantes
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Drawer de Chat: Fullscreen en móvil, Drawer en desktop */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full sm:max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header del Chat */}
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                  {(selectedContact.business_name || selectedContact.display_name || 'C')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {selectedContact.business_name || selectedContact.display_name || 'Comerciante'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    +{selectedContact.phone_number || selectedContact.remote_jid} •{' '}
                    <span className="font-semibold text-emerald-700">
                      {PIPELINE_COLUMNS.find((p) => matchesStage(selectedContact.conversation_stage, p.id))?.shortLabel || 'En proceso'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer shrink-0"
                title="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha rápida de información */}
            <div className="px-3 sm:px-4 py-2 bg-slate-100/90 border-b border-slate-200 text-[11px] sm:text-xs grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-slate-600 shrink-0">
              <div className="truncate">
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
                <div className="sm:col-span-2 bg-purple-50 p-1.5 rounded border border-purple-200 text-purple-900 truncate">
                  <span className="font-bold">Expediente:</span> {selectedContact.latest_case.case_code} (
                  {selectedContact.latest_case.assigned_entity})
                </div>
              )}
            </div>

            {/* Mensajes del Chat */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5 sm:space-y-3 bg-slate-50/50">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs sm:text-sm">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" /> Cargando historial de WhatsApp...
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs sm:text-sm">
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
                        className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs shadow-2xs ${
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

                        <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.body}</p>
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
            <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 border-t border-slate-200 bg-white flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Escribe un mensaje de WhatsApp..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                disabled={sendingMessage}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={sendingMessage || !manualText.trim()}
                className="px-3.5 sm:px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0 transition-colors"
              >
                {sendingMessage ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Enviar</span>
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
