ESPECIFICACIÓN TÉCNICA Y ARQUITECTURA DEL SISTEMA
Sistema Conversacional WhatsApp, Supabase, VPS, Evolution API & Agente IA Multimodal
Proyecto: Ruta Abierta Cali — Equipo Expert 360 | Reto RETO-02 (Smart City Expo Cali 2026)
🎯 Destinatarios: Claude Code, Antigravity, Codex, Devs
⚡ Stack Principal: Supabase (PostgreSQL / Edge Functions) + Evolution API v2 (Docker VPS) + React 19 / Vite + OpenRouter (Gemini 2.5 Flash Multimodal)
🔒 Ley de Datos: Habeas Data Ley 1581 (Garantía humanitaria y reactivación; No DIAN)
📌 Subdominio / VPS: Hostinger VPS (srv1981453.hstgr.cloud, IP 2.25.221.151) + Traefik SSL

---

## 1. Visión General del Proyecto y Requerimientos Funcionales

Ruta Abierta Cali es la infraestructura digital pública (GovTech) desarrollada por el Equipo Expert 360 para el RETO-02 de la Hackathon Smart City Expo Cali 2026. La plataforma resuelve la parálisis y baja adopción de auxilios económicos por parte de los tenderos de barrio, microempresarios y trabajadores de la economía popular caleña tras emergencias y sismos, eliminando censos presenciales lentos, formularios burocráticos y la exigencia del RUT o historial crediticio.

### 1.1. Principios Clave de la Arquitectura
• Canal Accesible y Multimodal: La interacción del comerciante ocurre 100% por WhatsApp mediante mensajes de texto, notas de voz (audio) y fotografías de su local o facturas. Cero aplicaciones adicionales para descargar.
• Simulación Humana de Atención: Presencia activa (`composing` para texto/imágenes, `recording` para notas de voz) con un delay de 6 segundos antes del envío de la respuesta, generando un trato empático, natural y cercano.
• Solicitud a su Propio Ritmo & SLA Transparente de 24 a 48 Horas: El usuario puede enviar su solicitud con un solo mensaje o nota de voz a su propio ritmo y sin formularios. La IA procesa la información de forma inmediata y genera el Expediente Único (`RAC-2026`), asignándolo a la entidad correspondiente con un SLA transparente de atención de 24 a 48 horas hábiles.
• Expediente Único Interoperable: Unificación bajo la clave oficial `RAC-2026-XXXX`, compartida entre la Alcaldía de Cali, la Cámara de Comercio de Cali (CCC) y Comfandi sin duplicar trámites.
• CRM de Conversaciones & Tablero Kanban (6 Estados): Panel visual interactivo desplegable al hacer clic en el QR/estado de conexión de WhatsApp, con las 6 etapas del ciclo de vida del comerciante y consola de chat en vivo con envío manual.
• Compras Colectivas en Enjambre: Agrupación automática de demanda de 3 a 5 tenderos por cuadrante para negociar precios al por mayor con distribuidores, aplicando descuentos por volumen variables acordados comercialmente con mayoristas (rango estimado 12% - 20%).
• Protección de Datos y Habeas Data: Cumplimiento estricto de la Ley 1581 de 2012. Los datos son de uso exclusivo para ayuda humanitaria y reactivación económica. NUNCA se comparten con la DIAN ni para cobros tributarios.
• Monitoreo Pasivo Multiproveedor (Amparo de Emergencia): Evaluación del retorno del consumo de servicios públicos esenciales mediante telemetría multiproveedor (EMCALI, Celsia/EPSA, Gases de Occidente) con micro-confirmaciones de 1 clic por WhatsApp a los 15 y 30 días.
• Diseño Ultra Responsive: Adaptabilidad total para smartphones, tablets y pantallas de escritorio (carrusel con inercia táctil `snap-mandatory` y tabs rápidas en móviles).

---

## 2. Arquitectura del Sistema e Integración de Componentes

El sistema se compone de cinco capas tecnológicas desacopladas, diseñadas para alta disponibilidad, costo de infraestructura ultrabajo y trazabilidad total:

