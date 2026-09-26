import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ruta-abierta-cali' });
});

// Initial Google Sheets Central Database (EXPERT 360)
let COMERCIANTES_SHEET = [
  {
    ID_Expediente: 'RAC-2026-0418',
    Fecha_Hora: '2026-09-25 10:32:00',
    Nombre_Comerciante: 'Doña María - Tienda San Fernando',
    Barrio_Comuna: 'San Fernando - Comuna 19',
    Telefono_WhatsApp: '+57 315 489 2011',
    Ruta_Asignada: 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)',
    Estado_SLA: 'Atención Prioritaria (SLA: 24h)',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  },
  {
    ID_Expediente: 'RAC-2026-0419',
    Fecha_Hora: '2026-09-25 09:15:20',
    Nombre_Comerciante: 'Don Carlos - Tienda La Esquina',
    Barrio_Comuna: 'San Fernando - Comuna 19',
    Telefono_WhatsApp: '+57 312 901 4455',
    Ruta_Asignada: 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)',
    Estado_SLA: 'En Proceso (SLA: 48h)',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  },
  {
    ID_Expediente: 'RAC-2026-0420',
    Fecha_Hora: '2026-09-25 08:44:11',
    Nombre_Comerciante: 'Doña Elena - Mini-Market Sol',
    Barrio_Comuna: 'San Fernando - Comuna 19',
    Telefono_WhatsApp: '+57 318 662 9081',
    Ruta_Asignada: 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)',
    Estado_SLA: 'En Proceso (SLA: 48h)',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  },
  {
    ID_Expediente: 'RAC-2026-0421',
    Fecha_Hora: '2026-09-24 16:20:00',
    Nombre_Comerciante: 'Tienda Los Almendros',
    Barrio_Comuna: 'San Fernando - Comuna 19',
    Telefono_WhatsApp: '+57 311 773 1902',
    Ruta_Asignada: 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)',
    Estado_SLA: 'Confirmado Proveedor',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  },
  {
    ID_Expediente: 'RAC-2026-0422',
    Fecha_Hora: '2026-09-24 14:10:05',
    Nombre_Comerciante: 'Abarrotes El Buen Vecino',
    Barrio_Comuna: 'San Fernando - Comuna 19',
    Telefono_WhatsApp: '+57 310 882 3412',
    Ruta_Asignada: 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)',
    Estado_SLA: 'Confirmado Proveedor',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  },
  {
    ID_Expediente: 'RAC-2026-0423',
    Fecha_Hora: '2026-09-24 11:30:40',
    Nombre_Comerciante: 'Taller Calzado San Bosco',
    Barrio_Comuna: 'San Bosco - Comuna 3',
    Telefono_WhatsApp: '+57 314 559 1209',
    Ruta_Asignada: 'Ruta 2: Maquinaria e Infraestructura',
    Estado_SLA: 'En Revisión Técnica',
    Entidad_Encargada: 'Comfandi',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  },
  {
    ID_Expediente: 'RAC-2026-0424',
    Fecha_Hora: '2026-09-24 09:05:18',
    Nombre_Comerciante: 'Confecciones La Sultana',
    Barrio_Comuna: 'El Troncal - Comuna 8',
    Telefono_WhatsApp: '+57 316 443 8970',
    Ruta_Asignada: 'Ruta 1: Liquidez y Fondo Solidario',
    Estado_SLA: 'Aprobado Desembolso',
    Entidad_Encargada: 'Secretaría de Desarrollo Económico',
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  }
];

let ENJAMBRES_SHEET = [
  {
    ID_Enjambre: 'ENJ-C19-001',
    Cuadrante_Zona: 'Comuna 19 - San Fernando / Alameda',
    Insumo_Requerido: 'Harina (3T) + Aceite (1.5T) + Granos (2T)',
    Cantidad_Total: '6.5 Toneladas',
    Tenderos_Agrupados: '4 (Doña María, Don Carlos, Doña Elena, Los Almendros)',
    Descuento_Logrado: '18% Descuento Directo',
    Mayorista_Asignado: 'Molinos Harinera del Valle & CAVASA',
    Estado_Entrega: 'Confirmado: Listo para Proveedor'
  },
  {
    ID_Enjambre: 'ENJ-C3-002',
    Cuadrante_Zona: 'Comuna 3 - San Nicolás Ferretero',
    Insumo_Requerido: 'Cemento Gris (8T) + Perfilería Metálica',
    Cantidad_Total: '11.0 Toneladas',
    Tenderos_Agrupados: '5 Ferreteros',
    Descuento_Logrado: '22% Descuento Directo',
    Mayorista_Asignado: 'Distribuidora Siderúrgica de Occidente',
    Estado_Entrega: 'En Consolidación de Pedido'
  },
  {
    ID_Enjambre: 'ENJ-C9-003',
    Cuadrante_Zona: 'Comuna 9 - Galería Alameda',
    Insumo_Requerido: 'Abarrotes Básicos, Azúcar y Granos',
    Cantidad_Total: '4.2 Toneladas',
    Tenderos_Agrupados: '6 Puestos de Galería',
    Descuento_Logrado: '15% Descuento CAVASA',
    Mayorista_Asignado: 'Central Mayorista CAVASA',
    Estado_Entrega: 'Despacho Programado'
  }
];

