/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GoogleSheetsDatabase } from './components/GoogleSheetsDatabase';
import { ScreenAlcaldia } from './components/screens/ScreenAlcaldia';
import { ScreenCCC } from './components/screens/ScreenCCC';
import { ScreenComfandi } from './components/screens/ScreenComfandi';
import { ScreenInteroperabilidad } from './components/screens/ScreenInteroperabilidad';
import { ScreenP1IngresoWhatsApp } from './components/screens/ScreenP1IngresoWhatsApp';
import { ScreenP2Triaje60s } from './components/screens/ScreenP2Triaje60s';
import { ScreenP3ExpedienteRAC } from './components/screens/ScreenP3ExpedienteRAC';
import { ScreenP4ComprasColectivas } from './components/screens/ScreenP4ComprasColectivas';
import {
  INITIAL_COMERCIANTES_SHEET,
  INITIAL_ENJAMBRES_SHEET,
  INITIAL_ENTIDADES_SLA_SHEET,
  INITIAL_TRACKING_EMCALI_SHEET
} from './data/sheetsData';
import { ComercianteRow, EnjambreRow, EntidadSlaRow, TrackingEmcaliRow } from './types/sheets';

export default function App() {
  // Start on Alcaldia or Sheets for maximum visibility into entity roles
  const [currentTab, setCurrentTab] = useState<string>('alcaldia');

  // Google Sheets Central Database State
  const [comerciantes, setComerciantes] = useState<ComercianteRow[]>(INITIAL_COMERCIANTES_SHEET);
  const [enjambres, setEnjambres] = useState<EnjambreRow[]>(INITIAL_ENJAMBRES_SHEET);
  const [entidadesSla, setEntidadesSla] = useState<EntidadSlaRow[]>(INITIAL_ENTIDADES_SLA_SHEET);
  const [trackingEmcali, setTrackingEmcali] = useState<TrackingEmcaliRow[]>(INITIAL_TRACKING_EMCALI_SHEET);

  // Sync with backend API if available
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await fetch('/api/sheets/all');
        if (res.ok) {
          const data = await res.json();
          if (data.comerciantes) setComerciantes(data.comerciantes);
          if (data.enjambres) setEnjambres(data.enjambres);
          if (data.trackingEmcali) setTrackingEmcali(data.trackingEmcali);
        }
      } catch {
        // Fallback to initial state
      }
    };
    fetchSheets();
  }, []);

  const handleAddComerciante = async (row: ComercianteRow) => {
    setComerciantes(prev => [row, ...prev]);

    // Also add tracking entry
    const newTracking: TrackingEmcaliRow = {
      ID_Expediente: row.ID_Expediente,
      Cuenta_EMCALI: `EE-${Math.floor(100000 + Math.random() * 900000)}-Cali`,
      Consumo_kWh_Base: 380,
      Consumo_kWh_Actual: 80,
      Porcentaje_Reapertura: '21%',
      Ultima_Confirmacion_WA: 'Pendiente Confirmación'
    };
    setTrackingEmcali(prev => [newTracking, ...prev]);

    try {
      await fetch('/api/sheets/comerciantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row)
      });
    } catch {
      // offline support
    }
  };

  const handleUpdateComerciante = (id: string, updates: Partial<ComercianteRow>) => {
    setComerciantes(prev => prev.map(c => c.ID_Expediente === id ? { ...c, ...updates } : c));
  };

  const handleApproveAlivioAlcaldia = (idExpediente: string) => {
    handleUpdateComerciante(idExpediente, {
      Estado_SLA: 'Aprobado Desembolso ($5.000.000 COP)'
    });
  };

  const handleSelectRouteFromTriaje = (routeName: string, entidad: string) => {
    handleUpdateComerciante('RAC-2026-0418', {
      Ruta_Asignada: routeName,
      Entidad_Encargada: entidad
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Header strictly conforming to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Content Area: Individual Dedicated Screen for Each Entity and Step */}
      <main className="flex-1 pb-8">
        {/* ENTIDAD 1: ALCALDÍA DE CALI (Secretaría de Desarrollo Económico) */}
        {currentTab === 'alcaldia' && (
          <ScreenAlcaldia
            comerciantes={comerciantes}
            onApproveAlivio={handleApproveAlivioAlcaldia}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}

        {/* ENTIDAD 2: CÁMARA DE COMERCIO DE CALI (CCC) */}
        {currentTab === 'ccc' && (
          <ScreenCCC
            comerciantes={comerciantes}
            enjambres={enjambres}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}

        {/* ENTIDAD 3: COMFANDI */}
        {currentTab === 'comfandi' && (
          <ScreenComfandi
            comerciantes={comerciantes}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}

        {/* ENTIDAD 4: MESA UNIFICADA DE INTEROPERABILIDAD (RETO-02) */}
        {currentTab === 'interoperabilidad' && (
          <ScreenInteroperabilidad
            comerciantes={comerciantes}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}

        {/* BASE DE DATOS CENTRALIZADA: GOOGLE SHEETS */}
        {currentTab === 'sheets' && (
          <GoogleSheetsDatabase
            comerciantes={comerciantes}
            enjambres={enjambres}
            entidadesSla={entidadesSla}
            trackingEmcali={trackingEmcali}
            onAddComerciante={handleAddComerciante}
            onUpdateComerciante={handleUpdateComerciante}
          />
        )}

        {/* FLUJO COMERCIANTE PASO 1: Ingreso WhatsApp Web (Doña María) */}
        {currentTab === 'paso1_whatsapp' && (
          <ScreenP1IngresoWhatsApp
            onAdvanceToTriage={() => setCurrentTab('paso2_triaje')}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}

        {/* FLUJO COMERCIANTE PASO 2: Triaje 60s Dual Screen */}
        {currentTab === 'paso2_triaje' && (
          <ScreenP2Triaje60s
            onSelectRoute={handleSelectRouteFromTriaje}
            onAdvanceToExpediente={() => setCurrentTab('paso3_expediente')}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
            currentSelectedRoute={comerciantes[0]?.Ruta_Asignada}
          />
        )}

        {/* FLUJO COMERCIANTE PASO 3: Expediente Único RAC-2026 */}
        {currentTab === 'paso3_expediente' && (
          <ScreenP3ExpedienteRAC
            onAdvanceToCompras={() => setCurrentTab('paso4_compras')}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}

        {/* FLUJO COMERCIANTE PASO 4: Compras Colectivas en Enjambre 18% */}
        {currentTab === 'paso4_compras' && (
          <ScreenP4ComprasColectivas
            onAdvanceToDashboard={() => setCurrentTab('alcaldia')}
            onOpenGoogleSheets={() => setCurrentTab('sheets')}
          />
        )}
      </main>
    </div>
  );
}