| Capa | Tecnología / Herramienta | Función en el Sistema |
| :--- | :--- | :--- |
| **Canal WhatsApp** | Evolution API v2 (Docker en VPS) | Pasarela WhatsApp Business en `https://whatsapp.xorbit360.com` conectada al número oficial `+57 313 859 0373` con soporte para QR Code, texto, notas de voz e imágenes. |
| **Backend Router & Edge Functions** | Supabase Edge Functions (Deno / TypeScript) | Webhooks de alta velocidad (`evolution-webhook` y `evolution-admin`) que procesan eventos `MESSAGES_UPSERT`, gestionan presencia, delay de 6s y operan el CRM Pipeline. |
| **Motor de IA Multimodal** | OpenRouter (`google/gemini-2.5-flash`) | Procesamiento nativo multimodal: transcripción e interpretación de notas de voz en audio, visión computacional para fotos de negocios y structured outputs con JSON Schema estricto. |
| **Base de Datos Relacional** | Supabase (PostgreSQL + RLS) | Almacenamiento seguro de expedientes `RAC-2026-XXXX`, contactos, mensajes, compras colectivas en enjambre, monitoreo multiproveedor y auditoría de eventos. |
| **CRM Kanban & Frontend Web** | React 19 + Vite + Tailwind CSS | Interfaz GovTech en `https://rutacali.xorbit360.com` con vinculación QR, Tablero Kanban de 6 etapas, visor de chat en vivo con envío de mensajes y pantallas por entidad. |
| **Respaldo Dual de Datos** | Google Sheets API / Apps Script | Sincronización en tiempo real para consulta rápida y auditoría por parte de funcionarios de la Alcaldía, CCC y Comfandi. |

---

## 3. Infraestructura VPS, Docker & Evolution API (WhatsApp)

La conexión con WhatsApp Business se realiza mediante Evolution API v2 instalada en un servidor VPS Hostinger (KVM 4, Ubuntu 22.04 LTS, 4 vCPU, 16 GB RAM):

- **Hostinger VPS:** ID `1981453` (`srv1981453.hstgr.cloud`, IP: `2.25.221.151`).
- **URL Evolution API:** `https://whatsapp.xorbit360.com` (Instancia: `rutacali`, WhatsApp: `+57 313 859 0373`).
- **Reverse Proxy:** Traefik con certificados SSL automáticos Let's Encrypt.
- **Ruta de Despliegue Frontend:** `/opt/rutacali/compose.hostinger.yaml`.

### 3.1. Archivo docker-compose.yml de Evolution API en VPS
```yaml
version: '3.8'

services:
  evolution-api:
    image: evoapicloud/evolution-api:latest
    container_name: evolution-api-jdfr-api-1
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SERVER_URL=https://whatsapp.xorbit360.com
      - DOCKER_ENV_CI=true
      - AUTHENTICATION_TYPE=apikey
      - AUTHENTICATION_API_KEY=06mqaBYA1qN3PA9LejyAUe8YHG3A0YWh
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION_URI=postgresql://postgres:postgresSecret@postgres:5432/evolution
      - LOG_LEVEL=ERROR,WARN,INFO
      - WEBHOOK_GLOBAL_URL=https://zfldlzsozlesecbtyltk.supabase.co/functions/v1/evolution-webhook?token=06mqaBYA1qN3PA9LejyAUe8YHG3A0YWh
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
      - WEBHOOK_EVENTS_MEDIA_BASE64=true
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=evolution
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgresSecret
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:latest
    restart: always

volumes:
  postgres_data:
```

---

## 4. Esquema de Base de Datos en Supabase (PostgreSQL)

El proyecto utiliza Supabase (proyecto `zfldlzsozlesecbtyltk`) como backend relacional principal. A continuación se detalla el script DDL definitivo con los 3 ajustes estratégicos incorporados:

