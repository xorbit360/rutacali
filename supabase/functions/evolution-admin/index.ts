import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const baseUrl = (Deno.env.get('EVOLUTION_API_URL') || '').replace(/\/$/, '');
const apiKey = Deno.env.get('EVOLUTION_API_KEY') || '';
const instance = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'rutacali';
const phoneNumber = (Deno.env.get('EVOLUTION_PHONE_NUMBER') || '573138590373').replace(/\D/g, '');
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const supabaseKey = secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, supabaseKey, { auth: { persistSession: false } });

const routeLabels: Record<number, string> = {
  1: 'Ruta 1: Liquidez y Fondo Solidario',
  2: 'Ruta 2: Maquinaria e Infraestructura',
  3: 'Ruta 3: Compras Colectivas',
  4: 'Ruta 4: Clientes y Visibilidad'
};

async function evolution(path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { apikey: apiKey, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.response?.message?.[0] || body?.message || `Evolution API ${response.status}`);
  return body;
}

async function getPlatformData() {
  const { data, error } = await supabase
    .from('rac_cases')
    .select('case_code,created_at,route,status,assigned_entity,whatsapp_contacts!inner(display_name,business_name,neighborhood,commune,phone_number,consent_status)')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  const comerciantes = (data || []).map((item: any) => {
    const contact = Array.isArray(item.whatsapp_contacts) ? item.whatsapp_contacts[0] : item.whatsapp_contacts;
    return {
      ID_Expediente: item.case_code,
      Fecha_Hora: item.created_at,
      Nombre_Comerciante: contact?.business_name || contact?.display_name || 'Comerciante WhatsApp',
      Barrio_Comuna: [contact?.neighborhood, contact?.commune].filter(Boolean).join(' - ') || 'Pendiente de ubicación',
      Telefono_WhatsApp: contact?.phone_number ? `+${contact.phone_number}` : '',
      Ruta_Asignada: routeLabels[item.route] || `Ruta ${item.route}`,
      Estado_SLA: item.status,
      Entidad_Encargada: item.assigned_entity,
      Validacion_Ley1581: contact?.consent_status === 'granted' ? 'Aprobada' : 'Pendiente'
    };
  });
  return { comerciantes };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.headers.get('x-admin-token') !== Deno.env.get('EVOLUTION_ADMIN_TOKEN')) return json({ error: 'Clave administrativa incorrecta.' }, 401);

  try {
    const { action } = await req.json();
    if (action === 'platform-data') return json(await getPlatformData());
    if (!baseUrl || !apiKey) return json({ error: 'Evolution API no está configurada.' }, 503);
    if (action === 'logout') {
      await evolution(`/instance/logout/${instance}`, { method: 'DELETE' });
      await supabase.from('whatsapp_instances').upsert({ instance_name: instance, state: 'close', phone_number: phoneNumber, updated_at: new Date().toISOString() });
      return json({ state: 'close' });
    }
    if (action === 'status') {
      const result = await evolution(`/instance/connectionState/${instance}`);
      const state = result?.instance?.state || 'close';
      await supabase.from('whatsapp_instances').upsert({ instance_name: instance, state, phone_number: phoneNumber, connected_at: state === 'open' ? new Date().toISOString() : null, updated_at: new Date().toISOString() });
      return json({ state });
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
          number: phoneNumber,
          qrcode: true,
          webhook: { enabled: true, url: webhookUrl, byEvents: false, base64: false, events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'] }
        })
      });
    }
    const state = result?.instance?.state || result?.instance?.status || 'connecting';
    const qr = result?.base64 || result?.qrcode?.base64 || result?.qrcode?.base64Qr;
    await supabase.from('whatsapp_instances').upsert({ instance_name: instance, state, phone_number: phoneNumber, connected_at: state === 'open' ? new Date().toISOString() : null, updated_at: new Date().toISOString() });
    return json({ state, qr });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Error de integración.' }, 502);
  }
});
