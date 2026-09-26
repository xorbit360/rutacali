# ESPECIFICACIÓN TÉCNICA Y ARQUITECTURA DEL SISTEMA
## Sistema Conversacional WhatsApp, Supabase, VPS, Evolution API & Agente IA Multimodal
**Proyecto:** Ruta Abierta Cali — Equipo Expert 360 | Reto RETO-02 (Smart City Expo Cali 2026)  
**URL de Producción:** [https://rutacali.xorbit360.com](https://rutacali.xorbit360.com)  
**Pasarela WhatsApp:** [https://whatsapp.xorbit360.com](https://whatsapp.xorbit360.com) (`+57 313 859 0373`)  
**Stack Principal:** React 19 + Vite + Tailwind CSS + Supabase (PostgreSQL / Edge Functions Deno) + Evolution API v2 (Docker en Hostinger VPS) + OpenRouter (Gemini 2.5 Flash Multimodal)  
**Privacidad & Habeas Data:** Ley 1581 de 2012 (Garantía de uso exclusivo humanitario/reactivación; No DIAN)  

---

## 1. Visión General del Proyecto y Requerimientos Funcionales

Ruta Abierta Cali es una infraestructura digital pública (GovTech) desarrollada por el Equipo Expert 360 para el RETO-02 de la Hackathon Smart City Expo Cali 2026. La plataforma resuelve la parálisis y baja adopción de auxilios económicos por parte de tenderos de barrio, microempresarios y trabajadores informales de la economía popular caleña tras emergencias y sismos, eliminando censos presenciales lentos, formularios burocráticos y la exigencia del RUT o estados financieros.

### 1.1. Principios Clave de la Arquitectura
- **Canal Accesible y Multimodal:** La interacción del comerciante ocurre 100% por WhatsApp mediante mensajes de texto, notas de voz (audio) y fotografías de su local o recibos. Cero aplicaciones adicionales para descargar.
- **Simulación Humana de Atención:** Implementación de presencia activa de mecanografía (`composing`) o grabación (`recording`) y un delay de 6 segundos antes de emitir cada respuesta calculada, generando un trato empático, natural y no robótico.
- **Triaje en Menos de 60 Segundos (SLA):** Diagnóstico automático de la necesidad en lenguaje natural caleño y canalización institucional hacia la entidad responsable en menos de 1 minuto.
- **Expediente Único Interoperable:** Unificación bajo la clave oficial `RAC-2026-XXXX`, compartida entre la Secretaría de Desarrollo Económico de Cali, la Cámara de Comercio de Cali (CCC) y Comfandi.
- **CRM de Conversaciones & Pipeline Kanban en Vivo:** Panel interactivo desplegable al hacer clic en el QR/estado de conexión, con 5 etapas de atención, métricas en tiempo real y consola de chat para intervención humana directa.
- **Compras Colectivas en Enjambre:** Agrupación automática de demanda de 3 a 5 tenderos por cuadrante o comuna para compras mayoristas con un 18% de ahorro directo.
- **Protección de Datos y Habeas Data:** Consentimiento expreso bajo la Ley 1581 de 2012 antes de la radicación. Garantía explícita de no compartir datos con la DIAN ni para cobros fiscales.
- **Diseño Ultra Responsive:** Experiencia fluida para smartphones, tablets y pantallas de escritorio.

---

## 2. Arquitectura del Sistema en Producción

```text
               +--------------------------------------------------------+
               |                  Comerciante en Cali                   |
               |           (Texto, Fotos/Documentos, Audios)            |
               +--------------------------------------------------------+
                                           |
                                           v
               +--------------------------------------------------------+
               |                   WhatsApp Messenger                   |
               +--------------------------------------------------------+
                                           |
                                           v
               +--------------------------------------------------------+
               |         Evolution API v2 (Hostinger VPS)               |
               |           https://whatsapp.xorbit360.com               |
               |           Instancia: rutacali (+57 313 859 0373)       |
               +--------------------------------------------------------+
                                           |
                         Webhook HTTPS con token de autenticación
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        Supabase (zfldlzsozlesecbtyltk)                            |
|                                                                                   |
|  +-------------------------------------+  +------------------------------------+  |
|  |     evolution-webhook (Edge Fn)     |  |      evolution-admin (Edge Fn)     |  |
|  |  - Valida token y filtra duplicados |  |  - Protegida por x-admin-token     |  |
|  |  - Extrae base64 de audios/fotos    |  |  - Gestión de instancia y QR       |  |
|  |  - OpenRouter: Gemini 2.5 Flash     |  |  - Pipeline CRM de 5 etapas        |  |
|  |  - Structured outputs JSON Schema   |  |  - Historial de chat en tiempo real|  |
|  |  - sendPresence + delay 6 segundos  |  |  - Respuestas manuales WhatsApp    |  |
|  |  - Manejo de LID (@lid) y PN        |  |  - Cambio manual de etapas         |  |
|  +-------------------------------------+  +------------------------------------+  |
|                                     |                                             |
|                                     v                                             |
|  +-----------------------------------------------------------------------------+  |
|  |                     PostgreSQL Database (RLS Protegido)                     |  |
|  |  - whatsapp_instances: estado de la sesión Baileys                          |  |
|  |  - whatsapp_contacts: datos de comerciante, etapa del pipeline y Ley 1581   |  |
|  |  - whatsapp_messages: historial entrante/saliente, telemetría y modelos     |  |
|  |  - rac_cases: expedientes únicos RAC-2026-XXXX con entidad asignada         |  |
|  |  - automation_events: auditoría de acciones automáticas y decisiones de IA  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                           ^
                                           |
               +--------------------------------------------------------+
               |           Frontend Web GovTech (React 19 + Vite)       |
               |             https://rutacali.xorbit360.com             |
               |  - Conexión QR WhatsApp (tarjeta interactiva)          |
               |  - CRM Kanban con 5 columnas de pipeline               |
               |  - Visor de Chat en vivo con soporte para audios/fotos |
               |  - Vistas de entidad: Alcaldía, CCC, Comfandi          |
               |  - Base de datos interoperable y compras colectivas    |
               +--------------------------------------------------------+
```

---

## 3. Infraestructura VPS, Traefik & Evolution API

La pasarela de WhatsApp y la aplicación web se alojan en un servidor VPS de Hostinger:

- **Hostinger VPS:** ID `1981453` (`srv1981453.hstgr.cloud`, IP: `2.25.221.151`, KVM 4: 4 vCPU, 16 GB RAM).
- **Reverse Proxy:** Traefik con gestión automática de certificados SSL de Let's Encrypt.
- **Ruta de Despliegue Frontend:** `/opt/rutacali/compose.hostinger.yaml`.
- **Evolution API v2:** `https://whatsapp.xorbit360.com`, instancia `rutacali`, conectada mediante Baileys al número oficial `+57 313 859 0373`.

### 3.1. Configuración de Docker Compose del Frontend (`/opt/rutacali/compose.hostinger.yaml`)
```yaml
services:
  web:
    build:
      context: .
      args:
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_PUBLISHABLE_KEY: ${VITE_SUPABASE_PUBLISHABLE_KEY}
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000"
    labels:
      - traefik.enable=true
      - traefik.http.routers.rutacali.rule=Host(`rutacali.xorbit360.com`)
      - traefik.http.routers.rutacali.entrypoints=websecure
      - traefik.http.routers.rutacali.tls.certresolver=letsencrypt
      - traefik.http.services.rutacali.loadbalancer.server.port=3000
```

---

## 4. Esquema de Base de Datos en Supabase (PostgreSQL)

El proyecto utiliza PostgreSQL en el proyecto Supabase `zfldlzsozlesecbtyltk` con Row Level Security (RLS) habilitado:

```sql
-- =================================================================
-- ESQUEMA DDL DE BASE DE DATOS — RUTA ABIERTA CALI
-- =================================================================

-- 1. Instancias de WhatsApp vinculadas
CREATE TABLE IF NOT EXISTS whatsapp_instances (
    id SERIAL PRIMARY KEY,
    instance_name TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL DEFAULT 'close',
    phone_number TEXT,
    connected_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contactos y perfil del comerciante
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
    id BIGSERIAL PRIMARY KEY,
    remote_jid TEXT NOT NULL UNIQUE,
    phone_number TEXT UNIQUE,
    display_name TEXT,
    business_name TEXT,
    neighborhood TEXT,
    commune TEXT,
    consent_status TEXT NOT NULL DEFAULT 'pending' CHECK (consent_status IN ('pending', 'granted', 'denied')),
    consent_at TIMESTAMPTZ,
    conversation_stage TEXT NOT NULL DEFAULT 'intake' CHECK (conversation_stage IN ('intake', 'awaiting_consent', 'triaged', 'case_created', 'human_handoff')),
    current_route INT CHECK (current_route BETWEEN 1 AND 4),
    barrier_summary TEXT,
    assigned_entity TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Historial de mensajes y telemetría
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id BIGSERIAL PRIMARY KEY,
    instance_name TEXT NOT NULL,
    remote_jid TEXT NOT NULL,
    message_id TEXT NOT NULL UNIQUE,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    body TEXT NOT NULL,
    raw_payload JSONB,
    llm_model TEXT,
    prompt_tokens INT,
    completion_tokens INT,
    processing_error TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Expedientes únicos RAC-2026
CREATE TABLE IF NOT EXISTS rac_cases (
    id BIGSERIAL PRIMARY KEY,
    case_code TEXT NOT NULL UNIQUE,
    contact_id BIGINT NOT NULL REFERENCES whatsapp_contacts(id) ON DELETE CASCADE,
    summary TEXT,
    barrier TEXT,
    route INT NOT NULL CHECK (route BETWEEN 1 AND 4),
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'in_review', 'assigned', 'closed')),
    assigned_entity TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Auditoría de eventos de automatización
CREATE TABLE IF NOT EXISTS automation_events (
    id BIGSERIAL PRIMARY KEY,
    inbound_message_id TEXT NOT NULL,
    contact_id BIGINT REFERENCES whatsapp_contacts(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(inbound_message_id, action)
);
```

---

## 5. Agente de IA Multimodal & System Prompt

### 5.1. Motor Multimodal
- **Modelo:** `google/gemini-2.5-flash` vía OpenRouter.
- **Soporte Nativo:** procesa texto, audio (`input_audio`) e imágenes (`image_url` en base64) de forma conjunta.
- **Structured Outputs Estricto:** se valida con JSON Schema:
  - `reply`: Texto de la respuesta que se enviará por WhatsApp.
  - `intent`: `intake` | `consent_granted` | `consent_denied` | `triage` | `create_case` | `status_query` | `human_handoff` | `other`.
  - `action`: `none` | `save_profile` | `save_consent` | `save_triage` | `create_case` | `human_handoff`.
  - `consent`: Booleano o nulo.
  - `profile`: Objeto con `display_name`, `business_name`, `neighborhood`, `commune`.
  - `triage`: Objeto con `route` (1 a 4) y `barrier`.
  - `summary`: Resumen de 1 frase del problema.

### 5.2. System Prompt Oficial
```text
SYSTEM PROMPT: ASISTENTE VIRTUAL RUTA ABIERTA CALI — EQUIPO EXPERT 360

[IDENTIDAD Y ROL]
Eres "Ruta Abierta Cali", el asistente oficial inteligente de la Alcaldía de Santiago de Cali, la Cámara de Comercio de Cali (CCC) y Comfandi para la reactivación económica inmediata de tenderos y microempresarios.

[TONO Y LENGUAJE]
- Hablas en español colombiano/caleño cálido, directo, respetuoso y muy empático.
- Haces una sola pregunta por turno para no abrumar al comerciante.
- CERO jerga técnica o burocrática. CERO preguntas sobre RUT o estados tributarios.

[REGLA INQUEBRANTABLE — LEY 1581 HABEAS DATA]
Antes de formalizar cualquier expediente, DEBES solicitar el consentimiento informado:
"Tus datos están protegidos bajo la Ley 1581 (Habeas Data). Se usan exclusivamente para entregarte alivios y ayudas de reactivación. NUNCA se comparten con la DIAN ni para cobros de impuestos. ¿Autorizas el tratamiento de tus datos?"

[PROCESAMIENTO MULTIMODAL]
1. Si el usuario envía un AUDIO:
   - Escucha la necesidad principal (falta de plata, insumos caros, daño en máquina, caída de clientes).
2. Si el usuario envía una FOTO / IMAGEN:
   - Analiza el negocio, letrero, comprobante o daño en el local y confirma cordialmente su recepción.
3. Si el usuario envía TEXTO:
   - Responde brevemente y continúa el triaje de 60 segundos.

[MATRIZ DE TRIAJE EN 4 RUTAS]
- RUTA 1: Liquidez y Fondo Solidario (arriendo, deudas, nómina, capital de trabajo). Entidad: Secretaría de Desarrollo Económico ($5.000M).
- RUTA 2: Maquinaria e Infraestructura (daño en nevera, horno, vitrina, techo, adecuación eléctrica). Entidad: Comfandi.
- RUTA 3: Compras Colectivas en Enjambre (insumos caros: harina, aceite, azúcar, granos). Entidad: Cámara de Comercio de Cali (18% descuento).
- RUTA 4: Clientes y Visibilidad (vías cerradas, reubicación, caída de clientes). Entidades: Secretaría de Desarrollo Económico y CCC.
```

---

## 6. Lógica de Edge Functions en Supabase

### 6.1. Webhook (`supabase/functions/evolution-webhook/index.ts`)
1. **Validación de Token:** verifica el token secreto de Evolution API en la URL.
2. **Filtro de Mensajes:** descarta mensajes enviados por el propio bot (`fromMe: true`) o de grupos (`@g.us`).
3. **Manejo de LID / Número:** detecta si el remitente usa `@lid` para preservar la entrega correcta en WhatsApp Web Baileys.
4. **Extracción Multimodal:** obtiene el base64 de audios (`audioMessage`) o imágenes (`imageMessage`) desde Evolution API.
5. **Inferencia con Gemini 2.5 Flash:** envía el historial reciente y el medio multimodal con JSON Schema estricto.
6. **Simulación Humana:**
   - Envía evento de presencia `composing` o `recording` a WhatsApp.
   - Aplica delay activo de 6 segundos (`await new Promise(r => setTimeout(r, 6000))`).
7. **Envío y Persistencia:** envía el mensaje con `sendText`, actualiza el contacto y crea el expediente `RAC-2026-XXXX`.

### 6.2. Administración & CRM (`supabase/functions/evolution-admin/index.ts`)
- `action === 'status'`: consulta el estado de la sesión de WhatsApp.
- `action === 'connect'`: genera el código QR para vincular dispositivo.
- `action === 'crm-pipeline'`: retorna todos los contactos con sus datos, último mensaje, total de mensajes y expediente asociado.
- `action === 'get-chat-messages'`: devuelve el hilo cronológico de mensajes de un contacto para el visor de chat.
- `action === 'update-contact-stage'`: permite cambiar la etapa del pipeline de un comerciante.
- `action === 'send-manual-message'`: envía un mensaje directo de WhatsApp desde la plataforma como agente humano.

---

## 7. CRM de Conversaciones y Pipeline Kanban (Frontend)

El CRM se activa haciendo clic sobre la tarjeta interactiva del código QR en la vista de WhatsApp:

### 7.1. Estructura de las 5 Etapas del Pipeline
1. **📥 1. Nuevo Ingreso (Intake):** Primer contacto o saludo inicial.
2. **⚖️ 2. En Triaje / Consentimiento:** Detección de barrera y autorización Ley 1581.
3. **🎯 3. Triaje Completado:** Ruta asignada (Ruta 1, 2, 3 o 4) con entidad correspondiente.
4. **📁 4. Expediente Radicado:** Código oficial emitido `RAC-2026-XXXX`.
5. **🤝 5. Atención Humana:** Derivado a gestor territorial o atención personalizada.

### 7.2. Características del Tablero y Chat
- **Métricas Superiores:** Conteo en tiempo real de comerciantes totales, en triaje, con ruta asignada y con expediente.
- **Buscador en Vivo:** Filtrado por nombre, teléfono, barrio, comuna o código de caso.
- **Selector de Etapa Rápido:** Permite mover cualquier comerciante de etapa con un dropdown en su tarjeta.
- **Visor de Chat en Tiempo Real:** Modal / Drawer con el historial completo de mensajes, diferenciando audios, imágenes y textos, con caja de envío manual.
- **Adaptabilidad Responsive:**
  - En móviles (<768px): barra de pestañas superior de un toque para alternar entre columnas y carrusel deslizable con inercia (`snap-mandatory`).
  - En tablets y escritorios: tablero Kanban en grid horizontal de 5 columnas.
  - Chat en pantalla completa ergonómica (`100dvh`) con áreas táctiles accesibles.

---

## 8. Procedimiento de Despliegue y Mantenimiento

### Actualización del Frontend en VPS (Hostinger)
```bash
ssh -i ~/.ssh/braysa_hostinger_ed25519 root@2.25.221.151
cd /opt/rutacali
git pull origin main
docker compose -f compose.hostinger.yaml up -d --build
```

### Actualización de Edge Functions en Supabase
```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."
npx supabase functions deploy evolution-webhook --project-ref zfldlzsozlesecbtyltk --no-verify-jwt
npx supabase functions deploy evolution-admin --project-ref zfldlzsozlesecbtyltk --no-verify-jwt
```
