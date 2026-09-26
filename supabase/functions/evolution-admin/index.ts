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

async function getCrmPipeline() {
  const { data: contacts, error: contactsError } = await supabase
    .from('whatsapp_contacts')
    .select('*')
    .order('updated_at', { ascending: false });
  if (contactsError) throw contactsError;

  const contactList = contacts || [];
  const contactIds = contactList.map((c: any) => c.id).filter(Boolean);

  let casesMap: Record<string, any> = {};
  if (contactIds.length > 0) {
    const { data: cases } = await supabase
      .from('rac_cases')
      .select('*')
      .in('contact_id', contactIds)
      .order('created_at', { ascending: false });
    if (cases) {
      for (const item of cases) {
        if (!casesMap[item.contact_id]) {
          casesMap[item.contact_id] = item;
        }
      }
    }
  }

  // Obtener último mensaje para cada contacto
  const enrichedContacts = await Promise.all(
    contactList.map(async (c: any) => {
      const { data: lastMsg } = await supabase
        .from('whatsapp_messages')
        .select('body,direction,created_at')
        .eq('remote_jid', c.remote_jid)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { count } = await supabase
        .from('whatsapp_messages')
        .select('*', { count: 'exact', head: true })
        .eq('remote_jid', c.remote_jid);

      return {
        id: c.id,
        remote_jid: c.remote_jid,
        phone_number: c.phone_number,
        display_name: c.display_name,
        business_name: c.business_name,
        neighborhood: c.neighborhood,
        commune: c.commune,
        consent_status: c.consent_status,
        conversation_stage: c.conversation_stage || 'intake',
        current_route: c.current_route,
        route_label: c.current_route ? routeLabels[c.current_route] : null,
        barrier_summary: c.barrier_summary,
        assigned_entity: c.assigned_entity,
        created_at: c.created_at,
        updated_at: c.updated_at,
        latest_case: casesMap[c.id] || null,
        last_message: lastMsg || null,
        messages_count: count || 0
      };
    })
  );

  return { contacts: enrichedContacts };
}

async function getChatMessages(remoteJid: string) {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('id,direction,body,created_at,llm_model,processing_error')
    .eq('remote_jid', remoteJid)
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) throw error;
  return { messages: data || [] };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.headers.get('x-admin-token') !== Deno.env.get('EVOLUTION_ADMIN_TOKEN')) return json({ error: 'Clave administrativa incorrecta.' }, 401);

  try {
    const payload = await req.json();
    const { action } = payload;
    if (action === 'platform-data') return json(await getPlatformData());
    if (action === 'crm-pipeline') return json(await getCrmPipeline());
    if (action === 'get-chat-messages') {
      if (!payload.remote_jid) return json({ error: 'Falta remote_jid' }, 400);
      return json(await getChatMessages(payload.remote_jid));
    }
    if (action === 'update-contact-stage') {
      if (!payload.contact_id || !payload.stage) return json({ error: 'Faltan parámetros' }, 400);
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .update({ conversation_stage: payload.stage, updated_at: new Date().toISOString() })
        .eq('id', payload.contact_id)
        .select()
        .single();
      if (error) throw error;
      return json({ ok: true, contact: data });
    }
    if (action === 'send-manual-message') {
      if (!payload.remote_jid || !payload.text) return json({ error: 'Faltan parámetros' }, 400);
      const target = String(payload.remote_jid).endsWith('@lid') ? payload.remote_jid : (payload.phone_number || payload.remote_jid);
      await evolution(`/message/sendText/${instance}`, {
        method: 'POST',
        body: JSON.stringify({ number: target, text: payload.text })
      });
      const { data: insertedMsg, error: insertError } = await supabase
        .from('whatsapp_messages')
        .insert({
          instance_name: instance,
          remote_jid: payload.remote_jid,
          direction: 'outbound',
          body: payload.text,
          llm_model: 'human_agent'
        })
        .select()
        .single();
      if (insertError) throw insertError;
      return json({ ok: true, message: insertedMsg });
    }

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
          webhook: { enabled: true, url: webhookUrl, byEvents: false, base64: true, events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'] }
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
