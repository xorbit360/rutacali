import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  KeyRound,
  Loader2,
  LogOut,
  MessageCircle,
  QrCode,
  RefreshCw,
  Kanban,
  Sparkles
} from 'lucide-react';
import { CrmKanban } from './CrmKanban';

type ConnectionData = { state?: string; qr?: string; message?: string };

const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-admin`;

export function WhatsAppConnection() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('rac_admin_token') || '06mqaBYA1qN3PA9LejyAUe8YHG3A0YWh');
  const [data, setData] = useState<ConnectionData>({ state: 'unknown' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCrm, setShowCrm] = useState(false);

  const request = async (action: 'status' | 'connect' | 'logout') => {
    if (!adminToken.trim()) return setError('Ingresa la clave administrativa.');
    setLoading(true);
    setError('');
    try {
      sessionStorage.setItem('rac_admin_token', adminToken);
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ action })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No fue posible consultar Evolution API.');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken || data.state === 'open') return;
    const timer = window.setInterval(() => request('status'), 8000);
    return () => window.clearInterval(timer);
  }, [adminToken, data.state]);

  const connected = data.state === 'open';

  // Si el usuario dio clic en el cuadro del QR / imagen, mostramos el CRM Kanban
  if (showCrm) {
    return (
      <CrmKanban
        adminToken={adminToken || '06mqaBYA1qN3PA9LejyAUe8YHG3A0YWh'}
        onBackToQr={() => setShowCrm(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Canal oficial</p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Conectar WhatsApp</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Vincula el número que atenderá Ruta Abierta Cali mediante Evolution API.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full border ${
              connected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {connected ? 'WhatsApp Conectado' : 'Sin conectar'}
          </div>
        </div>
      </div>

      {/* Grid responsive para móviles, tablets y escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
        {/* Panel izquierdo: Controles de conexión */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">+57 313 859 0373</h2>
              <p className="text-xs text-slate-500">Mensajes, audios, fotos, triaje y radicación</p>
            </div>
          </div>

          <label className="text-xs font-bold text-slate-700 block mb-2">Clave administrativa</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Clave configurada en Supabase"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => request('connect')}
              disabled={loading}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold disabled:opacity-60 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generar QR'}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap gap-2">
            <button
              onClick={() => request('status')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            {connected && (
              <button
                onClick={() => request('logout')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Desconectar
              </button>
            )}
          </div>
        </section>

        {/* TARJETA DEL QR / ESTADO INTERACTIVA (Responsive para móvil y tablet) */}
        <aside
          onClick={() => setShowCrm(true)}
          className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-xl p-5 sm:p-6 min-h-[320px] sm:min-h-[360px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:shadow-xl relative group shadow-xs"
          title="Haz clic aquí para abrir el CRM de Conversaciones y Pipeline Kanban"
        >
          {/* Badge superior indicativo responsive */}
          <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 sm:px-2.5 py-1 rounded-full shadow-xs group-hover:scale-105 transition-transform">
              <Kanban className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              Abrir CRM Kanban
            </span>
          </div>

          {connected ? (
            <div className="flex flex-col items-center justify-center w-full py-2">
              <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600 mb-3 group-hover:scale-105 transition-transform" />
              <h2 className="font-black text-base sm:text-lg text-slate-900">WhatsApp conectado</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-[260px]">
                El bot ya puede recibir y responder mensajes, audios y fotos.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/90 py-2 px-3 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Clic aquí para ver CRM & Pipelines</span>
              </div>
            </div>
          ) : data.qr ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                <img
                  src={data.qr.startsWith('data:') ? data.qr : `data:image/png;base64,${data.qr}`}
                  alt="Código QR de WhatsApp"
                  className="w-48 h-48 sm:w-60 sm:h-60 object-contain group-hover:scale-102 transition-transform"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-3 max-w-[260px]">
                WhatsApp → Dispositivos vinculados → Vincular dispositivo
              </p>
              <div className="mt-2 text-xs font-bold text-emerald-700">
                <span>(Toca el QR para abrir CRM Kanban)</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-2">
              <div className="relative">
                <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mb-3 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h2 className="font-bold text-slate-800 text-sm sm:text-base">QR pendiente</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-[240px]">
                Ingresa la clave y genera el código para vincular WhatsApp.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/80 py-2 px-3 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Kanban className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Clic aquí para ver CRM & Pipeline</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
