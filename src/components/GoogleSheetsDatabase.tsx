import React, { useState } from 'react';
import {
  Table, Sheet, Plus, Download, Filter, Search, ShieldCheck,
  RefreshCw, Check, ArrowRight, Database, ExternalLink, Lock,
  FileSpreadsheet, Undo, Redo, Printer, Percent, DollarSign,
  Grid, AlignLeft, AlignCenter, Bold, Italic, HelpCircle
} from 'lucide-react';
import { ComercianteRow, EnjambreRow, EntidadSlaRow, TrackingEmcaliRow } from '../types/sheets';
import { INITIAL_ENTIDADES_SLA_SHEET } from '../data/sheetsData';

interface GoogleSheetsDatabaseProps {
  comerciantes: ComercianteRow[];
  enjambres: EnjambreRow[];
  entidadesSla?: EntidadSlaRow[];
  trackingEmcali?: TrackingEmcaliRow[];
  onAddComerciante: (row: ComercianteRow) => void;
  onUpdateComerciante: (id: string, updates: Partial<ComercianteRow>) => void;
}

export const GoogleSheetsDatabase: React.FC<GoogleSheetsDatabaseProps> = ({
  comerciantes,
  enjambres,
  entidadesSla = INITIAL_ENTIDADES_SLA_SHEET,
  onAddComerciante,
  onUpdateComerciante
}) => {
  const [activeTab, setActiveTab] = useState<'comerciantes' | 'enjambres' | 'entidadesSla'>('comerciantes');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number; text: string }>({
    row: 1,
    col: 2,
    text: comerciantes[0]?.Nombre_Comerciante || ''
  });
  const [searchFilter, setSearchFilter] = useState('');
  const [showWebhookSimulator, setShowWebhookSimulator] = useState(false);

  // New row form state
  const [newNombre, setNewNombre] = useState('Doña Esperanza - Panadería Alameda');
  const [newBarrio, setNewBarrio] = useState('Alameda - Comuna 9');
  const [newTelefono, setNewTelefono] = useState('+57 317 882 1099');
  const [newRuta, setNewRuta] = useState('Ruta 3: Compras Colectivas en Enjambre (18% Descuento)');

  const handleSimulateWebhook = () => {
    const nextNum = comerciantes.length + 418 + 1;
    const newId = `RAC-2026-${String(nextNum).padStart(4, '0')}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    const row: ComercianteRow = {
      ID_Expediente: newId,
      Fecha_Hora: formattedDate,
      Nombre_Comerciante: newNombre,
      Barrio_Comuna: newBarrio,
      Telefono_WhatsApp: newTelefono,
      Ruta_Asignada: newRuta,
      Estado_SLA: 'Atención Prioritaria (SLA: 24h)',
      Entidad_Encargada: newRuta.includes('Ruta 3') ? 'Cámara de Comercio de Cali (CCC)' : 'Secretaría de Desarrollo Económico',
      Validacion_Ley1581: 'Aprobada (Protegida - Sin DIAN)'
    };

    onAddComerciante(row);
    setShowWebhookSimulator(false);
  };

  const exportCurrentSheetCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'comerciantes') {
      csvContent += 'ID_Expediente,Fecha_Hora,Nombre_Comerciante,Barrio_Comuna,Telefono_WhatsApp,Ruta_Asignada,Estado_SLA,Entidad_Encargada,Validacion_Ley1581\n';
      comerciantes.forEach(r => {
        csvContent += `"${r.ID_Expediente}","${r.Fecha_Hora}","${r.Nombre_Comerciante}","${r.Barrio_Comuna}","${r.Telefono_WhatsApp}","${r.Ruta_Asignada}","${r.Estado_SLA}","${r.Entidad_Encargada}","${r.Validacion_Ley1581}"\n`;
      });
    } else if (activeTab === 'enjambres') {
      csvContent += 'ID_Enjambre,Cuadrante_Zona,Insumo_Requerido,Cantidad_Total,Tenderos_Agrupados,Descuento_Logrado,Mayorista_Asignado,Estado_Entrega\n';
      enjambres.forEach(r => {
        csvContent += `"${r.ID_Enjambre}","${r.Cuadrante_Zona}","${r.Insumo_Requerido}","${r.Cantidad_Total}","${r.Tenderos_Agrupados}","${r.Descuento_Logrado}","${r.Mayorista_Asignado}","${r.Estado_Entrega}"\n`;
      });
    } else {
      csvContent += 'ID_Expediente,Entidad_Encargada,Rol_Institucional,Tiempo_Respuesta_SLA,Estado_Atencion,Accion_Requerida\n';
      entidadesSla.forEach(r => {
        csvContent += `"${r.ID_Expediente}","${r.Entidad_Encargada}","${r.Rol_Institucional}","${r.Tiempo_Respuesta_SLA}","${r.Estado_Atencion}","${r.Accion_Requerida}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeTab}_RAC2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[98%] mx-auto py-4">
      {/* Google Sheets Window Container */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Top Google Sheets Title Bar */}
        <div className="bg-white px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Green Google Sheets Icon */}
            <div className="w-9 h-9 rounded-lg bg-[#0F9D58] flex items-center justify-center text-white shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">
                  Base de Datos Centralizada - Ruta Abierta Cali (RAC-2026) [EXPERT 360]
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Google Sheets No-Code</span>
                </span>
              </div>

              {/* Menu items */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Archivo</span>
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Editar</span>
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Ver</span>
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Insertar</span>
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Formato</span>
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Datos</span>
                <span className="hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer">Herramientas</span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-slate-500 italic flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Dominio alcaldiadecali.gov.co · Ley 1581 (Sin DIAN)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWebhookSimulator(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F9D58] hover:bg-[#0b8043] text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simular Webhook WhatsApp (Twilio/WATI)</span>
            </button>

            <button
              onClick={exportCurrentSheetCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Google Sheets Toolbar */}
        <div className="bg-[#F8F9FA] px-4 py-1.5 border-b border-slate-200 flex flex-wrap items-center gap-2 text-slate-600 text-xs">
          <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
            <button className="p-1 hover:bg-slate-200 rounded" title="Deshacer"><Undo className="w-3.5 h-3.5" /></button>
            <button className="p-1 hover:bg-slate-200 rounded" title="Rehacer"><Redo className="w-3.5 h-3.5" /></button>
            <button className="p-1 hover:bg-slate-200 rounded" title="Imprimir"><Printer className="w-3.5 h-3.5" /></button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-slate-300 font-mono text-[11px]">
            <span className="px-2 py-0.5 bg-white border border-slate-300 rounded font-semibold text-slate-800">100%</span>
            <button className="p-1 hover:bg-slate-200 rounded" title="Moneda"><DollarSign className="w-3.5 h-3.5" /></button>
            <button className="p-1 hover:bg-slate-200 rounded" title="Porcentaje"><Percent className="w-3.5 h-3.5" /></button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
            <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-medium">Plus Jakarta Sans</span>
            <span className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-slate-800">10</span>
            <button className="p-1 hover:bg-slate-200 rounded font-bold" title="Negrita"><Bold className="w-3.5 h-3.5" /></button>
            <button className="p-1 hover:bg-slate-200 rounded italic" title="Cursiva"><Italic className="w-3.5 h-3.5" /></button>
          </div>

          {/* Search inside sheet */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar celda..."
                className="pl-7 pr-3 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F9D58] w-48"
              />
            </div>
          </div>
        </div>

        {/* Formula Bar (fx) */}
        <div className="bg-white px-3 py-1.5 border-b border-slate-200 flex items-center gap-2 text-xs">
          <div className="w-16 text-center font-mono font-bold text-slate-700 bg-slate-100 py-0.5 rounded border border-slate-300">
            {String.fromCharCode(65 + selectedCell.col)}{selectedCell.row + 1}
          </div>
          <span className="font-serif italic font-bold text-slate-400 text-sm px-1">fx</span>
          <div className="flex-1 bg-slate-50 px-3 py-0.5 rounded border border-slate-200 font-mono text-slate-800 text-[11px]">
            {selectedCell.text || '=VLOOKUP(ID_Expediente, Comerciantes_RAC2026, 3, FALSE)'}
          </div>
        </div>

        {/* Spreadsheet Table View */}
        <div className="overflow-x-auto max-h-[520px] bg-slate-100">
          {/* TAB 1: Comerciantes_RAC2026 */}
          {activeTab === 'comerciantes' && (
            <table className="w-full text-xs text-left border-collapse bg-white">
              <thead>
                {/* Column letters A, B, C, D... */}
                <tr className="bg-[#F8F9FA] text-slate-500 font-mono text-[10px] text-center border-b border-slate-300">
                  <th className="w-10 py-1 border-r border-slate-300">#</th>
                  <th className="py-1 border-r border-slate-300">A</th>
                  <th className="py-1 border-r border-slate-300">B</th>
                  <th className="py-1 border-r border-slate-300">C</th>
                  <th className="py-1 border-r border-slate-300">D</th>
                  <th className="py-1 border-r border-slate-300">E</th>
                  <th className="py-1 border-r border-slate-300">F</th>
                  <th className="py-1 border-r border-slate-300">G</th>
                  <th className="py-1 border-r border-slate-300">H</th>
                  <th className="py-1">I</th>
                </tr>
                {/* Official Column Headers */}
                <tr className="bg-[#E8F0FE] text-slate-800 font-bold border-b-2 border-slate-300 text-[11px]">
                  <th className="w-10 py-2 text-center bg-slate-200 text-slate-600 border-r border-slate-300">1</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">ID_Expediente</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Fecha_Hora</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Nombre_Comerciante</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Barrio_Comuna</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Telefono_WhatsApp</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Ruta_Asignada</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Estado_SLA</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Entidad_Encargada</th>
                  <th className="py-2 px-3 whitespace-nowrap">Validacion_Ley1581</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {comerciantes
                  .filter(r =>
                    !searchFilter ||
                    Object.values(r).some(v => String(v).toLowerCase().includes(searchFilter.toLowerCase()))
                  )
                  .map((row, idx) => (
                    <tr
                      key={row.ID_Expediente}
                      className="hover:bg-emerald-50/40 transition-colors"
                    >
                      <td className="py-2 text-center font-mono text-[10px] bg-[#F8F9FA] text-slate-500 border-r border-slate-300 font-semibold">
                        {idx + 2}
                      </td>

                      {/* ID_Expediente */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 0, text: row.ID_Expediente })}
                        className="py-2 px-3 font-mono font-bold text-emerald-800 border-r border-slate-200 cursor-cell whitespace-nowrap"
                      >
                        {row.ID_Expediente}
                      </td>

                      {/* Fecha_Hora */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 1, text: row.Fecha_Hora })}
                        className="py-2 px-3 font-mono text-slate-600 border-r border-slate-200 cursor-cell whitespace-nowrap text-[11px]"
                      >
                        {row.Fecha_Hora}
                      </td>

                      {/* Nombre_Comerciante */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 2, text: row.Nombre_Comerciante })}
                        className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200 cursor-cell whitespace-nowrap"
                      >
                        {row.Nombre_Comerciante}
                      </td>

                      {/* Barrio_Comuna */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 3, text: row.Barrio_Comuna })}
                        className="py-2 px-3 border-r border-slate-200 cursor-cell whitespace-nowrap"
                      >
                        {row.Barrio_Comuna}
                      </td>

                      {/* Telefono_WhatsApp */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 4, text: row.Telefono_WhatsApp })}
                        className="py-2 px-3 font-mono text-slate-600 border-r border-slate-200 cursor-cell whitespace-nowrap text-[11px]"
                      >
                        {row.Telefono_WhatsApp}
                      </td>

                      {/* Ruta_Asignada */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 5, text: row.Ruta_Asignada })}
                        className="py-2 px-3 border-r border-slate-200 cursor-cell"
                      >
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap block ${
                          row.Ruta_Asignada.includes('Ruta 3')
                            ? 'bg-purple-100 text-purple-900'
                            : row.Ruta_Asignada.includes('Ruta 1')
                            ? 'bg-blue-100 text-blue-900'
                            : row.Ruta_Asignada.includes('Ruta 2')
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {row.Ruta_Asignada}
                        </span>
                      </td>

                      {/* Estado_SLA */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 6, text: row.Estado_SLA })}
                        className="py-2 px-3 border-r border-slate-200 cursor-cell whitespace-nowrap"
                      >
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          {row.Estado_SLA}
                        </span>
                      </td>

                      {/* Entidad_Encargada */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 7, text: row.Entidad_Encargada })}
                        className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-200 cursor-cell whitespace-nowrap"
                      >
                        {row.Entidad_Encargada}
                      </td>

                      {/* Validacion_Ley1581 */}
                      <td
                        onClick={() => setSelectedCell({ row: idx + 1, col: 8, text: row.Validacion_Ley1581 })}
                        className="py-2 px-3 font-medium text-emerald-700 cursor-cell whitespace-nowrap text-[11px]"
                      >
                        <span className="flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{row.Validacion_Ley1581}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: Enjambres_Insumos */}
          {activeTab === 'enjambres' && (
            <table className="w-full text-xs text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-500 font-mono text-[10px] text-center border-b border-slate-300">
                  <th className="w-10 py-1 border-r border-slate-300">#</th>
                  <th className="py-1 border-r border-slate-300">A</th>
                  <th className="py-1 border-r border-slate-300">B</th>
                  <th className="py-1 border-r border-slate-300">C</th>
                  <th className="py-1 border-r border-slate-300">D</th>
                  <th className="py-1 border-r border-slate-300">E</th>
                  <th className="py-1 border-r border-slate-300">F</th>
                  <th className="py-1 border-r border-slate-300">G</th>
                  <th className="py-1">H</th>
                </tr>
                <tr className="bg-[#E8F0FE] text-slate-800 font-bold border-b-2 border-slate-300 text-[11px]">
                  <th className="w-10 py-2 text-center bg-slate-200 text-slate-600 border-r border-slate-300">1</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">ID_Enjambre</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Cuadrante_Zona</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Insumo_Requerido</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Cantidad_Total</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Tenderos_Agrupados</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Descuento_Logrado (%)</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Mayorista_Asignado</th>
                  <th className="py-2 px-3 whitespace-nowrap">Estado_Entrega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {enjambres.map((row, idx) => (
                  <tr key={row.ID_Enjambre} className="hover:bg-purple-50/40">
                    <td className="py-2 text-center font-mono text-[10px] bg-[#F8F9FA] text-slate-500 border-r border-slate-300 font-semibold">
                      {idx + 2}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-purple-900 border-r border-slate-200">{row.ID_Enjambre}</td>
                    <td className="py-2 px-3 font-medium text-slate-900 border-r border-slate-200">{row.Cuadrante_Zona}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{row.Insumo_Requerido}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-800 border-r border-slate-200">{row.Cantidad_Total}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{row.Tenderos_Agrupados}</td>
                    <td className="py-2 px-3 font-bold text-emerald-700 bg-emerald-50/80 border-r border-slate-200 text-center">
                      {row.Descuento_Logrado}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">{row.Mayorista_Asignado}</td>
                    <td className="py-2 px-3 font-bold text-blue-800 bg-blue-50/60">{row.Estado_Entrega}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: Monitoreo_SLA_Entidades */}
          {activeTab === 'entidadesSla' && (
            <table className="w-full text-xs text-left border-collapse bg-white">
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-500 font-mono text-[10px] text-center border-b border-slate-300">
                  <th className="w-10 py-1 border-r border-slate-300">#</th>
                  <th className="py-1 border-r border-slate-300">A</th>
                  <th className="py-1 border-r border-slate-300">B</th>
                  <th className="py-1 border-r border-slate-300">C</th>
                  <th className="py-1 border-r border-slate-300">D</th>
                  <th className="py-1 border-r border-slate-300">E</th>
                  <th className="py-1">F</th>
                </tr>
                <tr className="bg-[#E8F0FE] text-slate-800 font-bold border-b-2 border-slate-300 text-[11px]">
                  <th className="w-10 py-2 text-center bg-slate-200 text-slate-600 border-r border-slate-300">1</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">ID_Expediente</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Entidad_Encargada</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Rol_Institucional</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Tiempo_Respuesta_SLA</th>
                  <th className="py-2 px-3 border-r border-slate-300 whitespace-nowrap">Estado_Atencion</th>
                  <th className="py-2 px-3 whitespace-nowrap">Accion_Requerida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {entidadesSla.map((row, idx) => (
                  <tr key={row.ID_Expediente} className="hover:bg-emerald-50/40">
                    <td className="py-2 text-center font-mono text-[10px] bg-[#F8F9FA] text-slate-500 border-r border-slate-300 font-semibold">
                      {idx + 2}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-800 border-r border-slate-200">{row.ID_Expediente}</td>
                    <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        row.Entidad_Encargada.includes('Alcaldía')
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.Entidad_Encargada.includes('Cámara')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.Entidad_Encargada}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-700 border-r border-slate-200 font-medium">{row.Rol_Institucional}</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700 border-r border-slate-200">{row.Tiempo_Respuesta_SLA}</td>
                    <td className="py-2 px-3 font-bold text-slate-800 bg-slate-50/80 border-r border-slate-200">{row.Estado_Atencion}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{row.Accion_Requerida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Google Sheets Tabs Bar */}
        <div className="bg-[#F8F9FA] px-2 py-1 border-t border-slate-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('comerciantes')}
              className={`px-3 py-1.5 font-bold rounded-t-md transition-colors flex items-center gap-1.5 border-b-2 ${
                activeTab === 'comerciantes'
                  ? 'bg-white text-slate-900 border-[#0F9D58] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 border-transparent'
              }`}
            >
              <span>📑 Comerciantes_RAC2026</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {comerciantes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('enjambres')}
              className={`px-3 py-1.5 font-bold rounded-t-md transition-colors flex items-center gap-1.5 border-b-2 ${
                activeTab === 'enjambres'
                  ? 'bg-white text-slate-900 border-[#0F9D58] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 border-transparent'
              }`}
            >
              <span>📑 Enjambres_Insumos</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {enjambres.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('entidadesSla')}
              className={`px-3 py-1.5 font-bold rounded-t-md transition-colors flex items-center gap-1.5 border-b-2 ${
                activeTab === 'entidadesSla'
                  ? 'bg-white text-slate-900 border-[#0F9D58] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 border-transparent'
              }`}
            >
              <span>📑 Monitoreo_SLA_Entidades</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {entidadesSla.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-2">
            <span>Sincronización interinstitucional en tiempo real</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Simulator Modal for inserting new row directly */}
      {showWebhookSimulator && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0F9D58]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Simular Entrada Webhook WhatsApp → Inserción Google Sheets
                </h3>
              </div>
              <button
                onClick={() => setShowWebhookSimulator(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              En producción, este endpoint de Google Apps Script recibe el JSON de Twilio o WATI cuando el tendero escribe al bot, e inserta una nueva fila en <strong>Comerciantes_RAC2026</strong> en milisegundos.
            </p>

            <div className="space-y-3 text-xs mb-6">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre Comerciante</label>
                <input
                  type="text"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Barrio y Comuna</label>
                <input
                  type="text"
                  value={newBarrio}
                  onChange={(e) => setNewBarrio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Teléfono WhatsApp</label>
                <input
                  type="text"
                  value={newTelefono}
                  onChange={(e) => setNewTelefono(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ruta Asignada</label>
                <select
                  value={newRuta}
                  onChange={(e) => setNewRuta(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  <option value="Ruta 3: Compras Colectivas en Enjambre (18% Descuento)">Ruta 3: Compras Colectivas en Enjambre (18% Descuento)</option>
                  <option value="Ruta 1: Liquidez y Fondo Solidario">Ruta 1: Liquidez y Fondo Solidario ($5.000M)</option>
                  <option value="Ruta 2: Maquinaria e Infraestructura">Ruta 2: Maquinaria e Infraestructura (Comfandi)</option>
                  <option value="Ruta 4: Clientes y Visibilidad (Cámara de Comercio - CCC)">Ruta 4: Clientes y Visibilidad (Cámara de Comercio - CCC)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowWebhookSimulator(false)}
                className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSimulateWebhook}
                className="px-4 py-2 bg-[#0F9D58] hover:bg-[#0b8043] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Insertar Fila en Hoja Central
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
