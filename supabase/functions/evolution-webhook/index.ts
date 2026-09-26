import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { SYSTEM_PROMPT } from './prompt.ts';

const evolutionUrl = (Deno.env.get('EVOLUTION_API_URL') || '').replace(/\/$/, '');
const evolutionKey = Deno.env.get('EVOLUTION_API_KEY') || '';
const instance = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'rutacali';
const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, secretKeys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const textFromMessage = (message: any) => message?.conversation || message?.extendedTextMessage?.text || message?.imageMessage?.caption || '';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const token = new URL(req.url).searchParams.get('token');
  if (!token || token !== Deno.env.get('EVOLUTION_WEBHOOK_SECRET')) return new Response('Unauthorized', { status: 401 });

  const payload = await req.json();
  if ((payload.event || '').toLowerCase().replace(/[._-]/g, '') !== 'messagesupsert') return Response.json({ ok: true });
  const data = payload.data || {};
  if (data.key?.fromMe) return Response.json({ ok: true });
  const remoteJid = data.key?.remoteJid;
  const body = textFromMessage(data.message);
  if (!remoteJid || !body) return Response.json({ ok: true });

  await supabase.from('whatsapp_messages').upsert({ instance_name: instance, remote_jid: remoteJid, message_id: data.key?.id, direction: 'inbound', body, raw_payload: payload }, { onConflict: 'message_id' });
  const { data: history } = await supabase.from('whatsapp_messages').select('direction,body').eq('remote_jid', remoteJid).order('created_at', { ascending: false }).limit(8);
  const contents = (history || []).reverse().map((m: any) => ({ role: m.direction === 'outbound' ? 'model' : 'user', parts: [{ text: m.body }] }));
  const gemini = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents, generationConfig: { temperature: 0.3, maxOutputTokens: 450 } }) });
  const geminiBody = await gemini.json();
  const reply = geminiBody?.candidates?.[0]?.content?.parts?.[0]?.text || 'Recibimos tu mensaje. Un gestor de Ruta Abierta Cali continuará la atención.';
  await fetch(`${evolutionUrl}/message/sendText/${instance}`, { method: 'POST', headers: { apikey: evolutionKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ number: remoteJid.split('@')[0], text: reply }) });
  await supabase.from('whatsapp_messages').insert({ instance_name: instance, remote_jid: remoteJid, direction: 'outbound', body: reply });
  return Response.json({ ok: true });
});
