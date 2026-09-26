import { corsHeaders } from '../_shared/cors.ts';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const baseUrl = (Deno.env.get('EVOLUTION_API_URL') || '').replace(/\/$/, '');
const apiKey = Deno.env.get('EVOLUTION_API_KEY') || '';
const instance = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'rutacali';

async function evolution(path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { apikey: apiKey, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.response?.message?.[0] || body?.message || `Evolution API ${response.status}`);
  return body;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (!baseUrl || !apiKey) return json({ error: 'Evolution API no está configurada.' }, 503);
  if (req.headers.get('x-admin-token') !== Deno.env.get('EVOLUTION_ADMIN_TOKEN')) return json({ error: 'Clave administrativa incorrecta.' }, 401);

  try {
    const { action } = await req.json();
    if (action === 'logout') {
      await evolution(`/instance/logout/${instance}`, { method: 'DELETE' });
      return json({ state: 'close' });
    }
    if (action === 'status') {
      const result = await evolution(`/instance/connectionState/${instance}`);
      return json({ state: result?.instance?.state || 'close' });
    }
    if (action !== 'connect') return json({ error: 'Acción inválida.' }, 400);

    let result;
    try {
      result = await evolution(`/instance/connect/${instance}`);
    } catch {
      const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/evolution-webhook?token=${encodeURIComponent(Deno.env.get('EVOLUTION_WEBHOOK_SECRET') || '')}`;
      result = await evolution('/instance/create', {
        method: 'POST',
        body: JSON.stringify({
          instanceName: instance,
          integration: 'WHATSAPP-BAILEYS',
          qrcode: true,
          webhook: { enabled: true, url: webhookUrl, byEvents: false, base64: false, events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'] }
        })
      });
    }
    const state = result?.instance?.state || result?.instance?.status || 'connecting';
    const qr = result?.base64 || result?.qrcode?.base64 || result?.qrcode?.base64Qr;
    return json({ state, qr });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Error de integración.' }, 502);
  }
});
