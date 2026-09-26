import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { SYSTEM_PROMPT } from './prompt.ts';

type BotDecision = {
  reply: string;
  intent: 'intake' | 'consent_granted' | 'consent_denied' | 'triage' | 'create_case' | 'status_query' | 'human_handoff' | 'other';
  action: 'none' | 'save_profile' | 'save_consent' | 'save_triage' | 'create_case' | 'human_handoff';
  consent: boolean | null;
  profile: { display_name: string | null; business_name: string | null; neighborhood: string | null; commune: string | null };
  triage: { route: number | null; barrier: string | null };
  summary: string | null;
};

const evolutionUrl = (Deno.env.get('EVOLUTION_API_URL') || '').replace(/\/$/, '');
const evolutionKey = Deno.env.get('EVOLUTION_API_KEY') || '';
const instance = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'rutacali';
const openRouterKey = Deno.env.get('OPENROUTER_API_KEY') || '';
const openRouterModel = Deno.env.get('OPENROUTER_MODEL') || 'mistralai/mistral-nemo';
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const supabaseKey = secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, supabaseKey, { auth: { persistSession: false } });

const routeEntities: Record<number, string> = {
  1: 'Secretaría de Desarrollo Económico',
  2: 'Comfandi',
  3: 'Cámara de Comercio de Cali',
  4: 'Secretaría de Desarrollo Económico y Cámara de Comercio de Cali'
};

const allowedIntents = new Set(['intake', 'consent_granted', 'consent_denied', 'triage', 'create_case', 'status_query', 'human_handoff', 'other']);
const allowedActions = new Set(['none', 'save_profile', 'save_consent', 'save_triage', 'create_case', 'human_handoff']);

const responseSchema = {
  name: 'ruta_abierta_decision',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reply: { type: 'string', minLength: 1, maxLength: 1200 },
      intent: { type: 'string', enum: ['intake', 'consent_granted', 'consent_denied', 'triage', 'create_case', 'status_query', 'human_handoff', 'other'] },
      action: { type: 'string', enum: ['none', 'save_profile', 'save_consent', 'save_triage', 'create_case', 'human_handoff'] },
      consent: { type: ['boolean', 'null'] },
      profile: {
        type: 'object', additionalProperties: false,
        properties: {
          display_name: { type: ['string', 'null'], maxLength: 120 }, business_name: { type: ['string', 'null'], maxLength: 160 },
          neighborhood: { type: ['string', 'null'], maxLength: 120 }, commune: { type: ['string', 'null'], maxLength: 80 }
        },
        required: ['display_name', 'business_name', 'neighborhood', 'commune']
      },
      triage: {
        type: 'object', additionalProperties: false,
        properties: { route: { type: ['integer', 'null'], minimum: 1, maximum: 4 }, barrier: { type: ['string', 'null'], maxLength: 500 } },
        required: ['route', 'barrier']
      },
      summary: { type: ['string', 'null'], maxLength: 500 }
    },
    required: ['reply', 'intent', 'action', 'consent', 'profile', 'triage', 'summary']
  }
};

const textFromMessage = (message: any) =>
  message?.conversation || message?.extendedTextMessage?.text || message?.imageMessage?.caption || '';

function getAddress(data: any) {
  const key = data?.key || {};
  const candidates = [key.remoteJidAlt, key.senderPn, key.remoteJid].filter(Boolean);
  const jid = candidates.find((value: string) => value.endsWith('@s.whatsapp.net')) || key.remoteJid || '';
  return { remoteJid: key.remoteJid || jid, phoneNumber: String(jid).split('@')[0].replace(/\D/g, '') };
}

