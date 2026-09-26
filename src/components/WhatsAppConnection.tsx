import React, { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, LogOut, MessageCircle, QrCode, RefreshCw } from 'lucide-react';

type ConnectionData = { state?: string; qr?: string; message?: string };

const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-admin`;

export function WhatsAppConnection() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('rac_admin_token') || '');
  const [data, setData] = useState<ConnectionData>({ state: 'unknown' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase">Canal oficial</p>
          <h1 className="text-2xl font-black text-slate-900">Conectar WhatsApp</h1>
          <p className="text-sm text-slate-600 mt-1">Vincula el número que atenderá Ruta Abierta Cali mediante Evolution API.</p>
        </div>
        <div className={`flex items-center gap-2 text-sm font-bold ${connected ? 'text-emerald-700' : 'text-amber-700'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {connected ? 'Conectado' : 'Sin conectar'}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center"><MessageCircle /></div>
            <div><h2 className="font-bold">Instancia Ruta Cali</h2><p className="text-xs text-slate-500">Mensajes, triaje y radicación automática</p></div>
          </div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Clave administrativa</label>
          <div className="flex gap-2">
            <div className="relative flex-1"><KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="password" value={adminToken} onChange={e => setAdminToken(e.target.value)} placeholder="Clave configurada en Supabase" className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm" /></div>
            <button onClick={() => request('connect')} disabled={loading} className="px-4 py-2 bg-emerald-700 text-white rounded-md text-sm font-bold disabled:opacity-60">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generar QR'}</button>
          </div>
          {error && <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}
          <div className="mt-6 pt-5 border-t border-slate-200 flex gap-2">
            <button onClick={() => request('status')} className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-semibold"><RefreshCw className="w-4 h-4" />Actualizar</button>
            {connected && <button onClick={() => request('logout')} className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-700 rounded-md text-sm font-semibold"><LogOut className="w-4 h-4" />Desconectar</button>}
          </div>
        </section>

        <aside className="bg-white border border-slate-200 rounded-lg p-6 min-h-[360px] flex flex-col items-center justify-center text-center">
          {connected ? <><CheckCircle2 className="w-20 h-20 text-emerald-600 mb-4" /><h2 className="font-black text-lg">WhatsApp conectado</h2><p className="text-sm text-slate-500 mt-2">El bot ya puede recibir y responder mensajes.</p></> : data.qr ? <><img src={data.qr.startsWith('data:') ? data.qr : `data:image/png;base64,${data.qr}`} alt="Código QR de WhatsApp" className="w-64 h-64 object-contain" /><p className="text-xs text-slate-500 mt-4">WhatsApp → Dispositivos vinculados → Vincular dispositivo</p></> : <><QrCode className="w-20 h-20 text-slate-300 mb-4" /><h2 className="font-bold">QR pendiente</h2><p className="text-sm text-slate-500 mt-2">Ingresa la clave y genera el código.</p></>}
        </aside>
      </div>
    </div>
  );
}
