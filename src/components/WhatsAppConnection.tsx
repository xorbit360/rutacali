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
  ExternalLink,
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase">Canal oficial</p>
          <h1 className="text-2xl font-black text-slate-900">Conectar WhatsApp</h1>
          <p className="text-sm text-slate-600 mt-1">
            Vincula el número que atenderá Ruta Abierta Cali mediante Evolution API.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 text-sm font-bold ${
              connected ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {connected ? 'Conectado' : 'Sin conectar'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_380px] gap-6 items-start">
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center">
              <MessageCircle />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">+57 313 859 0373</h2>
              <p className="text-xs text-slate-500">Mensajes, audios, fotos, triaje y radicación</p>
            </div>
          </div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Clave administrativa</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Clave configurada en Supabase"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
            <button
              onClick={() => request('connect')}
              disabled={loading}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-sm font-bold disabled:opacity-60 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generar QR'}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </p>
          )}
          <div className="mt-6 pt-5 border-t border-slate-200 flex gap-2">
            <button
              onClick={() => request('status')}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            {connected && (
              <button
                onClick={() => request('logout')}
                className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-700 rounded-md text-sm font-semibold hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Desconectar
              </button>
            )}
          </div>
        </section>

        {/* TARJETA DEL QR / ESTADO INTERACTIVA: Al hacer clic, abre el CRM Kanban */}
        <aside
          onClick={() => setShowCrm(true)}
          className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-xl p-6 min-h-[380px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:shadow-xl relative group"
          title="Haz clic aquí para abrir el CRM de Conversaciones y Pipeline Kanban"
        >
          {/* Badge superior indicativo */}
          <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full shadow-xs group-hover:scale-105 transition-transform">
              <Kanban className="w-3.5 h-3.5" />
              Abrir CRM Kanban
            </span>
          </div>

          {connected ? (
            <>
              <CheckCircle2 className="w-20 h-20 text-emerald-600 mb-4 group-hover:scale-105 transition-transform" />
              <h2 className="font-black text-lg text-slate-900">WhatsApp conectado</h2>
              <p className="text-sm text-slate-500 mt-2">
                El bot ya puede recibir y responder mensajes, audios y fotos.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/80 py-2 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Haz clic aquí para ver el CRM y Pipelines</span>
              </div>
            </>
          ) : data.qr ? (
            <>
              <img
                src={data.qr.startsWith('data:') ? data.qr : `data:image/png;base64,${data.qr}`}
                alt="Código QR de WhatsApp"
                className="w-64 h-64 object-contain group-hover:scale-102 transition-transform"
              />
              <p className="text-xs text-slate-500 mt-4">
                WhatsApp → Dispositivos vinculados → Vincular dispositivo
              </p>
              <div className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">
                <span>(Clic en el QR para ver CRM Kanban)</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <QrCode className="w-20 h-20 text-slate-300 mb-4 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h2 className="font-bold text-slate-800">QR pendiente</h2>
              <p className="text-sm text-slate-500 mt-2">
                Ingresa la clave y genera el código para vincular WhatsApp.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/60 py-2 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Kanban className="w-4 h-4 text-emerald-600" />
                <span>Haz clic aquí para ver CRM & Pipeline</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