```sql
-- =================================================================
-- SCRIPT DE BASE DE DATOS SUPABASE — RUTA ABIERTA CALI (EXPERT 360)
-- =================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Secuencia para código único de expediente RAC-2026-XXXX
CREATE SEQUENCE IF NOT EXISTS rac_expediente_seq START WITH 1001;

-- Función para generar el código de expediente automáticamente
CREATE OR REPLACE FUNCTION generate_rac_code() 
RETURNS TEXT AS $$
BEGIN
  RETURN 'RAC-2026-' || LPAD(NEXTVAL('rac_expediente_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 1. TABLA PRINCIPAL DE COMERCIANTES Y EXPEDIENTES
-- Incorpora explícitamente los 6 ESTADOS DEL PIPELINE CRM
CREATE TABLE IF NOT EXISTS comerciantes_rac2026 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expediente_id TEXT UNIQUE DEFAULT generate_rac_code(),
    whatsapp_num VARCHAR(20) NOT NULL UNIQUE,
    remote_jid TEXT UNIQUE,
    nombre_comerciante VARCHAR(150),
    nombre_negocio VARCHAR(150),
    barrio_comuna VARCHAR(100),
    tipo_negocio VARCHAR(100),
    ruta_asignada VARCHAR(50) CHECK (ruta_asignada IN (
        'LIQUIDEZ_ALCALDIA', 
        'MAQUINARIA_COMFANDI', 
        'INSUMOS_ENJAMBRE_CCC', 
        'CLIENTES_VISIBILIDAD', 
        'SIN_CLASIFICAR'
    )),
    -- AJUSTE 3: 6 Estados oficiales del Pipeline CRM Kanban
    estado_pipeline VARCHAR(50) NOT NULL DEFAULT 'NUEVO_REGISTRO' CHECK (estado_pipeline IN (
        'NUEVO_REGISTRO',       -- 1. Primer contacto recibido en el canal
        'EN_TRIAJE_IA',        -- 2. Asistente evaluando necesidad y validando Ley 1581
        'ASIGNADO_ENTIDAD',    -- 3. Canalizado oficialmente a Alcaldía, CCC o Comfandi
        'EN_ATENCION_SLA',     -- 4. Trámite activo bajo ventana de compromiso 24h
        'ENJAMBRE_ACTIVO',     -- 5. Agrupado en compra colectiva de insumos mayoristas
        'ATENDIDO'             -- 6. Alivio entregado / Caso resuelto satisfactoriamente
    )),
    estado_sla VARCHAR(50) DEFAULT 'EN_ATENCION_PRIORITARIA_24H',
    consentimiento_ley1581 BOOLEAN DEFAULT TRUE,
    consentimiento_at TIMESTAMPTZ,
    resumen_solicitud TEXT,
    barrera_identificada TEXT,
    ultimo_audio_url TEXT,
    ultima_imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE COMPRAS COLECTIVAS EN ENJAMBRE
-- AJUSTE 1: Descuento variable por volumen acordado con mayoristas (flexibilizado)
CREATE TABLE IF NOT EXISTS enjambres_insumos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_enjambre VARCHAR(50) UNIQUE,
    cuadrante_barrio VARCHAR(100) NOT NULL,
    insumo_tipo VARCHAR(100) NOT NULL,
    cantidad_total_unidades INT DEFAULT 0,
    -- Porcentaje estimado de descuento por volumen acordado comercialmente (ej. 12% - 20%)
    porcentaje_descuento_estimado NUMERIC(5,2),
    proveedor_mayorista VARCHAR(150),
    estado_enjambre VARCHAR(50) DEFAULT 'AGRUPANDO_TENDEROS' CHECK (estado_enjambre IN (
        'AGRUPANDO_TENDEROS',
        'COTIZACION_MAYORISTA',
        'PEDIDO_CONSOLIDADO',
        'ENTREGA_EN_CUADRANTE'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla relacional Comerciantes <-> Enjambres
CREATE TABLE IF NOT EXISTS enjambre_miembros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enjambre_id UUID REFERENCES enjambres_insumos(id) ON DELETE CASCADE,
    comerciante_id UUID REFERENCES comerciantes_rac2026(id) ON DELETE CASCADE,
    cantidad_solicitada INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(enjambre_id, comerciante_id)
);

-- 3. TABLA DE MONITOREO PASIVO MULTIPROVEEDOR (AMPARO DE EMERGENCIA)
-- AJUSTE 2: Ampliado a EMCALI, Celsia/EPSA, Gases de Occidente y Acueducto
CREATE TABLE IF NOT EXISTS tracking_servicios_publicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comerciante_id UUID REFERENCES comerciantes_rac2026(id) ON DELETE CASCADE,
    -- Operador del servicio público esencial
    operador_servicio VARCHAR(50) NOT NULL CHECK (operador_servicio IN (
        'EMCALI',
        'CELSIA_EPSA',
        'GASES_OCCIDENTE',
        'ACUEDUCTO'
    )),
    cuenta_contrato VARCHAR(50),
    consumo_base NUMERIC(10,2) DEFAULT 0.00,
    consumo_actual NUMERIC(10,2) DEFAULT 0.00,
    unidad_medida VARCHAR(20) DEFAULT 'kWh', -- kWh para energía, m3 para agua/gas
    porcentaje_reapertura NUMERIC(5,2) DEFAULT 0.00,
    amparo_emergencia_activo BOOLEAN DEFAULT TRUE,
    ultima_confirmacion_wa TIMESTAMP WITH TIME ZONE,
    estado_comercio VARCHAR(50) DEFAULT 'ACTIVO_EN_RECUPERACION' CHECK (estado_comercio IN (
        'CERRADO_POR_EMERGENCIA',
        'REAPERTURA_PARCIAL',
        'ACTIVO_EN_RECUPERACION',
        'TOTALMENTE_OPERATIVO'
    )),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE HISTORIAL DE MENSAJES Y TELEMETRÍA DE WHATSAPP
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE CONTACTOS WHATSAPP (Sincronizada con el CRM)
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
    conversation_stage TEXT NOT NULL DEFAULT 'intake' CHECK (conversation_stage IN (
        'intake',
        'awaiting_consent',
        'triaged',
        'case_created',
        'human_handoff'
    )),
    current_route INT CHECK (current_route BETWEEN 1 AND 4),
    barrier_summary TEXT,
    assigned_entity TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA DE EXPEDIENTES RADICADOS RAC-2026
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

-- 7. TABLA DE INSTANCIAS DE WHATSAPP
CREATE TABLE IF NOT EXISTS whatsapp_instances (
    id SERIAL PRIMARY KEY,
    instance_name TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL DEFAULT 'close',
    phone_number TEXT,
    connected_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. POLÍTICAS RLS (Row Level Security)
ALTER TABLE comerciantes_rac2026 ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rac_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_servicios_publicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE enjambres_insumos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso a Edge Functions con Service Role" 
ON comerciantes_rac2026 FOR ALL USING (true) WITH CHECK (true);
```

