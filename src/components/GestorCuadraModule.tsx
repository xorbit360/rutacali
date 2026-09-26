import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, UserCheck, ShieldAlert, CheckCircle2, PenTool,
  RotateCcw, Sparkles, Navigation, Smartphone, Building
} from 'lucide-react';
import { ExpedienteRAC, BarreraCritica } from '../types/govtech';

interface GestorCuadraModuleProps {
  onExpedienteCreated: (exp: ExpedienteRAC) => void;
  onViewExpediente: (codigo: string) => void;
}

export const GestorCuadraModule: React.FC<GestorCuadraModuleProps> = ({
  onExpedienteCreated,
  onViewExpediente
}) => {
  const [gestorId] = useState('GEST-C19-ALCALDIA-084');
  const [gestorNombre] = useState('Julián Andrés Caicedo (Gestor Territorial Comuna 19)');

  // Form state
  const [nombreTitular, setNombreTitular] = useState('Luz Mery Bermúdez');
  const [cedula, setCedula] = useState('CC-38291044');
  const [nombreNegocio, setNombreNegocio] = useState('Frutería & Jugos El Samán');
  const [tipoPuesto, setTipoPuesto] = useState('CASETA_POPULAR'); // FORMAL, CASETA_POPULAR, AMBULANTE_FIJO
  const [comuna, setComuna] = useState<number>(19);
  const [barrio, setBarrio] = useState('San Fernando');
  const [direccionExacta, setDireccionExacta] = useState('Calle 5ta con Carrera 36 (Frente al Parque)');
  const [coordenadasGps, setCoordenadasGps] = useState('3.4285° N, 76.5412° W (Cali)');
  const [barrera, setBarrera] = useState<BarreraCritica>('INSUMOS_MATERIA_PRIMA');
  const [motivoAsistencia, setMotivoAsistencia] = useState('ADULTO_MAYOR_SIN_SMARTPHONE');
  const [observaciones, setObservaciones] = useState('Comerciante tradicional de 68 años sin teléfono inteligente. Pérdida de pulpa y cadena de frío por corte eléctrico.');

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Success state
  const [lastRadicado, setLastRadicado] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const simulateGpsLocation = () => {
    const lat = (3.42 + Math.random() * 0.05).toFixed(4);
    const lng = (-76.53 - Math.random() * 0.03).toFixed(4);
    setCoordenadasGps(`${lat}° N, ${lng}° W (Santiago de Cali)`);
  };

  const handleRegisterInField = async () => {
    if (!nombreTitular || !nombreNegocio) return;
    setIsSubmitting(true);

    const radCode = `RAC-2026-${Math.floor(2000 + Math.random() * 7000)}`;

    const newExp: ExpedienteRAC = {
      codigo: radCode,
      fecha_registro: new Date().toISOString(),
      comerciante: {
        id_nido: cedula,
        nombre: nombreTitular,
        negocio: nombreNegocio,
        comuna,
        barrio,
        direccion: direccionExacta,
        formal: tipoPuesto === 'FORMAL'
      },
      triaje: {
        barrera_principal: barrera,
        descripcion: `[Registro de Campo Gestor ${gestorId}] ${observaciones}`,
        metodo_registro: 'GESTOR_CUADRA_CAMPO',
        habeas_data_autorizado: true,
        gestor_nombre: gestorNombre,
        firma_verificada: hasSignature
      },
      ruta_asignada: {
        tipo_ruta: barrera === 'INSUMOS_MATERIA_PRIMA' ? 'RUTA_COLECTIVA_ENJAMBRE' : 'ATENCION_INDIVIDUAL',
        corredor_comercial: `CORREDOR_${barrio.toUpperCase()}_C${comuna}`,
        entidad_responsable: barrera === 'INSUMOS_MATERIA_PRIMA' ? 'CAMARA_COMERCIO_CALI' : 'ALCALDIA_CALI_DATIC',
        beneficio_colectivo: barrera === 'INSUMOS_MATERIA_PRIMA' ? '18% Descuento Mayorista + Flete Compartido' : 'Subsidio Distrital de Emergencia'
      },
      verificacion_pasiva: {
        metodo: 'CHECKIN_SEDE_TEMPORAL',
        cuenta_contrato_emcali: `EE-${Math.floor(100000 + Math.random() * 900000)}-Cali`,
        kwh_base: 180,
        kwh_actual: 30,
        porcentaje_recuperacion: 16.6,
        estado_reapertura: 'EN_PROCESO',
        ultima_lectura: new Date().toISOString()
      },
      beneficio_financiero: {
        fuente: 'ALCALDIA_CALI_DATIC',
        monto_estimado_ahorro: 1200000,
        aprobado: true
      }
    };

    try {
      await fetch('/api/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
    } catch {
      // offline support
    }

    onExpedienteCreated(newExp);
    setLastRadicado(radCode);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Module Title */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>DISPOSITIVO MÓVIL DE ATENCIÓN TERRITORIAL</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              App Gestor de Cuadra (Atención en Calle)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Diseñado para brigadas de la Alcaldía de Cali en campo: registro asistido para adultos mayores, comerciantes informales y puestos de economía popular sin smartphone.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15 text-xs shrink-0">
            <span className="text-slate-400 block text-[10px]">Gestor Activo</span>
            <span className="font-bold text-white block">{gestorNombre}</span>
            <span className="font-mono text-emerald-300 text-[11px] block">{gestorId}</span>
          </div>
        </div>
      </div>

      {lastRadicado ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Registro en Calle Completado
          </span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Constancia Comunitaria Emitida
          </h2>
          <div className="font-mono text-xl font-black text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 inline-block mb-3">
            {lastRadicado}
          </div>
          <p className="text-xs text-slate-600 mb-6">
            Se ha vinculado la firma comunitaria y las coordenadas GPS del puesto. El comerciante recibirá notificación por SMS y no requerirá hacer filas en ventanilla.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onViewExpediente(lastRadicado)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Ver Radicado en Portal
            </button>
            <button
              onClick={() => {
                setLastRadicado(null);
                clearCanvas();
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Registrar Siguiente Puesto
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Section 1: Merchant Details */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                1. Datos del Comerciante / Titular en Terreno
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nombre Completo del Titular</label>
                <input
                  type="text"
                  value={nombreTitular}
                  onChange={(e) => setNombreTitular(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Cédula de Ciudadanía (CC) o Identificación</label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nombre del Establecimiento o Puesto</label>
                <input
                  type="text"
                  value={nombreNegocio}
                  onChange={(e) => setNombreNegocio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tipo de Puesto Comercial</label>
                <select
                  value={tipoPuesto}
                  onChange={(e) => setTipoPuesto(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="CASETA_POPULAR">Caseta Popular / Puesto Fijo Callejero</option>
                  <option value="FORMAL">Local Comercial Tradicional</option>
                  <option value="AMBULANTE_POPULAR">Vendedor Ambulante / Carretilla Popular</option>
                  <option value="GALERIA_MERCADO">Módulo en Plaza de Mercado (Alameda, Siloé, Santa Elena)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: GPS & Territorial Location */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  2. Geolocalización del Punto de Venta
                </h2>
              </div>
              <button
                type="button"
                onClick={simulateGpsLocation}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Capturar Coordenadas GPS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Comuna</label>
                <input
                  type="number"
                  value={comuna}
                  onChange={(e) => setComuna(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Barrio / Corredor</label>
                <input
                  type="text"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Coordenadas de Referencia</label>
                <input
                  type="text"
                  readOnly
                  value={coordenadasGps}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-slate-600 font-semibold text-xs mb-1">Dirección Exacta o Hito Urbano</label>
              <input
                type="text"
                value={direccionExacta}
                onChange={(e) => setDireccionExacta(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          {/* Section 3: Field Triage & Reason */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                3. Triaje In-Situ y Justificación Comunitaria
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Barrera Principal Detectada</label>
                <select
                  value={barrera}
                  onChange={(e) => setBarrera(e.target.value as BarreraCritica)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="INSUMOS_MATERIA_PRIMA">Insumos / Materia Prima (Ruta Colectiva CCC 18%)</option>
                  <option value="LIQUIDEZ_CAPITAL">Liquidez / Capital (Fondo $5.000M Alcaldía)</option>
                  <option value="MAQUINARIA_INFRAESTRUCTURA">Maquinaria / Daños Físicos en Caseta</option>
                  <option value="CLIENTES_VENTAS">Clientes / Vía Afectada (Vitrina Comercial CCC / La 14 de la 80)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Criterio de Inclusión Asistida</label>
                <select
                  value={motivoAsistencia}
                  onChange={(e) => setMotivoAsistencia(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="ADULTO_MAYOR_SIN_SMARTPHONE">Adulto Mayor / Sin Dispositivo Inteligente</option>
                  <option value="BARRERA_CONECTIVIDAD">Sin Conectividad Móvil en el Corredor</option>
                  <option value="ECONOMIA_POPULAR_NO_BANCARIZADA">Economía Popular No Bancarizada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold text-xs mb-1">Observaciones del Gestor Territorial</label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Section 4: Signature Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  4. Firma de Declaración de Veracidad Comunitaria
                </h2>
              </div>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Borrar Firma</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              El comerciante o testigo de cuadra firma en la pantalla certificando la veracidad de la afectación física o económica post-sismo.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={700}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                  Firmar aquí con el dedo o puntero táctil
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={handleRegisterInField}
              disabled={isSubmitting || !nombreTitular || !nombreNegocio}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando en Campo...' : 'Radicar Constancia y Generar Expediente'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