function validDecision(value: any): value is BotDecision {
  const nullableString = (input: unknown, maxLength: number) => input === null || (typeof input === 'string' && input.length <= maxLength);
  const profileValues = value?.profile ? Object.values(value.profile) : [];
  let actionPayloadIsValid = true;
  if (value?.action === 'save_profile') actionPayloadIsValid = profileValues.some((item) => typeof item === 'string' && item.trim().length > 0);
  if (value?.action === 'save_consent') actionPayloadIsValid = typeof value.consent === 'boolean';
  if (value?.action === 'save_triage') actionPayloadIsValid = Number.isInteger(value?.triage?.route) && typeof value?.triage?.barrier === 'string' && value.triage.barrier.trim().length > 0;
  return Boolean(
    value &&
    typeof value.reply === 'string' && value.reply.trim() &&
    allowedIntents.has(value.intent) &&
    allowedActions.has(value.action) &&
    (value.consent === null || typeof value.consent === 'boolean') &&
    value.profile &&
    nullableString(value.profile.display_name, 120) &&
    nullableString(value.profile.business_name, 160) &&
    nullableString(value.profile.neighborhood, 120) &&
    nullableString(value.profile.commune, 80) &&
    value.triage &&
    (value.triage.route === null || (Number.isInteger(value.triage.route) && value.triage.route >= 1 && value.triage.route <= 4)) &&
    nullableString(value.triage.barrier, 500) &&
    nullableString(value.summary, 500) &&
    actionPayloadIsValid
  );
}

async function sendText(phoneNumber: string, text: string) {
  const response = await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
    method: 'POST',
    headers: { apikey: evolutionKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: phoneNumber, text })
  });
  if (!response.ok) throw new Error(`Evolution sendText failed: ${response.status}`);
}