---

## 5. System Prompt del Agente de IA Multimodal (Texto, Audio, Imagen)

El siguiente es el System Prompt maestro configurado en `supabase/functions/evolution-webhook/prompt.ts` y consumido a través de OpenRouter (`google/gemini-2.5-flash`):

```text
SYSTEM PROMPT: ASISTENTE VIRTUAL RUTA ABIERTA CALI — EQUIPO EXPERT 360

[IDENTIDAD Y ROL]
Eres "Ruta Abierta Cali", el asistente oficial inteligente de la Alcaldía de Santiago de Cali, la Cámara de Comercio de Cali (CCC) y Comfandi para la reactivación económica inmediata de tenderos y microempresarios tras la emergencia.

[INSTRUCCIÓN DE ATENCIÓN Y SLA]
Infórmale al usuario que puede enviar su solicitud con un solo mensaje o nota de voz a su propio ritmo y sin formularios. La IA procesa la información e influye el Expediente Único (RAC-2026) de forma inmediata, asignándolo a la entidad correspondiente con un SLA transparente de atención de 24 a 48 horas hábiles.
NUNCA prometas que la solicitud o el auxilio económico se resuelve en 60 segundos. Lo que ocurre de forma inmediata es el procesamiento inteligente y la radicación del Expediente Único RAC-2026.

[PLANTILLA DE BIENVENIDA EN WHATSAPP (PRIMER CONTACTO)]
Cuando el usuario saluda o inicia la interacción, responde con esta estructura exacta:
"¡Hola! Bienvenido a Ruta Abierta Cali 🌿.
Cuéntanos qué necesita tu negocio en una sola nota de voz o mensaje, tómate el tiempo que necesites y sin llenar formularios.
🛡️ Habeas Data (Ley 1581): Tus datos están protegidos y NO se comparten con la DIAN ni entes de fiscalización."

[TONO Y LENGUAJE]
- Hablas en español vallecaucano/caleño cálido, respetuoso, directo, coloquial y muy empático.
- Tratas con respeto ("Doña María", "Don Carlos", "Estimado Comerciante").
- Haces una sola pregunta por turno para no abrumar al comerciante.
- CERO jerga técnica, CERO burocracia, CERO explicaciones largas.
- NUNCA exijas RUT, NIT, cámara de comercio al día ni estados de cuenta.

[REGLA INQUEBRANTABLE — LEY 1581 HABEAS DATA]
Antes de crear cualquier expediente oficial, DEBES solicitar la autorización expresa:
"Tus datos están protegidos bajo la Ley 1581 (Habeas Data). Se usan EXCLUSIVAMENTE para entregarte alivios y ayudas de reactivación. NUNCA se comparten con la DIAN ni para cobros de impuestos. ¿Autorizas el tratamiento de tus datos?"

[PROCESAMIENTO MULTIMODAL]
1. Si el usuario envía una NOTA DE VOZ (Audio):
   - Escucha y extrae la necesidad principal (falta de liquidez, insumos caros, máquina dañada o pérdida de clientes).
2. Si el usuario envía una IMAGEN (Foto):
   - Identifica el tipo de foto (local afectado, factura de proveedor, máquina averiada, cédula o letrero) y confirma su recepción con empatía.
3. Si el usuario envía TEXTO:
   - Responde directamente al punto en menos de 2 a 3 oraciones.

[MATRIZ DE TRIAJE Y RUTEO EN 4 RUTAS]
Clasifica la necesidad del usuario en UNA de las siguientes 4 rutas:
- RUTA 1 (LIQUIDEZ_ALCALDIA): Necesita efectivo, capital de trabajo, pagar arriendo o nómina vencida. (Conecta con Fondo Solidario $5.000M - Secretaría de Desarrollo Económico).
- RUTA 2 (MAQUINARIA_COMFANDI): Se le dañó una nevera, vitrina, horno, congelador o equipo de trabajo por sismo o corte eléctrico. (Conecta con Subsidios y Alivios de Comfandi).
- RUTA 3 (INSUMOS_ENJAMBRE_CCC): Insumos de panadería o abarrotes costosos (harina, aceite, azúcar, granos). (Conecta con Compras Colectivas en Enjambre - Descuentos mayoristas por volumen acordados).
- RUTA 4 (CLIENTES_VISIBILIDAD): Reubicado temporalmente, vía cerrada o necesidad de atraer clientes. (Conecta con Tarjeta Digital Geolocalizada - Sec. Desarrollo Económico y CCC).

[ESTADOS DEL PIPELINE CRM EN KANBAN]
Cada interacción avanza al comerciante en una de las 6 etapas oficiales:
1. NUEVO_REGISTRO: Primer mensaje recibido.
2. EN_TRIAJE_IA: Asistente diagnosticando la barrera y solicitando Ley 1581.
3. ASIGNADO_ENTIDAD: Ruta 1 a 4 definida según la necesidad.
4. EN_ATENCION_SLA: Expediente RAC-2026-XXXX emitido con compromiso de atención en 24h.
5. ENJAMBRE_ACTIVO: Comerciante integrado a cuadrante de compras colectivas.
6. ATENDIDO: Beneficio entregado o derivado a gestor territorial.
```

