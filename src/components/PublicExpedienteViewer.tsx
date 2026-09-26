import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, Zap, ArrowLeft, Copy, ExternalLink,
  Building2, Truck, DollarSign, Calendar, MapPin, QrCode
} from 'lucide-react';
import { ExpedienteRAC } from '../types/govtech';

interface PublicExpedienteViewerProps {
  expedienteCodigo: string;
  expedientes: ExpedienteRAC[];
  onBack: () => void;
  onSelectAnother: (codigo: string) => void;
}

export const PublicExpedienteViewer: React.FC<PublicExpedienteViewerProps> = ({
  expedienteCodigo,
  expedientes,
  onBack,
  onSelectAnother
}) => {
  const [copied, setCopied] = useState(false);

  const expediente = expedientes.find(
    e => e.codigo.toUpperCase() === expedienteCodigo.toUpperCase()
  ) || expedientes[0];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isReopened = (expediente?.verificacion_pasiva.porcentaje_recuperacion || 0) >= 65 ||
    expediente?.verificacion_pasiva.estado_reapertura === 'REAPERTURA_CONFIRMADA';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al portal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Ver otro radicado:</span>
          <select
            value={expediente?.codigo}
            onChange={(e) => onSelectAnother(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-mono font-bold text-emerald-800"
          >
            {expedientes.map(e => (
              <option key={e.codigo} value={e.codigo}>{e.codigo} - {e.comerciante.negocio}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Official Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
        {/* Certificate Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>RADICADO OFICIAL DE ATENCIÓN POST-SISMO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Expediente Único {expediente.codigo}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Plataforma Distrital de Infraestructura Pública Digital · Santiago de Cali
            </p>
          </div>

          <div className="text-right self-start sm:self-center">
            <span className="text-[11px] text-slate-400 block">Fecha de Expedición</span>
            <span className="font-mono text-xs font-bold text-slate-200 block">
              {new Date(expediente.fecha_registro).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status highlight */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Estado del Caso</span>
              <span className="text-sm font-bold text-slate-900">
                {expediente.ruta_asignada.estado_tramite || 'RUTA ASIGNADA'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Verificación Pasiva EMCALI</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase inline-block ${
                isReopened ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isReopened ? 'Reapertura Física Confirmada' : 'En Monitoreo Telemétrico'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Merchant */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Identificación del Establecimiento (Censo Distrital)
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nombre Comercial:</span>
                  <span className="font-bold text-slate-900">{expediente.comerciante.negocio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular o Representante:</span>
                  <span className="font-medium text-slate-800">{expediente.comerciante.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cédula / NIT:</span>
                  <span className="font-mono text-slate-800 font-semibold">{expediente.comerciante.id_nido}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ubicación:</span>
                  <span className="text-slate-800">Comuna {expediente.comerciante.comuna} · {expediente.comerciante.barrio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dirección:</span>
                  <span className="text-slate-800">{expediente.comerciante.direccion || 'Corredor Comercial'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Habeas Data (Ley 1581):</span>
                  <span className="text-emerald-700 font-semibold">Consentimiento Autorizado</span>
                </div>
              </div>
            </div>

            {/* Assigned Route */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Solución y Ruteo Interinstitucional
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Entidad Gestora:</span>
                  <span className="font-bold text-emerald-800">{expediente.ruta_asignada.entidad_responsable.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tipo de Ruta:</span>
                  <span className="font-semibold text-slate-900">{expediente.ruta_asignada.tipo_ruta.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corredor Asociado:</span>
                  <span className="font-mono text-[11px] text-slate-700">{expediente.ruta_asignada.corredor_comercial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficio Colectivo:</span>
                  <span className="font-bold text-emerald-700">{expediente.ruta_asignada.beneficio_colectivo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Canal de Registro:</span>
                  <span className="font-mono text-slate-700">{expediente.triaje.metodo_registro}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Passive Energy Monitor Breakdown */}
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Medición Telemétrica de Reapertura (EMCALI)</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-800">
                Cuenta Contrato: {expediente.verificacion_pasiva.cuenta_contrato_emcali}
              </span>
            </div>

            <p className="text-xs text-emerald-800/80 mb-3">
              Monitoreo pasivo del retorno de carga comercial. Si el consumo de kWh supera el 65% del nivel base histórico, el expediente se cierra exitosamente sin requerir visitas ni actas presenciales.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-emerald-200">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, expediente.verificacion_pasiva.porcentaje_recuperacion || 25)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-900 font-mono tabular-nums">
                {expediente.verificacion_pasiva.porcentaje_recuperacion || 25}%
              </span>
            </div>
          </div>

          {/* Public share buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Válido ante la Alcaldía de Cali, CCC, Comfandi y EMCALI.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={copyUrl}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Imprimir Constancia Oficial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
