import React, { useState } from 'react';
import {
  Code, Copy, Check, Send, ExternalLink, Terminal,
  RefreshCw, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { ExpedienteRAC } from '../types/govtech';

interface JsonWebhookViewerProps {
  expedientes: ExpedienteRAC[];
}

export const JsonWebhookViewer: React.FC<JsonWebhookViewerProps> = ({ expedientes }) => {
  const [selectedCode, setSelectedCode] = useState<string>(
    expedientes.length > 0 ? expedientes[0].codigo : 'RAC-2026-0418'
  );
  const [webhookUrl, setWebhookUrl] = useState<string>('https://api.cali.gov.co/datic/v1/reactivacion/webhook');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const currentExp = expedientes.find(e => e.codigo === selectedCode) || expedientes[0];

  // Exactly matches section 5 of the user prompt
  const standardJsonPayload = {
    expediente: {
      codigo: currentExp?.codigo || 'RAC-2026-0418',
      fecha_registro: currentExp?.fecha_registro || '2026-09-25T19:24:00Z',
      comerciante: {
        id_nido: currentExp?.comerciante.id_nido || 'NIT-31842099',
        nombre: currentExp?.comerciante.nombre || 'Rosa Elena Pérez',
        negocio: currentExp?.comerciante.negocio || 'Panadería La Espiga',
        comuna: currentExp?.comerciante.comuna || 19,
        barrio: currentExp?.comerciante.barrio || 'San Fernando'
      },
      triaje: {
        barrera_principal: currentExp?.triaje.barrera_principal || 'INSUMOS_MATERIA_PRIMA',
        metodo_registro: currentExp?.triaje.metodo_registro || 'WHATSAPP_VOICE_NOTE',
        habeas_data_autorizado: currentExp?.triaje.habeas_data_autorizado ?? true
      },
      ruta_asignada: {
        tipo_ruta: currentExp?.ruta_asignada.tipo_ruta || 'RUTA_COLECTIVA_ENJAMBRE',
        corredor_comercial: currentExp?.ruta_asignada.corredor_comercial || 'CORREDOR_SAN_FERNANDO_C19',
        entidad_responsable: currentExp?.ruta_asignada.entidad_responsable || 'CAMARA_COMERCIO_CALI',
        beneficio_colectivo: currentExp?.ruta_asignada.beneficio_colectivo || '18% Ahorro Insumos + Flete Compartido'
      },
      verificacion_pasiva: {
        metodo: currentExp?.verificacion_pasiva.metodo || 'EMCALI_CONSUMO_KWH',
        cuenta_contrato_emcali: currentExp?.verificacion_pasiva.cuenta_contrato_emcali || 'EE-994821-Cali',
        estado_reapertura: currentExp?.verificacion_pasiva.estado_reapertura || 'EN_PROCESO'
      }
    }
  };

  const jsonString = JSON.stringify(standardJsonPayload, null, 2);

  const curlCommand = `curl -X POST "${window.location.origin}/api/expedientes" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(standardJsonPayload)}'`;

  const copyToClipboard = (text: string, isCurl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCurl) {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleTestDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendResult({
        status: 200,
        message: 'Payload entregado con éxito al Webhook Distrital de Cali',
        timestamp: new Date().toISOString(),
        radicado_confirmado: currentExp?.codigo
      });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
          <Terminal className="w-4 h-4" />
          <span>SECCIÓN 5 · ESPECIFICACIÓN TÉCNICA DE INTEGRACIÓN API / WEBHOOK</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Estructura de Salida JSON Estándar Post-Sismo
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Payload canónico para interoperabilidad con los sistemas de la Alcaldía de Cali (DATIC), Cámara de Comercio de Cali (CCC) y monitoreo pasivo de EMCALI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: JSON Code Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {/* Window bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">expediente_output.json</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="bg-slate-800 text-xs font-mono text-emerald-400 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  {expedientes.map((exp) => (
                    <option key={exp.codigo} value={exp.codigo}>
                      {exp.codigo} ({exp.comerciante.negocio})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => copyToClipboard(jsonString, false)}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Code */}
            <pre className="p-4 sm:p-6 text-xs sm:text-[13px] font-mono leading-relaxed text-emerald-300 overflow-x-auto selection:bg-emerald-900 selection:text-white">
              {jsonString}
            </pre>
          </div>

          {/* cURL command box */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                Consumo por cURL / Servidor Externo
              </span>
              <button
                onClick={() => copyToClipboard(curlCommand, true)}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-sans font-semibold"
              >
                {copiedCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Copiado' : 'Copiar cURL'}</span>
              </button>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg text-emerald-400 overflow-x-auto">
              <code>{curlCommand}</code>
            </div>
          </div>
        </div>

        {/* Right Col: Webhook Tester & Endpoints */}
        <div className="space-y-6">
          {/* Dispatcher Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Simulador de Disparo de Webhook
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Envía el JSON estructurado al endpoint de interoperabilidad de la entidad receptora.
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">URL Receptora</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Evento Emitido</label>
                <input
                  type="text"
                  readOnly
                  value="expediente.creado.sismo_cali"
                  className="w-full px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleTestDispatch}
              disabled={isSending}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <span>Emitiendo Webhook...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Probar Disparo de Webhook</span>
                </>
              )}
            </button>

            {sendResult && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>HTTP 200 OK</span>
                </div>
                <p className="text-[11px] text-emerald-800">{sendResult.message}</p>
                <span className="font-mono text-[10px] text-emerald-700 block">
                  Radicado: {sendResult.radicado_confirmado}
                </span>
              </div>
            )}
          </div>

          {/* Integration Specs */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-700 space-y-3">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
              Políticas de Interoperabilidad GovTech
            </span>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span><strong>Idempotencia:</strong> El código RAC-2026-XXXX es inmutable y único por titular comercial.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span><strong>Actualización Pasiva:</strong> Las variaciones de telemetría eléctrica se sincronizan por el campo <code>verificacion_pasiva.cuenta_contrato_emcali</code>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span><strong>Tratamiento Legal:</strong> Certifica consentimiento de Habeas Data bajo la Ley 1581 de 2012.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