---

## 6. Lógica de Edge Functions en Supabase (Producción)

### 6.1. Webhook Multimodal con Simulación Humana (`evolution-webhook`)
1. **Detección Multimodal:** Identifica si el mensaje es de texto, nota de voz (`audioMessage`) o imagen (`imageMessage`).
2. **Descarga de Base64:** Obtiene el medio binario desde Evolution API (`POST /chat/getBase64FromMediaMessage/rutacali`).
3. **Inferencia con Gemini 2.5 Flash:** Envía el audio (`input_audio`) o la imagen (`image_url`) con JSON Schema estricto.
4. **Presencia Activa y Delay de 6s:**
   - Invoca `POST /chat/sendPresence/rutacali` marcando `recording` para audio o `composing` para texto.
   - Aplica una pausa activa de 6 segundos (`await new Promise(r => setTimeout(r, 6000))`) simulando mecanografía humana.
5. **Manejo de JIDs `@lid`:** Detecta y preserva el identificador móvil de WhatsApp para prevenir errores 400.
6. **Envío y Registro:** Entrega la respuesta estructurada vía `sendText` y registra la telemetría en `whatsapp_messages`.

### 6.2. Función Administrativa y CRM (`evolution-admin`)
- `action: 'status'`: Consulta el estado de conexión del bot.
- `action: 'connect'`: Genera el código QR para vinculación de dispositivo.
- `action: 'crm-pipeline'`: Retorna los contactos clasificados en las 6 etapas del pipeline, con su último mensaje y expediente.
- `action: 'get-chat-messages'`: Obtiene el historial cronológico completo de la conversación para el visor de chat.
- `action: 'update-contact-stage'`: Permite al funcionario mover de etapa a cualquier comerciante.
- `action: 'send-manual-message'`: Envía un mensaje directo de WhatsApp desde la plataforma como agente humano.

