# Ruta Abierta Cali

## Estado del documento

Documento técnico vivo del proyecto desplegable en `rutacali.xorbit360.com`.

La fuente `especifiacionestecnicas..md` continúa vacía (0 bytes), por lo que este documento se construyó a partir del código actual del repositorio y de los requisitos indicados en la conversación. Debe revisarse cuando las especificaciones completas estén disponibles.

## Propósito

Ruta Abierta Cali es una plataforma GovTech para orientar a comerciantes populares de Santiago de Cali mediante WhatsApp y una interfaz web. El sistema recibe solicitudes en lenguaje natural, identifica la barrera principal, asigna una ruta institucional y conserva trazabilidad del caso.

Objetivos principales:

- Brindar una entrada accesible por WhatsApp, texto y notas de voz.
- Realizar un triaje breve sin exigir RUT, DIAN ni formularios extensos.
- Obtener consentimiento para tratamiento de datos conforme a la Ley 1581 de 2012.
- Dirigir cada caso hacia la entidad responsable.
- Crear un expediente RAC y registrar mensajes y estados.
- Permitir a un administrador vincular el número de WhatsApp mediante código QR.

## Proyecto Supabase

- Proyecto exclusivo: `zfldlzsozlesecbtyltk`.
- URL: `https://zfldlzsozlesecbtyltk.supabase.co`.
- Uso: PostgreSQL, Row Level Security y Edge Functions.
- El proyecto es independiente de cualquier otro proyecto Supabase disponible en la cuenta local.
- El frontend usa únicamente una clave publicable mediante variables `VITE_*`.
- Las claves `secret` y `service_role` no deben incluirse en el código, frontend, documentación ni repositorio.

## Arquitectura

```text
Comerciante
    |
    v
WhatsApp
    |
    v
Evolution API
    |
    +--> evolution-webhook (Supabase Edge Function)
            |
            +--> Gemini: clasificación y respuesta
            +--> PostgreSQL: historial de mensajes
            +--> Evolution API: envío de respuesta

Administrador web
    |
    +--> Menú Conectar WhatsApp
            |
            +--> evolution-admin (Supabase Edge Function)
                    |
                    +--> Crear instancia
                    +--> Obtener QR
                    +--> Consultar estado
                    +--> Desconectar sesión
```

## Componentes

### Frontend

- React 19, TypeScript, Vite y Tailwind CSS.
- Menú administrativo `Conectar WhatsApp`.
- Visualización del QR y estado de conexión.
- Pantallas existentes para Alcaldía, Cámara de Comercio, Comfandi, interoperabilidad y flujo del comerciante.
- Configuración pública cargada desde `.env.local`.

### Supabase Edge Functions

`evolution-admin`:

- Protegida por `EVOLUTION_ADMIN_TOKEN`.
- Crea o consulta la instancia de Evolution API.
- Devuelve el QR al frontend.
- Permite consultar estado y cerrar la sesión vinculada.

`evolution-webhook`:

- Valida `EVOLUTION_WEBHOOK_SECRET`.
- Ignora mensajes enviados por el propio bot.
- Evita duplicados por identificador de mensaje.
- Persiste mensajes entrantes y salientes.
- Envía el contexto reciente a Gemini.
- Responde al comerciante mediante Evolution API.

### Base de datos

Tablas iniciales:

- `whatsapp_instances`: estado de la instancia vinculada.
- `whatsapp_messages`: mensajes entrantes, salientes y payload original.

Ambas tablas tienen RLS habilitado y no conceden acceso directo a `anon` ni `authenticated`. Las operaciones privilegiadas se realizan desde Edge Functions.

## Rutas de atención

1. Liquidez y Fondo Solidario: arriendo, nómina, deudas y falta de capital. Entidad: Secretaría de Desarrollo Económico.
2. Maquinaria e Infraestructura: daños, adecuaciones, energía y herramientas. Entidad: Comfandi.
3. Compras Colectivas: insumos costosos y compras por volumen. Entidad: Cámara de Comercio de Cali.
4. Clientes y Visibilidad: reubicación, vías cerradas, comercialización y caída de ventas. Entidades: Secretaría de Desarrollo Económico y Cámara de Comercio de Cali.

## Reglas del bot

- Hablar en español colombiano, con tono cálido, claro y breve.
- Hacer una sola pregunta por turno.
- No inventar aprobaciones, montos, subsidios ni beneficios.
- Solicitar consentimiento expreso antes de crear un expediente.
- No pedir información sensible que no sea necesaria.
- Indicar la entidad responsable y el siguiente paso.
- Informar que es un asistente automatizado cuando sea relevante.

