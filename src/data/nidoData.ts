import { ComercianteNido, ColectivaEnjambre, ExpedienteRAC, FondoSolidarioInfo } from '../types/govtech';

export const INITIAL_NIDO_DATASET: ComercianteNido[] = [
  {
    id_nido: 'NIT-31842099',
    nombre: 'Rosa Elena Pérez',
    negocio: 'Panadería La Espiga',
    comuna: 19,
    barrio: 'San Fernando',
    direccion: 'Carrera 34 # 4B-18',
    categoria: 'Panadería / Alimentos',
    antiguedad_anos: 14,
    formal: true,
    cuenta_emcali: 'EE-994821-Cali',
    consumo_kwh_base: 420,
    consumo_kwh_actual: 45,
    telefono: '+57 315 489 2011'
  },
  {
    id_nido: 'NIT-16789012',
    nombre: 'Carlos Mario Orozco',
    negocio: 'Ferretería El Tornillo Dorado',
    comuna: 3,
    barrio: 'San Nicolás',
    direccion: 'Calle 18 # 5-42',
    categoria: 'Ferretería / Construcción',
    antiguedad_anos: 22,
    formal: true,
    cuenta_emcali: 'EE-332145-Cali',
    consumo_kwh_base: 310,
    consumo_kwh_actual: 28,
    telefono: '+57 312 901 4455'
  },
  {
    id_nido: 'CC-66912304',
    nombre: 'Sandra Patricia Caicedo',
    negocio: 'Confecciones La Sultana',
    comuna: 8,
    barrio: 'El Troncal',
    direccion: 'Carrera 11B # 44-30',
    categoria: 'Textiles / Modistería',
    antiguedad_anos: 8,
    formal: true,
    cuenta_emcali: 'EE-774120-Cali',
    consumo_kwh_base: 280,
    consumo_kwh_actual: 30,
    telefono: '+57 318 662 9081'
  },
  {
    id_nido: 'NIT-90054123',
    nombre: 'Efraín Mina Mosquera',
    negocio: 'Restaurante Sabor Caleño',
    comuna: 9,
    barrio: 'Alameda',
    direccion: 'Calle 8 # 26-14',
    categoria: 'Gastronomía Tradicional',
    antiguedad_anos: 11,
    formal: true,
    cuenta_emcali: 'EE-118942-Cali',
    consumo_kwh_base: 550,
    consumo_kwh_actual: 60,
    telefono: '+57 311 773 1902'
  },
  {
    id_nido: 'CC-31445981',
    nombre: 'Luz Dary Mosquera',
    negocio: 'Frutería El Chontaduro de Oro',
    comuna: 20,
    barrio: 'Siloé (Estación Cañaveralejo)',
    direccion: 'Calle 1ra Oeste # 52-10',
    categoria: 'Economía Popular / Frutas',
    antiguedad_anos: 6,
    formal: false,
    cuenta_emcali: 'EE-881290-Cali',
    consumo_kwh_base: 140,
    consumo_kwh_actual: 15,
    telefono: '+57 316 554 9901'
  },
  {
    id_nido: 'CC-14882190',
    nombre: 'Gustavo Adolfo Buitrago',
    negocio: 'Taller Calzado San Bosco',
    comuna: 3,
    barrio: 'San Bosco',
    direccion: 'Carrera 12 # 9-65',
    categoria: 'Calzado / Marroquinería',
    antiguedad_anos: 18,
    formal: true,
    cuenta_emcali: 'EE-551920-Cali',
    consumo_kwh_base: 260,
    consumo_kwh_actual: 190,
    telefono: '+57 310 882 3412'
  }
];