---

## 7. Tablero CRM & Pipeline Kanban en el Frontend

El CRM se despliega al hacer **clic sobre la imagen / recuadro del código QR** en la pestaña de WhatsApp:

### 7.1. Las 6 Columnas Oficiales del Pipeline
1. **📥 1. Nuevo Registro:** Primer contacto o saludo inicial.
2. **⚖️ 2. En Triaje IA:** Diagnóstico del negocio y validación de Ley 1581 de 2012.
3. **🎯 3. Asignado a Entidad:** Ruta definida (Alcaldía, CCC o Comfandi).
4. **⏱️ 4. En Atención SLA (24h):** Expediente oficial emitido `RAC-2026-XXXX`.
5. **🐝 5. Enjambre Activo:** Comerciante agrupado en compras colectivas mayoristas.
6. **🤝 6. Atendido:** Alivio entregado o caso canalizado exitosamente con gestor.

### 7.2. Características y Adaptabilidad Responsive
- **Buscador en Tiempo Real:** Filtra por nombre, teléfono, barrio, comuna o código de caso.
- **Selector de Etapa Rápido:** Permite mover tarjetas entre columnas mediante dropdown individual.
- **Consola de Chat en Vivo:** Visualizador de mensajes entrantes/salientes con badges para notas de voz e imágenes y formulario de envío manual.
- **Adaptabilidad Móvil y Tablet:**
  - Pestañas superiores (*Tabs móviles*) para alternar entre etapas con un solo toque táctil.
  - Carrusel horizontal con inercia suave (`snap-mandatory`) que evita desbordamientos.
  - Modal de chat a pantalla completa (`100dvh`) con fuentes de 16px para evitar auto-zoom en iOS Safari.
  - Botón `← Volver a QR` para regresar a la vista de vinculación en cualquier momento.

---

## 8. Sincronización Dual con Google Sheets (Auditoría Pública)

Para que los funcionarios de la Secretaría de Desarrollo Económico, CCC y Comfandi consulten las solicitudes en una interfaz tabular sin acceder a la base de datos de Supabase, se mantiene una hoja de Google Sheets sincronizada mediante Google Apps Script:

```javascript
// GOOGLE APPS SCRIPT — SINCRONIZACIÓN RUTA ABIERTA CALI
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Comerciantes_RAC2026");
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Comerciantes_RAC2026");
      sheet.appendRow([
        "Expediente", "Fecha/Hora", "WhatsApp", "Comerciante", 
        "Barrio/Comuna", "Ruta Asignada", "Estado Pipeline", "Operador Servicios", "Resumen Necesidad"
      ]);
    }
    
    sheet.appendRow([
      data.expediente_id || "RAC-2026-PENDIENTE",
      new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      data.whatsapp_num,
      data.nombre_comerciante || "Comerciante Popular",
      data.barrio_comuna || "Comuna 19",
      data.ruta_asignada || "INSUMOS_ENJAMBRE_CCC",
      data.estado_pipeline || "EN_ATENCION_SLA",
      data.operador_servicio || "EMCALI",
      data.resumen_solicitud || "Solicitud de reactivación comercial"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "SUCCESS"})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "ERROR", "message": err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 9. Procedimiento de Despliegue y Mantenimiento

### Actualización en Servidor VPS (Hostinger)
```bash
ssh -i ~/.ssh/braysa_hostinger_ed25519 root@2.25.221.151
cd /opt/rutacali
git pull origin main
docker compose -f compose.hostinger.yaml up -d --build
```

### Despliegue de Edge Functions en Supabase
```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."
npx supabase functions deploy evolution-webhook --project-ref zfldlzsozlesecbtyltk --no-verify-jwt
npx supabase functions deploy evolution-admin --project-ref zfldlzsozlesecbtyltk --no-verify-jwt
```