El prompt operativo se encuentra en `supabase/functions/evolution-webhook/prompt.ts`.

## Variables de entorno

Frontend, valores públicos:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Supabase Edge Function Secrets, valores privados:

```text
EVOLUTION_API_URL
EVOLUTION_API_KEY
EVOLUTION_INSTANCE_NAME
EVOLUTION_PHONE_NUMBER
EVOLUTION_ADMIN_TOKEN
EVOLUTION_WEBHOOK_SECRET
OPENROUTER_API_KEY
OPENROUTER_MODEL
```

Los secretos privados deben configurarse en Supabase Dashboard o mediante Supabase CLI y nunca confirmarse en Git.

## Despliegue previsto

1. Autenticar Supabase CLI o MCP con una cuenta que tenga acceso al proyecto `zfldlzsozlesecbtyltk`.
2. Vincular el repositorio al proyecto correcto.
3. Aplicar la migración de `supabase/migrations`.
4. Configurar los secretos de las funciones.
5. Desplegar `evolution-admin` y `evolution-webhook`.
6. Compilar el frontend con `npm run build`.
7. Publicar `dist/` en el servidor asociado a `rutacali.xorbit360.com`.
8. Abrir `Conectar WhatsApp`, generar el QR y vincular el dispositivo.
9. Enviar un mensaje real y comprobar entrada, respuesta y persistencia.

Supabase aloja la base de datos y las funciones. El frontend de `rutacali.xorbit360.com` debe alojarse en el VPS o servicio web al que apunta el subdominio.

### Ejecución en VPS con Docker

En el VPS se debe crear un archivo `.env` no versionado con los dos valores públicos del frontend y ejecutar:

```bash
docker compose up -d --build
```

El contenedor escucha únicamente en `127.0.0.1:3000`. Nginx o Caddy debe publicar `rutacali.xorbit360.com`, terminar TLS y enviar el tráfico a ese puerto. El endpoint de salud es `/health`.

## Estado actual

- Repositorio descargado y configurado localmente.
- Frontend enlazado al proyecto Supabase correcto mediante configuración pública local.
- Pantalla de conexión WhatsApp implementada.
- Proyecto remoto verificado: `https://zfldlzsozlesecbtyltk.supabase.co`.
- Tres migraciones aplicadas y registradas en Supabase: backend WhatsApp, automatización OpenRouter y cierre de permisos sobre la función privilegiada de RLS.
- Cinco tablas privadas desplegadas con RLS: `whatsapp_instances`, `whatsapp_messages`, `whatsapp_contacts`, `rac_cases` y `automation_events`.
- Funciones Edge `evolution-admin` y `evolution-webhook` desplegadas y activas con autenticación personalizada; ambas rechazan solicitudes sin credenciales.
- Prompt inicial del bot implementado.
- OpenRouter configurado con salida JSON estructurada y modelo económico intercambiable.
- Automatizaciones limitadas para perfil, consentimiento, triaje, expediente y entrega humana.
- Sincronización del panel web con expedientes reales creados por WhatsApp, protegida por la clave administrativa.
- Número previsto para la instancia de Evolution API: `+57 313 859 0373`.
- Compilación Vite y verificación TypeScript aprobadas.
- Imagen Docker y composición para VPS preparadas.
- Plantilla de verificación automática para GitHub Actions disponible en `deployment/github-actions-ci.yml.example`; debe activarse cuando el token tenga permiso `Workflows: write`.
- Acceso de escritura a `xorbit360/rutacali` verificado mediante autenticación OAuth de GitHub.
- Evolution API pendiente de URL y API key operativas; sin esos datos no se puede emitir un QR real.
- Secretos pendientes en Supabase: OpenRouter, Evolution, clave administrativa y firma del webhook.
- VPS pendiente de publicación de la aplicación, proxy HTTPS y certificado válido para `rutacali.xorbit360.com`.
- Especificaciones técnicas externas pendientes porque el archivo fuente está vacío.

## Criterios de aceptación

- El administrador puede generar y ver un QR sin exponer la API key de Evolution.
- El estado cambia a conectado después de escanear el QR.
- Un mensaje real genera una sola fila entrante y una sola respuesta saliente.
- El bot conserva contexto reciente sin mezclar conversaciones entre teléfonos.
- Ningún secreto aparece en el bundle del navegador ni en Git.
- Las tablas expuestas mantienen RLS habilitado.
- Los errores de Evolution, Gemini o Supabase quedan registrados y no producen respuestas duplicadas.