export const INITIAL_COLECTIVAS: ColectivaEnjambre[] = [
  {
    id: 'CORREDOR_SAN_FERNANDO_C19',
    nombre: 'Ruta Colectiva Panaderías de San Fernando',
    comuna: 19,
    barrio: 'San Fernando',
    rubro: 'Insumos de Panadería (Harina de Trigo, Levadura, Manteca)',
    comerciantes_agrupados: 13,
    ahorro_pactado: '18% Ahorro Mayorista + Flete Compartido',
    entidad_responsable: 'CAMARA_COMERCIO_CALI',
    proveedor_colectivo: 'Molino Valle del Cauca S.A. & Harinera del Valle',
    estado: 'ACTIVA_DESPACHANDO',
    fecha_proximo_despacho: '2026-09-27'
  },
  {
    id: 'CORREDOR_SAN_NICOLAS_C3',
    nombre: 'Ruta Colectiva Ferreterías y Materiales San Nicolás',
    comuna: 3,
    barrio: 'San Nicolás',
    rubro: 'Materiales Básicos de Reconstrucción (Cemento, Perfilería, Tejas)',
    comerciantes_agrupados: 19,
    ahorro_pactado: '22% Ahorro Mayorista + Grúa Compartida',
    entidad_responsable: 'CAMARA_COMERCIO_CALI',
    proveedor_colectivo: 'Distribuidora Siderúrgica de Occidente',
    estado: 'CONSOLIDANDO_PEDIDO',
    fecha_proximo_despacho: '2026-09-28'
  },
  {
    id: 'CORREDOR_ALAMEDA_C9',
    nombre: 'Ruta Colectiva Gastronomía Alameda',
    comuna: 9,
    barrio: 'Alameda',
    rubro: 'Cadenas de Frío y Abarrotes Mayoristas (Aceites, Carnes, Granos)',
    comerciantes_agrupados: 24,
    ahorro_pactado: '15% Descuento Directo CAVASA',
    entidad_responsable: 'CAMARA_COMERCIO_CALI',
    proveedor_colectivo: 'Central Mayorista CAVASA',
    estado: 'ACTIVA_DESPACHANDO',
    fecha_proximo_despacho: '2026-09-26'
  },
  {
    id: 'CORREDOR_GRANADA_C2',
    nombre: 'Ruta Colectiva Gastronomía Granada / Peñón',
    comuna: 2,
    barrio: 'Granada',
    rubro: 'Plantas Eléctricas Temporales y Suministros',
    comerciantes_agrupados: 16,
    ahorro_pactado: 'Tarifa Especial Diésel + Alquiler Generador CCC',
    entidad_responsable: 'CAMARA_COMERCIO_CALI',
    proveedor_colectivo: 'Energía Alternativa del Valle',
    estado: 'EN_EVALUACION',
    fecha_proximo_despacho: '2026-09-29'
  }
];