let TRACKING_EMCALI_SHEET = [
  {
    ID_Expediente: 'RAC-2026-0418',
    Cuenta_EMCALI: 'EE-994821-Cali',
    Consumo_kWh_Base: 420,
    Consumo_kWh_Actual: 315,
    Porcentaje_Reapertura: '75%',
    Ultima_Confirmacion_WA: 'Confirmado 1-Clic (Día 15)'
  },
  {
    ID_Expediente: 'RAC-2026-0419',
    Cuenta_EMCALI: 'EE-332145-Cali',
    Consumo_kWh_Base: 310,
    Consumo_kWh_Actual: 210,
    Porcentaje_Reapertura: '68%',
    Ultima_Confirmacion_WA: 'Confirmado 1-Clic (Día 15)'
  },
  {
    ID_Expediente: 'RAC-2026-0420',
    Cuenta_EMCALI: 'EE-774120-Cali',
    Consumo_kWh_Base: 280,
    Consumo_kWh_Actual: 220,
    Porcentaje_Reapertura: '78%',
    Ultima_Confirmacion_WA: 'Confirmado 1-Clic (Día 15)'
  },
  {
    ID_Expediente: 'RAC-2026-0421',
    Cuenta_EMCALI: 'EE-118942-Cali',
    Consumo_kWh_Base: 550,
    Consumo_kWh_Actual: 460,
    Porcentaje_Reapertura: '84%',
    Ultima_Confirmacion_WA: 'Confirmado 1-Clic (Día 30)'
  },
  {
    ID_Expediente: 'RAC-2026-0422',
    Cuenta_EMCALI: 'EE-881290-Cali',
    Consumo_kWh_Base: 140,
    Consumo_kWh_Actual: 98,
    Porcentaje_Reapertura: '70%',
    Ultima_Confirmacion_WA: 'Confirmado 1-Clic (Día 15)'
  },
  {
    ID_Expediente: 'RAC-2026-0423',
    Cuenta_EMCALI: 'EE-551920-Cali',
    Consumo_kWh_Base: 260,
    Consumo_kWh_Actual: 110,
    Porcentaje_Reapertura: '42%',
    Ultima_Confirmacion_WA: 'Pendiente Respuesta WA'
  },
  {
    ID_Expediente: 'RAC-2026-0424',
    Cuenta_EMCALI: 'EE-449182-Cali',
    Consumo_kWh_Base: 390,
    Consumo_kWh_Actual: 330,
    Porcentaje_Reapertura: '85%',
    Ultima_Confirmacion_WA: 'Confirmado 1-Clic (Día 30)'
  }
];

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Google Sheets API Simulator Endpoints
app.get('/api/sheets/all', (_req: Request, res: Response) => {
  res.json({
    comerciantes: COMERCIANTES_SHEET,
    enjambres: ENJAMBRES_SHEET,
    trackingEmcali: TRACKING_EMCALI_SHEET
  });
});

app.get('/api/sheets/comerciantes', (_req: Request, res: Response) => {
  res.json(COMERCIANTES_SHEET);
});

app.post('/api/sheets/comerciantes', (req: Request, res: Response) => {
  const row = req.body;
  COMERCIANTES_SHEET.unshift(row);
  res.status(201).json({ success: true, row });
});

app.get('/api/sheets/enjambres', (_req: Request, res: Response) => {
  res.json(ENJAMBRES_SHEET);
});

app.get('/api/sheets/tracking-emcali', (_req: Request, res: Response) => {
  res.json(TRACKING_EMCALI_SHEET);
});

// Webhook for WhatsApp incoming payload (Twilio / WATI / Apps Script connector)
app.post('/api/webhook/whatsapp', async (req: Request, res: Response) => {
  const { From, Body, AudioTranscription } = req.body;
  const text = AudioTranscription || Body || 'Se cayeron las ventas y la harina está cara';

  const nextNum = COMERCIANTES_SHEET.length + 418 + 1;
  const newId = `RAC-2026-${String(nextNum).padStart(4, '0')}`;
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

  let ruta = 'Ruta 3: Compras Colectivas en Enjambre (18% Descuento)';
  let entidad = 'Cámara de Comercio de Cali (CCC)';

  if (text.toLowerCase().includes('arriendo') || text.toLowerCase().includes('nomina') || text.toLowerCase().includes('plata')) {
    ruta = 'Ruta 1: Liquidez y Fondo Solidario';
    entidad = 'Secretaría de Desarrollo Económico';
  } else if (text.toLowerCase().includes('horno') || text.toLowerCase().includes('maquina') || text.toLowerCase().includes('daño')) {
    ruta = 'Ruta 2: Maquinaria e Infraestructura';
    entidad = 'Comfandi';
  } else if (text.toLowerCase().includes('via') || text.toLowerCase().includes('cerrada') || text.toLowerCase().includes('reubicar')) {
    ruta = 'Ruta 4: Clientes y Visibilidad';
    entidad = 'Secretaría de Desarrollo Económico';
  }

  const newRow = {
    ID_Expediente: newId,
    Fecha_Hora: formattedDate,
    Nombre_Comerciante: 'Comerciante Ingreso WA',
    Barrio_Comuna: 'San Fernando - Comuna 19',
    Telefono_WhatsApp: From || '+57 315 000 0000',
    Ruta_Asignada: ruta,
    Estado_SLA: 'Atención Prioritaria (SLA: 24h)',
    Entidad_Encargada: entidad,
    Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
  };

  COMERCIANTES_SHEET.unshift(newRow);

  res.json({
    message: 'Webhook recibido e insertado automáticamente en Google Sheets central',
    row: newRow
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ruta Abierta Cali] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
