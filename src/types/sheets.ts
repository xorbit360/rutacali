export interface ComercianteRow {
  ID_Expediente: string;
  Fecha_Hora: string;
  Nombre_Comerciante: string;
  Barrio_Comuna: string;
  Telefono_WhatsApp: string;
  Ruta_Asignada: string;
  Estado_SLA: string;
  Entidad_Encargada: string;
  Validacion_Ley1581: string;
}

export interface EnjambreRow {
  ID_Enjambre: string;
  Cuadrante_Zona: string;
  Insumo_Requerido: string;
  Cantidad_Total: string;
  Tenderos_Agrupados: string;
  Descuento_Logrado: string;
  Mayorista_Asignado: string;
  Estado_Entrega: string;
}

export interface TrackingEmcaliRow {
  ID_Expediente: string;
  Cuenta_EMCALI: string;
  Consumo_kWh_Base: number;
  Consumo_kWh_Actual: number;
  Porcentaje_Reapertura: string;
  Ultima_Confirmacion_WA: string;
}

export interface EntidadSlaRow {
  ID_Expediente: string;
  Entidad_Encargada: string;
  Rol_Institucional: string;
  Tiempo_Respuesta_SLA: string;
  Estado_Atencion: string;
  Accion_Requerida: string;
}

export interface GoogleSheetsDatabaseState {
  comerciantes: ComercianteRow[];
  enjambres: EnjambreRow[];
  entidadesSla?: EntidadSlaRow[];
  trackingEmcali?: TrackingEmcaliRow[];
}