export const INITIAL_EXPEDIENTES: ExpedienteRAC[] = [
  {
    codigo: 'RAC-2026-0418',
    fecha_registro: '2026-09-25T19:24:00Z',
    comerciante: {
      id_nido: 'NIT-31842099',
      nombre: 'Rosa Elena Pérez',
      negocio: 'Panadería La Espiga',
      comuna: 19,
      barrio: 'San Fernando',
      direccion: 'Carrera 34 # 4B-18',
      formal: true
    },
    triaje: {
      barrera_principal: 'INSUMOS_MATERIA_PRIMA',
      descripcion: 'Se me dañó el horno y la harina está muy cara.',
      metodo_registro: 'WHATSAPP_VOICE_NOTE',
      habeas_data_autorizado: true
    },
    ruta_asignada: {
      tipo_ruta: 'RUTA_COLECTIVA_ENJAMBRE',
      corredor_comercial: 'CORREDOR_SAN_FERNANDO_C19',
      entidad_responsable: 'CAMARA_COMERCIO_CALI',
      beneficio_colectivo: '18% Ahorro Insumos + Flete Compartido',
      estado_tramite: 'DESPACHO_PROGRAMADO'
    },
    verificacion_pasiva: {
      metodo: 'EMCALI_CONSUMO_KWH',
      cuenta_contrato_emcali: 'EE-994821-Cali',
      kwh_base: 420,
      kwh_actual: 120,
      porcentaje_recuperacion: 28.5,
      estado_reapertura: 'EN_PROCESO',
      ultima_lectura: '2026-09-25T18:00:00Z'
    },
    beneficio_financiero: {
      fuente: 'CAMARA_COMERCIO_CALI',
      monto_estimado_ahorro: 1850000,
      aprobado: true
    }
  },
  {
    codigo: 'RAC-2026-0419',
    fecha_registro: '2026-09-25T17:15:00Z',
    comerciante: {
      id_nido: 'NIT-16789012',
      nombre: 'Carlos Mario Orozco',
      negocio: 'Ferretería El Tornillo Dorado',
      comuna: 3,
      barrio: 'San Nicolás',
      direccion: 'Calle 18 # 5-42',
      formal: true
    },
    triaje: {
      barrera_principal: 'MAQUINARIA_INFRAESTRUCTURA',
      descripcion: 'Fisuras en estantería pesada y vitrinas principales partidas por el sismo.',
      metodo_registro: 'WEB_APP',
      habeas_data_autorizado: true
    },
    ruta_asignada: {
      tipo_ruta: 'ATENCION_INDIVIDUAL',
      corredor_comercial: 'CORREDOR_SAN_NICOLAS_C3',
      entidad_responsable: 'ALCALDIA_CALI_DATIC',
      beneficio_colectivo: 'Subsidio de Adecuación Física y Maquinaria',
      estado_tramite: 'VISITA_TECNICA_APROBADA'
    },
    verificacion_pasiva: {
      metodo: 'EMCALI_CONSUMO_KWH',
      cuenta_contrato_emcali: 'EE-332145-Cali',
      kwh_base: 310,
      kwh_actual: 40,
      porcentaje_recuperacion: 12.9,
      estado_reapertura: 'EN_PROCESO',
      ultima_lectura: '2026-09-25T18:30:00Z'
    },
    beneficio_financiero: {
      fuente: 'FONDO_SOLIDARIO_ALCALDIA_5000M',
      monto_solicitado: 4500000,
      aprobado: true
    }
  },
  {
    codigo: 'RAC-2026-0420',
    fecha_registro: '2026-09-25T15:40:00Z',
    comerciante: {
      id_nido: 'CC-66912304',
      nombre: 'Sandra Patricia Caicedo',
      negocio: 'Confecciones La Sultana',
      comuna: 8,
      barrio: 'El Troncal',
      direccion: 'Carrera 11B # 44-30',
      formal: true
    },
    triaje: {
      barrera_principal: 'LIQUIDEZ_CAPITAL',
      descripcion: 'No alcanzo a pagar arriendo de local y nómina de 3 operarias esta quincena.',
      metodo_registro: 'WHATSAPP_TEXT',
      habeas_data_autorizado: true
    },
    ruta_asignada: {
      tipo_ruta: 'MICROCREDITO_EMERGENCIA',
      corredor_comercial: 'COMUNA_8_EL_TRONCAL',
      entidad_responsable: 'COMFANDI',
      beneficio_colectivo: 'Microcrédito Tasa Cero Sismo + Subsidio de Caja',
      estado_tramite: 'DESEMBOLSADO'
    },
    verificacion_pasiva: {
      metodo: 'EMCALI_CONSUMO_KWH',
      cuenta_contrato_emcali: 'EE-774120-Cali',
      kwh_base: 280,
      kwh_actual: 210,
      porcentaje_recuperacion: 75.0,
      estado_reapertura: 'REAPERTURA_CONFIRMADA',
      ultima_lectura: '2026-09-25T18:45:00Z'
    },
    beneficio_financiero: {
      fuente: 'COMFANDI_MICROCREDITO',
      monto_solicitado: 3000000,
      aprobado: true
    }
  },
  {
    codigo: 'RAC-2026-0421',
    fecha_registro: '2026-09-25T14:10:00Z',
    comerciante: {
      id_nido: 'CC-31445981',
      nombre: 'Luz Dary Mosquera',
      negocio: 'Frutería El Chontaduro de Oro',
      comuna: 20,
      barrio: 'Siloé (Estación Cañaveralejo)',
      direccion: 'Calle 1ra Oeste # 52-10',
      formal: false
    },
    triaje: {
      barrera_principal: 'CLIENTES_VENTAS',
      descripcion: 'La vía principal quedó tapada por derrumbe leve, no sube gente a comprar.',
      metodo_registro: 'GESTOR_CUADRA_CAMPO',
      habeas_data_autorizado: true
    },
    ruta_asignada: {
      tipo_ruta: 'REUBICACION_TEMPORAL_CCC',
      corredor_comercial: 'CORREDOR_SILOE_C20',
      entidad_responsable: 'CAMARA_COMERCIO_CALI',
      beneficio_colectivo: 'Puesto Comercial Temporal en La 14 de la 80 (Cámara de Comercio de Cali)',
      estado_tramite: 'ASIGNADO_STAND_B12'
    },
    verificacion_pasiva: {
      metodo: 'CHECKIN_SEDE_TEMPORAL',
      cuenta_contrato_emcali: 'EE-881290-Cali',
      kwh_base: 140,
      kwh_actual: 95,
      porcentaje_recuperacion: 67.8,
      estado_reapertura: 'REAPERTURA_CONFIRMADA',
      ultima_lectura: '2026-09-25T17:20:00Z'
    },
    beneficio_financiero: {
      fuente: 'ALCALDIA_ESPACIO_PUBLICO',
      monto_solicitado: 0,
      aprobado: true
    }
  }
];