async function callOpenRouter(messages: Array<{ role: string; content: string }>, verifiedState: unknown) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openRouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://rutacali.xorbit360.com',
      'X-Title': 'Ruta Abierta Cali'
    },
    body: JSON.stringify({
      model: openRouterModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Estado verificado: ${JSON.stringify(verifiedState)}` },
        ...messages
      ],
      temperature: 0.2,
      max_tokens: 420,
      response_format: { type: 'json_schema', json_schema: responseSchema },
      provider: { sort: 'price', require_parameters: true, data_collection: 'deny' }
    })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.message || `OpenRouter failed: ${response.status}`);
  const decision = JSON.parse(body?.choices?.[0]?.message?.content || '{}');
  if (!validDecision(decision)) throw new Error('OpenRouter returned an invalid decision');
  return { decision, usage: body.usage || {} };
}

async function applyDecision(decision: BotDecision, remoteJid: string, phoneNumber: string, messageId: string) {
  const route = decision.triage.route && routeEntities[decision.triage.route] ? decision.triage.route : null;
  const now = new Date().toISOString();
  const { data: existingContact, error: contactError } = await supabase
    .from('whatsapp_contacts')
    .upsert({ remote_jid: remoteJid, phone_number: phoneNumber, updated_at: now }, { onConflict: 'phone_number' })
    .select()
    .single();
  if (contactError) throw contactError;

  const updates: Record<string, unknown> = { updated_at: now };
  if (decision.action === 'save_profile') {
    for (const [key, value] of Object.entries(decision.profile)) if (value) updates[key] = value;
  } else if (decision.action === 'save_consent' && decision.consent !== null) {
    updates.consent_status = decision.consent ? 'granted' : 'denied';
    updates.consent_at = decision.consent ? now : null;
    updates.conversation_stage = decision.consent && existingContact.current_route ? 'triaged' : 'intake';
  } else if (decision.action === 'save_triage' && route && decision.triage.barrier) {
    updates.current_route = route;
    updates.barrier_summary = decision.triage.barrier;
    updates.assigned_entity = routeEntities[route];
    updates.conversation_stage = existingContact.consent_status === 'granted' ? 'triaged' : 'awaiting_consent';
  } else if (decision.action === 'human_handoff') {
    updates.conversation_stage = 'human_handoff';
  }

  let contact = existingContact;
  if (Object.keys(updates).length > 1) {
    const { data: updatedContact, error: updateError } = await supabase
      .from('whatsapp_contacts').update(updates).eq('id', existingContact.id).select().single();
    if (updateError) throw updateError;
    contact = updatedContact;
  }

  let reply = decision.reply;
  let eventStatus = 'completed';
  let caseData = null;
  if (decision.action === 'create_case') {
    if (contact.consent_status !== 'granted') {
      eventStatus = 'rejected';
      reply = 'Antes de crear tu expediente necesito tu autorización expresa para tratar los datos de esta conversación según la Ley 1581 de 2012. ¿Autorizas?';
    } else if (!contact.current_route || !contact.barrier_summary) {
      eventStatus = 'rejected';
      reply = 'Antes de crear el expediente necesito identificar tu principal dificultad. Cuéntame brevemente qué está afectando tu negocio.';
    } else {
      const { data: existing } = await supabase.from('rac_cases').select('*').eq('contact_id', contact.id).in('status', ['received', 'in_review', 'assigned']).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (existing) {
        caseData = existing;
      } else {
        const code = `RAC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const { data: created, error } = await supabase.from('rac_cases').insert({
          case_code: code,
          contact_id: contact.id,
          summary: decision.summary || contact.barrier_summary,
          barrier: contact.barrier_summary,
          route: contact.current_route,
          assigned_entity: routeEntities[contact.current_route]
        }).select().single();
        if (error) throw error;
        caseData = created;
        await supabase.from('whatsapp_contacts').update({ conversation_stage: 'case_created', updated_at: new Date().toISOString() }).eq('id', contact.id);
      }
      reply = `${reply}\n\nNúmero de expediente: ${caseData.case_code}`;
    }
  }

  await supabase.from('automation_events').upsert({
    inbound_message_id: messageId,
    contact_id: contact.id,
    action: decision.action,
    status: eventStatus,
    payload: { decision, case_code: caseData?.case_code || null }
  }, { onConflict: 'inbound_message_id,action' });
  return reply;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const token = new URL(req.url).searchParams.get('token');
  if (!token || token !== Deno.env.get('EVOLUTION_WEBHOOK_SECRET')) return new Response('Unauthorized', { status: 401 });
  if (!evolutionUrl || !evolutionKey || !openRouterKey || !supabaseKey) return new Response('Integration not configured', { status: 503 });

  const payload = await req.json();
  if ((payload.event || '').toLowerCase().replace(/[._-]/g, '') !== 'messagesupsert') return Response.json({ ok: true });
  const data = payload.data || {};
  if (data.key?.fromMe || String(data.key?.remoteJid || '').endsWith('@g.us')) return Response.json({ ok: true });
  const body = textFromMessage(data.message);
  const messageId = data.key?.id;
  const { remoteJid, phoneNumber } = getAddress(data);
  if (!messageId || !remoteJid || !phoneNumber || !body) return Response.json({ ok: true });

  const { error: inboundError } = await supabase.from('whatsapp_messages').insert({
    instance_name: instance, remote_jid: remoteJid, message_id: messageId, direction: 'inbound', body, raw_payload: payload
  });
  if (inboundError?.code === '23505') return Response.json({ ok: true, duplicate: true });
  if (inboundError) throw inboundError;

  try {
    const [{ data: history, error: historyError }, { data: contact, error: contactError }] = await Promise.all([
      supabase.from('whatsapp_messages').select('direction,body').eq('remote_jid', remoteJid).order('created_at', { ascending: false }).limit(10),
      supabase.from('whatsapp_contacts').select('*').eq('phone_number', phoneNumber).maybeSingle()
    ]);
    if (historyError) throw historyError;
    if (contactError) throw contactError;
    let latestCase = null;
    if (contact?.id) {
      const { data, error } = await supabase.from('rac_cases').select('case_code,status,route,assigned_entity,created_at,updated_at').eq('contact_id', contact.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      latestCase = data;
    }
    const messages = (history || []).reverse().map((message: any) => ({ role: message.direction === 'outbound' ? 'assistant' : 'user', content: message.body }));
    const { decision, usage } = await callOpenRouter(messages, { contact: contact || { conversation_stage: 'intake', consent_status: 'pending' }, latest_case: latestCase });
    const reply = await applyDecision(decision, remoteJid, phoneNumber, messageId);
    await sendText(phoneNumber, reply);
    await supabase.from('whatsapp_messages').insert({ instance_name: instance, remote_jid: remoteJid, direction: 'outbound', body: reply, llm_model: openRouterModel });
    await supabase.from('whatsapp_messages').update({ processed_at: new Date().toISOString(), llm_model: openRouterModel, prompt_tokens: usage.prompt_tokens || null, completion_tokens: usage.completion_tokens || null }).eq('message_id', messageId);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown processing error';
    await supabase.from('whatsapp_messages').update({ processing_error: message }).eq('message_id', messageId);
    await sendText(phoneNumber, 'Recibimos tu mensaje, pero el asistente no pudo procesarlo en este momento. Un gestor continuará la atención.').catch(() => undefined);
    return Response.json({ ok: false, error: 'Processing failed' }, { status: 500 });
  }
});
