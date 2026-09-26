import { ComercianteRow, EnjambreRow, TrackingEmcaliRow } from '../types/sheets';

export const INITIAL_COMERCIANTES_SHEET: ComercianteRow[] = [
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

export const INITIAL_ENJAMBRES_SHEET: EnjambreRow[] = [
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

export const INITIAL_TRACKING_EMCALI_SHEET: TrackingEmcaliRow[] = [
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

export const INITIAL_ENTIDADES_SLA_SHEET = [
  {
    ID_Expediente: 'RAC-2026-0418',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Rol_Institucional: 'Compras Colectivas en Enjambre (18% Ahorro Insumos)',
    Tiempo_Respuesta_SLA: '12h (Meta: 24h)',
    Estado_Atencion: 'Enjambre Consolidado',
    Accion_Requerida: 'Despacho Camión Mayorista CAVASA'
  },
  {
    ID_Expediente: 'RAC-2026-0419',
    Entidad_Encargada: 'Cámara de Comercio de Cali (CCC)',
    Rol_Institucional: 'Agregación de Demanda Corredor San Fernando',
    Tiempo_Respuesta_SLA: '18h (Meta: 48h)',
    Estado_Atencion: 'Asignado a Cluster Harinas',
    Accion_Requerida: 'Confirmación Flete Compartido'
  },
  {
    ID_Expediente: 'RAC-2026-0423',
    Entidad_Encargada: 'Comfandi (Caja de Compensación)',
    Rol_Institucional: 'Subsidio Reposición Maquinaria & Crédito Emergencia',
    Tiempo_Respuesta_SLA: '14h (Meta: 36h)',
    Estado_Atencion: 'Pre-Aprobado (0.6% mes)',
    Accion_Requerida: 'Giro Proveedor Maquinaria Panadería'
  },
  {
    ID_Expediente: 'RAC-2026-0424',
    Entidad_Encargada: 'Secretaría de Desarrollo Económico (Alcaldía)',
    Rol_Institucional: 'Fondo Solidario $5.000M - Subsidio Liquidez Nómina',
    Tiempo_Respuesta_SLA: '6h (Meta: 24h)',
    Estado_Atencion: 'Desembolso Aprobado',
    Accion_Requerida: 'Transferencia $5.000.000 COP Efectuada'
  },
  {
    ID_Expediente: 'RAC-2026-0425',
    Entidad_Encargada: 'Secretaría de Desarrollo Económico (Alcaldía)',
    Rol_Institucional: 'Fondo Solidario $5.000M - Alivio Arriendo Comercial',
    Tiempo_Respuesta_SLA: '8h (Meta: 24h)',
    Estado_Atencion: 'En Verificación 1-Clic',
    Accion_Requerida: 'Validar Cuenta de Arrendador'
  }
];