export const INITIAL_FONDO_DISTRITAL: FondoSolidarioInfo = {
  total: 5000000000,
  comprometido: 1845000000,
  desembolsado: 1220000000,
  disponible: 3155000000,
  comercios_beneficiados: 418,
  tasa_reactivacion_emcali: 71.4
};

// 16 Screen Identifiers and specifications from section 3
export const SCREEN_CATALOG = [
  {
    id: 'whatsapp_comerciante_bot.png',
    title: 'WhatsApp Bot Comerciante',
    canal: 'WhatsApp (Texto / Voz)',
    descripcion: 'Canal conversacional principal para registro por audio o texto, cruce censal institucional en tiempo real y triaje en caliente.',
    modulo: 'COMERCIANTE_WHATSAPP'
  },
  {
    id: 'pantalla_1_ingreso_v2.png',
    title: 'Ingreso ID + Ley 1581',
    canal: 'Web App Comerciante',
    descripcion: 'Paso 1: Validación instantánea por Cédula o NIT sin pedir RUT ni DIAN, más Habeas Data en un solo clic.',
    modulo: 'COMERCIANTE_WEB'
  },
  {
    id: 'pantalla_2_triaje_v2.png',
    title: 'Triaje de Barreras en 3 Clics',
    canal: 'Web App Comerciante',
    descripcion: 'Paso 2: Selección entre las 4 barreras críticas en menos de 60 segundos con opción de consulta asistida por IA.',
    modulo: 'COMERCIANTE_WEB'
  },
  {
    id: 'pantalla_agente_ia_chat.png',
    title: 'Chat Agente IA GovTech Cali',
    canal: 'Asistente Digital',
    descripcion: 'Interacción en lenguaje natural para orientar al comerciante sobre subsidios, rutas colectivas y trámites pasivos.',
    modulo: 'COMERCIANTE_WEB'
  },
  {
    id: 'pantalla_3_ruta_v2.png',
    title: 'Ruteo e Implicación Colectiva',
    canal: 'Web App Comerciante',
    descripcion: 'Paso 3: Detección de enjambre comercial por corredor y opción de compra agrupada con 18% de descuento.',
    modulo: 'COMERCIANTE_WEB'
  },
  {
    id: 'pantalla_4_expediente_v2.png',
    title: 'Expediente Único RAC-2026',
    canal: 'Web App Comerciante',
    descripcion: 'Paso 4: Generación de radicado oficial, código de seguimiento, entidad asignada y monitoreo telemétrico EMCALI.',
    modulo: 'COMERCIANTE_WEB'
  },
  {
    id: 'web_landing_comerciante.png',
    title: 'Landing Web Comerciante',
    canal: 'Portal Distrital',
    descripcion: 'Página de inicio institucional de Santiago de Cali con los 5 principios de reactivación y accesos directos.',
    modulo: 'LANDING_PORTAL'
  },
  {
    id: 'web_expediente_publico.png',
    title: 'Portal de Seguimiento Público',
    canal: 'Web Consulta Ciudadana',
    descripcion: 'Consulta transparente del estado de avance del expediente, fechas de despacho de insumos y telemetría de luz.',
    modulo: 'CONSULTA_PUBLICA'
  },
  {
    id: 'pantalla_gestor_cuadra.png',
    title: 'App Gestor de Cuadra (Atención en Calle)',
    canal: 'App Gestores Territoriales',
    descripcion: 'Módulo de campo para registro asistido de adultos mayores o puestos informales, geolocalización y firma táctil.',
    modulo: 'GESTOR_CALLE'
  },
  {
    id: 'pantalla_ruta_colectiva_detalle.png',
    title: 'Detalle de Ruta Colectiva por Corredor',
    canal: 'Cámara de Comercio de Cali',
    descripcion: 'Vista pormenorizada de la agrupación de pedidos de insumos por corredor comercial con ahorro mayorista.',
    modulo: 'OFICINA_CCC'
  },
  {
    id: 'pantalla_entidades_ruteo.png',
    title: 'Mapeo Interinstitucional de Ruteo',
    canal: 'Alcaldía / DATIC',
    descripcion: 'Matriz de asignación de competencias entre Alcaldía, Cámara de Comercio de Cali, Comfandi y EMCALI.',
    modulo: 'OFICINA_ALCALDIA'
  },
  {
    id: 'oficina_virtual_alcaldia.png',
    title: 'Oficina Virtual Alcaldía / DATIC',
    canal: 'Back-Office Distrital',
    descripcion: 'Gestión del Fondo Solidario de $5.000M, mapa de calor por comunas y asignación de subsidios de liquidez.',
    modulo: 'OFICINA_ALCALDIA'
  },
  {
    id: 'oficina_virtual_ccc.png',
    title: 'Oficina Virtual Cámara de Comercio (CCC)',
    canal: 'Back-Office Gremial',
    descripcion: 'Consolidación de compras colectivas, proveedores verificados y despacho logístico conjunto de insumos.',
    modulo: 'OFICINA_CCC'
  },
  {
    id: 'oficina_virtual_comfandi.png',
    title: 'Oficina Virtual Comfandi',
    canal: 'Back-Office Caja de Compensación',
    descripcion: 'Aprobación de microcréditos de emergencia post-sismo y subsidios de sostenimiento de empleo.',
    modulo: 'OFICINA_COMFANDI'
  },
  {
    id: 'oficina_virtual_emcali.png',
    title: 'Oficina Virtual EMCALI (Verificación Pasiva)',
    canal: 'Back-Office Servicios Públicos',
    descripcion: 'Monitoreo de retorno de consumo eléctrico comercial (kWh) por medidor y semáforo de reactivación física.',
    modulo: 'OFICINA_EMCALI'
  },
  {
    id: 'dashboard_control_propio.png',
    title: 'Tablero de Control Distrital',
    canal: 'Back-Office Integral',
    descripcion: 'Panel consolidado de mando unificado para el seguimiento general de la reactivación comercial de Cali.',
    modulo: 'DASHBOARD_CONTROL'
  },
  {
    id: 'ruta_abierta_cali_mockup.png',
    title: 'Mockup Panorámico Multi-Dispositivo',
    canal: 'Ecosistema Completo',
    descripcion: 'Visión holística e integrada de los cuatro canales públicos digitales en funcionamiento concurrente.',
    modulo: 'ECOSISTEMA_GLOBAL'
  }
];
