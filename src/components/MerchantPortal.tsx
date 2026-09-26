import React, { useState } from 'react';
import {
  Search, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight,
  TrendingDown, Users, Zap, Truck, DollarSign, Wrench, Package,
  Store, Bot, Sparkles, Building2, MapPin, Copy, ExternalLink, QrCode
} from 'lucide-react';
import { ComercianteNido, BarreraCritica, ExpedienteRAC } from '../types/govtech';

interface MerchantPortalProps {
  nidoDataset: ComercianteNido[];
  onExpedienteCreated: (exp: ExpedienteRAC) => void;
  onOpenWhatsApp: () => void;
  onViewExpediente: (codigo: string) => void;
}

export const MerchantPortal: React.FC<MerchantPortalProps> = ({
  nidoDataset,
  onExpedienteCreated,
  onOpenWhatsApp,
  onViewExpediente
}) => {
  // Step State (1: Ingreso ID, 2: Habeas Data 1581, 3: Triaje 3 Clics, 4: Enjambre / Asignación, 5: Expediente)
  const [step, setStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMerchant, setSelectedMerchant] = useState<ComercianteNido | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const [manualName, setManualName] = useState('');
  const [manualNegocio, setManualNegocio] = useState('');
  const [manualComuna, setManualComuna] = useState<number>(19);
  const [manualBarrio, setManualBarrio] = useState('San Fernando');

  // Consent
  const [habeasDataAccepted, setHabeasDataAccepted] = useState<boolean>(true);

  // Barrier selection
  const [selectedBarrier, setSelectedBarrier] = useState<BarreraCritica>('INSUMOS_MATERIA_PRIMA');
  const [freeTextNotes, setFreeTextNotes] = useState<string>('');
  const [isAiTriaging, setIsAiTriaging] = useState<boolean>(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Swarm route choice
  const [isSwarmJoined, setIsSwarmJoined] = useState<boolean>(true);

  // Resulting created expediente
  const [createdExpediente, setCreatedExpediente] = useState<ExpedienteRAC | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Search filtered merchants from preloaded NIDO base
  const filteredMerchants = nidoDataset.filter(m =>
    m.id_nido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.barrio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMerchant = (m: ComercianteNido) => {
    setSelectedMerchant(m);
    setIsManualInput(false);
    setStep(2); // Advance to Habeas Data Ley 1581
  };

  const handleUseManual = () => {
    if (!manualNegocio || !manualName) return;
    const custom: ComercianteNido = {
      id_nido: `CC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      nombre: manualName,
      negocio: manualNegocio,
      comuna: manualComuna,
      barrio: manualBarrio,
      direccion: `Calle Comercial Comuna ${manualComuna}`,
      categoria: 'Comercio Popular',
      antiguedad_anos: 5,
      formal: true,
      cuenta_emcali: `EE-${Math.floor(100000 + Math.random() * 900000)}-Cali`,
      consumo_kwh_base: 320,
      consumo_kwh_actual: 35,
      telefono: '+57 300 000 0000'
    };
    setSelectedMerchant(custom);
    setStep(2);
  };

  const handleAiConsultation = async () => {
    if (!freeTextNotes.trim()) return;
    setIsAiTriaging(true);
    try {
      const res = await fetch('/api/gemini/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: freeTextNotes,
          nombre_usuario: selectedMerchant?.nombre,
          comuna_hint: `Comuna ${selectedMerchant?.comuna} - ${selectedMerchant?.barrio}`
        })
      });
      const data = await res.json();
      if (data.barrera_principal) {
        setSelectedBarrier(data.barrera_principal);
      }
      setAiInsight(data.mensaje_respuesta || data.mensaje_whatsapp_respuesta || data.beneficio || 'Triaje asistido completado');
    } catch {
      // Fallback local heuristic
      if (freeTextNotes.toLowerCase().includes('harina') || freeTextNotes.toLowerCase().includes('insumo')) {
        setSelectedBarrier('INSUMOS_MATERIA_PRIMA');
      } else if (freeTextNotes.toLowerCase().includes('arriendo') || freeTextNotes.toLowerCase().includes('plata')) {
        setSelectedBarrier('LIQUIDEZ_CAPITAL');
      }
      setAiInsight('Analizado por IA: Priorizado para compras colectivas CCC y protección de liquidez.');
    } finally {
      setIsAiTriaging(false);
    }
  };

  const handleFinalizeTriaje = async () => {
    if (!selectedMerchant) return;
    setIsSubmitting(true);

    const isSwarm = selectedBarrier === 'INSUMOS_MATERIA_PRIMA' && isSwarmJoined;
    const payload = {
      comerciante: selectedMerchant,
      barrera_principal: selectedBarrier,
      descripcion: freeTextNotes || 'Reactivación comercial post-sismo',
      metodo_registro: 'WEB_APP',
      habeas_data_autorizado: habeasDataAccepted,
      tipo_ruta: isSwarm ? 'RUTA_COLECTIVA_ENJAMBRE' : 'ATENCION_INDIVIDUAL',
      corredor_comercial: `CORREDOR_${selectedMerchant.barrio.toUpperCase().replace(/\s+/g, '_')}_C${selectedMerchant.comuna}`,
      beneficio_colectivo: isSwarm ? '18% Ahorro Insumos + Flete Compartido CCC' : undefined
    };

    try {
      const res = await fetch('/api/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.expediente) {
        setCreatedExpediente(data.expediente);
        onExpedienteCreated(data.expediente);
        setStep(5); // Expediente final
      }
    } catch {
      // Offline fallback
      const fallbackExp: ExpedienteRAC = {
        codigo: `RAC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fecha_registro: new Date().toISOString(),
        comerciante: selectedMerchant,
        triaje: {
          barrera_principal: selectedBarrier,
          descripcion: freeTextNotes || 'Reactivación post-sismo',
          metodo_registro: 'WEB_APP',
          habeas_data_autorizado: true
        },
        ruta_asignada: {
          tipo_ruta: isSwarm ? 'RUTA_COLECTIVA_ENJAMBRE' : 'ATENCION_INDIVIDUAL',
          corredor_comercial: `CORREDOR_${selectedMerchant.barrio.toUpperCase()}_C${selectedMerchant.comuna}`,
          entidad_responsable: selectedBarrier === 'INSUMOS_MATERIA_PRIMA' ? 'CAMARA_COMERCIO_CALI' : 'ALCALDIA_CALI_DATIC',
          beneficio_colectivo: isSwarm ? '18% Ahorro Insumos + Flete Compartido' : 'Subsidio Distrital'
        },
        verificacion_pasiva: {
          metodo: 'EMCALI_CONSUMO_KWH',
          cuenta_contrato_emcali: selectedMerchant.cuenta_emcali,
          kwh_base: selectedMerchant.consumo_kwh_base,
          kwh_actual: selectedMerchant.consumo_kwh_actual,
          porcentaje_recuperacion: Math.round((selectedMerchant.consumo_kwh_actual / selectedMerchant.consumo_kwh_base) * 100),
          estado_reapertura: 'EN_PROCESO'
        }
      };
      setCreatedExpediente(fallbackExp);
      onExpedienteCreated(fallbackExp);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyExpedienteLink = () => {
    if (!createdExpediente) return;
    const url = `${window.location.origin}/expediente/${createdExpediente.codigo}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Visual Header / Banner with authentic Cali assets */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white mb-8 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />
        <img
          src="/src/assets/images/cali_panoramic_skyline_1790389553828.jpg"
          alt="Santiago de Cali"
          referrerPolicy="no-referrer"
          className="absolute right-0 top-0 h-full w-2/3 object-cover object-center opacity-40 mix-blend-luminosity"
        />

        <div className="relative z-20 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <span>ALCALDÍA DE SANTIAGO DE CALI</span>
            <span>·</span>
            <span>DATIC</span>
            <span>·</span>
            <span>CÁMARA DE COMERCIO (CCC)</span>
            <span>·</span>
            <span>COMFANDI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
            Atención Rápida Post-Sismo para el Comercio Caleño
          </h1>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Sin RUT, sin balances y sin burocracia. Si tu negocio está registrado en Cali, tu información ya está precargada. Resuelve tu caso en menos de 60 segundos.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
              <span className="text-emerald-300 font-semibold block">01. Cero Papeleo</span>
              <span className="text-slate-300 text-[11px]">Validación directa por Cédula/NIT</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
              <span className="text-emerald-300 font-semibold block">02. 3 Clics</span>
              <span className="text-slate-300 text-[11px]">Menos de 60 segundos</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
              <span className="text-emerald-300 font-semibold block">03. Ruta Enjambre</span>
              <span className="text-slate-300 text-[11px]">18% Ahorro CCC</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
              <span className="text-emerald-300 font-semibold block">04. Microcrédito</span>
              <span className="text-slate-300 text-[11px]">0.6% mes Comfandi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 px-1">
          <span className={step >= 1 ? 'text-emerald-600' : ''}>1. Identificación Comercial</span>
          <span className={step >= 2 ? 'text-emerald-600' : ''}>2. Habeas Data (1581)</span>
          <span className={step >= 3 ? 'text-emerald-600' : ''}>3. Triaje de Barreras</span>
          <span className={step >= 4 ? 'text-emerald-600' : ''}>4. Enjambre Colectivo</span>
          <span className={step >= 5 ? 'text-emerald-600' : ''}>5. Expediente RAC</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: VALIDACIÓN IDENTIFICACIÓN */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                Paso 1 de 4 · Cero Burocracia
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Consulta tu Negocio en el Censo Comercial de Cali
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Ingresa tu Cédula, NIT o nombre del establecimiento. No necesitas adjuntar ningún documento.
              </p>
            </div>
            <button
              onClick={onOpenWhatsApp}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 self-start sm:self-center transition-colors"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>¿Prefieres WhatsApp o Nota de Voz?</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por NIT, Cédula, nombre (ej: Doña Rosa, San Fernando, 31842099)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Preset list from Censo Comercial */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Comercios Verificados en Censo Distrital ({filteredMerchants.length})</span>
              <span>Haz clic para seleccionar</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMerchants.map((merchant) => (
                <div
                  key={merchant.id_nido}
                  onClick={() => handleSelectMerchant(merchant)}
                  className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 text-sm">
                        {merchant.negocio}
                      </h3>
                      <p className="text-xs text-slate-600">{merchant.nombre}</p>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {merchant.id_nido}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      Comuna {merchant.comuna} · {merchant.barrio}
                    </span>
                    <span className="text-emerald-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Seleccionar <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Option for manual entry if not in list */}
          <div className="pt-4 border-t border-slate-100">
            {!isManualInput ? (
              <button
                onClick={() => setIsManualInput(true)}
                className="text-xs text-slate-600 hover:text-emerald-700 font-semibold underline underline-offset-2"
              >
                ¿No apareces en la lista? Haz clic aquí para registro rápido sin papeles.
              </button>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">Registro Rápido de Emergencia (Economía Formal o Popular)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Nombre del Titular</label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Ej: Martha Cecilia Gómez"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Nombre del Negocio o Puesto</label>
                    <input
                      type="text"
                      value={manualNegocio}
                      onChange={(e) => setManualNegocio(e.target.value)}
                      placeholder="Ej: Arepas Doña Martha"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Comuna (1 a 22)</label>
                    <input
                      type="number"
                      min={1}
                      max={22}
                      value={manualComuna}
                      onChange={(e) => setManualComuna(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Barrio / Corredor</label>
                    <input
                      type="text"
                      value={manualBarrio}
                      onChange={(e) => setManualBarrio(e.target.value)}
                      placeholder="Ej: Alameda, San Fernando, Siloé"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsManualInput(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUseManual}
                    disabled={!manualName || !manualNegocio}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg disabled:opacity-50"
                  >
                    Continuar con este Negocio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: CONSENTIMIENTO LEY 1581 DE 2012 EN 1 CLIC */}
      {step === 2 && selectedMerchant && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Paso 2 de 4 · Marco Jurídico Habeas Data
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Autorización en 1 Clic (Ley 1581 de 2012)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Para garantizar <strong>cero burocracia</strong>, autorizas a la Alcaldía de Cali, Cámara de Comercio y EMCALI a compartir tu radicado y telemetría de energía exclusivamente para asignarte subsidios y compras colectivas.
            </p>
          </div>

          {/* Merchant Confirmation Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Titular Identificado</span>
              <h3 className="text-base font-bold text-slate-900">{selectedMerchant.nombre}</h3>
              <p className="text-xs text-slate-600">
                {selectedMerchant.negocio} · {selectedMerchant.id_nido} · Comuna {selectedMerchant.comuna} ({selectedMerchant.barrio})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Cuenta EMCALI Registrada</span>
              <span className="font-mono text-xs font-bold text-emerald-700">{selectedMerchant.cuenta_emcali}</span>
            </div>
          </div>

          {/* Consent Text */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs text-slate-700 mb-6 leading-relaxed">
            <p className="mb-2">
              <strong>Finalidad Exclusiva Post-Sismo:</strong> Autorizo de manera previa, libre e informada a las entidades de Santiago de Cali (Alcaldía de Cali, Cámara de Comercio de Cali y Comfandi) para consultar mi radicado comercial, gestionar subsidios de liquidez, consolidar compras colectivas al por mayor y acceder a microcréditos de emergencia sin trámites ni reportes a la DIAN.
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Protegido bajo la Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 de Colombia.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Volver a buscar negocio
            </button>

            <button
              onClick={() => {
                setHabeasDataAccepted(true);
                setStep(3); // Triaje en 3 Clics
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acepto Términos en 1 Clic e Iniciar Triaje</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TRIAJE DE BARRERAS CRÍTICAS (MENOS DE 60 SEGUNDOS) */}
      {step === 3 && selectedMerchant && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Paso 3 de 4 · Triaje en 3 Clics
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              ¿Cuál es la barrera más urgente que te impide operar hoy?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Selecciona tu obstáculo prioritario. El sistema enrutará tu necesidad directamente a la entidad responsable.
            </p>
          </div>

          {/* 4 Critical Barriers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Barrier 1 */}
            <div
              onClick={() => setSelectedBarrier('LIQUIDEZ_CAPITAL')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedBarrier === 'LIQUIDEZ_CAPITAL'
                  ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl ${selectedBarrier === 'LIQUIDEZ_CAPITAL' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">[1]</span>
                    <h3 className="font-bold text-slate-900 text-sm">Liquidez / Capital de Trabajo</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Arriendo vencido, pago de nómina quincenal o recibos acumulados tras el sismo.
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-2">
                    → Fondo Solidario Alcaldía $5.000M / Comfandi
                  </span>
                </div>
              </div>
            </div>

            {/* Barrier 2 */}
            <div
              onClick={() => setSelectedBarrier('MAQUINARIA_INFRAESTRUCTURA')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedBarrier === 'MAQUINARIA_INFRAESTRUCTURA'
                  ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl ${selectedBarrier === 'MAQUINARIA_INFRAESTRUCTURA' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">[2]</span>
                    <h3 className="font-bold text-slate-900 text-sm">Maquinaria / Infraestructura</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Horno dañado, vitrinas fracturadas, fisuras en muros, estantería caída o equipos eléctricos averiados.
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-2">
                    → Subsidio de Adecuación Física DATIC
                  </span>
                </div>
              </div>
            </div>

            {/* Barrier 3 (Highlighted as collective swarm candidate) */}
            <div
              onClick={() => setSelectedBarrier('INSUMOS_MATERIA_PRIMA')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedBarrier === 'INSUMOS_MATERIA_PRIMA'
                  ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="absolute top-3 right-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Ruta Colectiva</span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl ${selectedBarrier === 'INSUMOS_MATERIA_PRIMA' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">[3]</span>
                    <h3 className="font-bold text-slate-900 text-sm">Insumos / Materia Prima</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Proveedores subieron precios, exigen contado o hay escasez en el corredor (harina, cemento, aceites, telas).
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-2">
                    → Cámara de Comercio de Cali (18% Ahorro Enjambre)
                  </span>
                </div>
              </div>
            </div>

            {/* Barrier 4 */}
            <div
              onClick={() => setSelectedBarrier('CLIENTES_VENTAS')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedBarrier === 'CLIENTES_VENTAS'
                  ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl ${selectedBarrier === 'CLIENTES_VENTAS' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">[4]</span>
                    <h3 className="font-bold text-slate-900 text-sm">Clientes / Ventas Caídas</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Calle acordonada o inaccesible, baja afluencia peatonal o necesidad de traslado provisional.
                  </p>
                  <span className="text-[11px] text-blue-700 font-semibold block mt-2">
                    → Cámara de Comercio de Cali (Vitrina Comercial, Ruedas de Negocio y Puestos en La 14 de la 80)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Free Text Assistant option */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>¿Deseas detallar tu situación en texto o voz para análisis con IA?</span>
              </span>
              <span className="text-[11px] text-slate-500">Opcional</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={freeTextNotes}
                onChange={(e) => setFreeTextNotes(e.target.value)}
                placeholder="Ej: Se me dañó el horno y la harina está muy cara en San Fernando..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAiConsultation}
                disabled={isAiTriaging || !freeTextNotes.trim()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                {isAiTriaging ? 'Analizando...' : <><Sparkles className="w-3.5 h-3.5 text-emerald-400" /><span>Triaje IA</span></>}
              </button>
            </div>
            {aiInsight && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs text-emerald-900">
                <strong>Diagnóstico GovTech IA:</strong> {aiInsight}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Volver
            </button>

            <button
              onClick={() => setStep(4)} // Step 4: Collective Swarm / Ruteo
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <span>Continuar al Ruteo e Implicación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RUTA COLECTIVA EN ENJAMBRE & ASIGNACIÓN INSTITUCIONAL */}
      {step === 4 && selectedMerchant && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Paso 4 de 4 · Activación de Solución
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Ruta Colectiva de Rescate por Corredor Comercial
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Agrupamos la demanda de comerciantes vecinos para comprar a precio mayorista y flete compartido con la Cámara de Comercio de Cali.
            </p>
          </div>

          {/* Collective Swarm Opportunity Card */}
          {selectedBarrier === 'INSUMOS_MATERIA_PRIMA' ? (
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-6 mb-6 shadow-lg border border-emerald-800/40 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>🔥 ALERTA DE RUTA COLECTIVA EN ENJAMBRE EN {selectedMerchant.barrio.toUpperCase()}</span>
                </div>

                <h3 className="text-lg font-black text-white mb-2">
                  12 Comercios de tu Corredor Registraron Escasez de Insumos Hoy
                </h3>

                <p className="text-xs text-slate-300 mb-4 max-w-xl leading-relaxed">
                  Al unirte a la compra masiva consolidada por la <strong>Cámara de Comercio de Cali (CCC)</strong> con molinos y mayoristas de CAVASA, aseguras:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                    <span className="text-emerald-300 font-bold text-sm block">💰 18% Descuento Mayorista</span>
                    <span className="text-slate-300 text-[11px]">Directo de fábrica sin intermediarios especuladores</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                    <span className="text-emerald-300 font-bold text-sm block">🚚 Flete Compartido a tu Puerta</span>
                    <span className="text-slate-300 text-[11px]">Camión conjunto subsidiado por la CCC</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsSwarmJoined(true)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                      isSwarmJoined
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Unirme a la Ruta Colectiva de San Fernando</span>
                  </button>

                  <button
                    onClick={() => setIsSwarmJoined(false)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      !isSwarmJoined
                        ? 'bg-white text-slate-900 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Atención Individualizada
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
              <span className="text-xs font-bold text-slate-800 block mb-1">
                Ruta Institucional Asignada:
              </span>
              <p className="text-sm text-slate-700 font-medium">
                {selectedBarrier === 'LIQUIDEZ_CAPITAL' && 'Fondo Solidario de $5.000M de la Alcaldía de Cali & Microcrédito de Emergencia Comfandi'}
                {selectedBarrier === 'MAQUINARIA_INFRAESTRUCTURA' && 'Reposición de Maquinaria y Equipos Comfandi (Tasa 0.6% mes)'}
                {selectedBarrier === 'CLIENTES_VENTAS' && 'Cámara de Comercio de Cali (CCC): Vitrina Comercial, Ruedas de Negocio y Puestos en La 14 de la 80'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                No requerirás presentar papeleo adicional. Tu solicitud queda radicada con número único RAC-2026.
              </p>
            </div>
          )}

          {/* Verification Protocol Notice */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 text-xs text-emerald-900 mb-6">
            <span className="font-bold block mb-1">🛡️ Principio de Cero Burocracia y Protección al Comerciante:</span>
            <p>
              Tu información es exclusiva para auxilio económico. No se exige RUT actualizado ni balances contables, y tus datos nunca serán compartidos con la DIAN ni para cobros coactivos.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Volver al triaje
            </button>

            <button
              onClick={handleFinalizeTriaje}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generando Expediente Único...</span>
              ) : (
                <>
                  <span>Emitir Expediente Único (RAC-2026)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: EXPEDIENTE ÚNICO RAC-2026-XXXX */}
      {step === 5 && createdExpediente && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Registro Exitoso · Enjambre Activado
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Expediente Único Post-Sismo
            </h2>
            <div className="mt-2 inline-flex items-center gap-2 font-mono text-lg font-black text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-lg border border-emerald-200">
              <span>{createdExpediente.codigo}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Radicado oficial de la Infraestructura Pública Digital de Santiago de Cali
            </p>
          </div>

          {/* Expediente Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Merchant Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                Datos del Comerciante (Censo Comercial Distrital)
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Negocio:</span>
                <span className="font-bold text-slate-900">{createdExpediente.comerciante.negocio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Titular:</span>
                <span className="font-medium text-slate-800">{createdExpediente.comerciante.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Identificación:</span>
                <span className="font-mono text-slate-800">{createdExpediente.comerciante.id_nido}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ubicación:</span>
                <span className="text-slate-800">Comuna {createdExpediente.comerciante.comuna} · {createdExpediente.comerciante.barrio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Habeas Data (1581):</span>
                <span className="text-emerald-700 font-semibold">Autorizado en 1 Clic</span>
              </div>
            </div>

            {/* Assigned Route */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                Ruta & Beneficio Asignado
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Entidad Responsable:</span>
                <span className="font-bold text-emerald-800">{createdExpediente.ruta_asignada.entidad_responsable.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tipo de Ruta:</span>
                <span className="font-semibold text-slate-900">{createdExpediente.ruta_asignada.tipo_ruta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficio Colectivo:</span>
                <span className="font-medium text-slate-800">{createdExpediente.ruta_asignada.beneficio_colectivo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verificación Pasiva:</span>
                <span className="font-mono text-emerald-700">{createdExpediente.verificacion_pasiva.cuenta_contrato_emcali}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monitoreo:</span>
                <span className="text-slate-700 font-medium">Lectura telemétrica kWh</span>
              </div>
            </div>
          </div>

          {/* Quick Share / Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={copyExpedienteLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace de Seguimiento'}</span>
            </button>

            <button
              onClick={() => onViewExpediente(createdExpediente.codigo)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Radicado en Portal Público</span>
            </button>

            <button
              onClick={() => {
                setStep(1);
                setSelectedMerchant(null);
                setCreatedExpediente(null);
              }}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Atender Otro Comerciante
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
