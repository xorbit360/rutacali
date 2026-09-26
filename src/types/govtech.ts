export interface ComercianteNido {
  id_nido: string;
  nombre: string;
  negocio: string;
  comuna: number;
  barrio: string;
  direccion: string;
  categoria: string;
  antiguedad_anos: number;
  formal: boolean;
  cuenta_emcali: string;
  consumo_kwh_base: number;
  consumo_kwh_actual: number;
  telefono: string;
}

export type BarreraCritica =
  | 'LIQUIDEZ_CAPITAL'
  | 'MAQUINARIA_INFRAESTRUCTURA'
  | 'INSUMOS_MATERIA_PRIMA'
  | 'CLIENTES_VENTAS';

export interface ExpedienteRAC {
  codigo: string;
  fecha_registro: string;
  comerciante: {
    id_nido: string;
    nombre: string;
    negocio: string;
    comuna: number;
    barrio: string;
    direccion?: string;
    formal?: boolean;
  };
  triaje: {
    barrera_principal: BarreraCritica;
    descripcion?: string;
    metodo_registro: 'WHATSAPP_VOICE_NOTE' | 'WHATSAPP_TEXT' | 'WEB_APP' | 'GESTOR_CUADRA_CAMPO';
    habeas_data_autorizado: boolean;
    gestor_nombre?: string | null;
    firma_verificada?: boolean;
  };
  ruta_asignada: {
    tipo_ruta: 'RUTA_COLECTIVA_ENJAMBRE' | 'ATENCION_INDIVIDUAL' | 'MICROCREDITO_EMERGENCIA' | 'REUBICACION_TEMPORAL_CCC' | 'REUBICACION_TEMPORAL_NIDO';
    corredor_comercial: string;
    entidad_responsable: 'CAMARA_COMERCIO_CALI' | 'ALCALDIA_CALI_DATIC' | 'COMFANDI' | 'EMCALI';
    beneficio_colectivo: string;
    estado_tramite?: string;
  };
  verificacion_pasiva: {
    metodo: 'EMCALI_CONSUMO_KWH' | 'CHECKIN_SEDE_TEMPORAL';
    cuenta_contrato_emcali: string;
    kwh_base?: number;
    kwh_actual?: number;
    porcentaje_recuperacion?: number;
    estado_reapertura: 'EN_PROCESO' | 'REAPERTURA_CONFIRMADA' | 'PENDIENTE_TELEMETRIA';
    ultima_lectura?: string;
  };
  beneficio_financiero?: {
    fuente?: string;
    monto_solicitado?: number;
    monto_estimado_ahorro?: number;
    aprobado?: boolean;
  };
}

export interface ColectivaEnjambre {
  id: string;
  nombre: string;
  comuna: number;
  barrio: string;
  rubro: string;
  comerciantes_agrupados: number;
  ahorro_pactado: string;
  entidad_responsable: string;
  proveedor_colectivo: string;
  estado: string;
  fecha_proximo_despacho: string;
}

export interface FondoSolidarioInfo {
  total: number;
  comprometido: number;
  desembolsado: number;
  disponible: number;
  comercios_beneficiados: number;
  tasa_reactivacion_emcali: number;
}
