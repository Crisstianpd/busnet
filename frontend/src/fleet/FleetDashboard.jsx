// BusNET Fleet — desktop control panel for transport operators (B2B moat surface).
// Composition owned by the orchestrator (brain). Data comes from useFleetData
// (client-side simulator over real route GeoJSONs); presentational pieces live in
// ./components. Everything styled from the design system tokens (@ds).
//
// ── DATA CONTRACT (shared with ./data) ────────────────────────────────────────
// useFleetData() -> {
//   units: FleetUnit[], checkingLog: CheckingEvent[], kpis: FleetKpis, loading: boolean
// }
// FleetUnit = {
//   id: string,            // placa, e.g. "P-482-AB"
//   route: string,         // route number, e.g. "30B"
//   routeColor: string,    // CSS color, e.g. "var(--route-1)" or hex
//   driver: string,        // "José Martínez"
//   status: "en_ruta" | "detenido" | "retraso",
//   statusLabel: string,   // "En ruta" | "Detenido" | "Retraso"
//   laps: number,          // vueltas hoy
//   punctuality: number,   // 0..100
//   position: { lng: number, lat: number },
//   bearing: number,       // 0..360, for BusMarker rotation
// }
// CheckingEvent = {
//   id: string, unitId: string, route: string, routeColor: string,
//   checkpointName: string, timestamp: number, timeLabel: string, fresh?: boolean,
// }
// FleetKpis = {
//   activeUnits: number, totalUnits: number, lapsToday: number,
//   punctuality: number, checkingsToday: number, dateLabel: string, timeLabel: string,
// }
// ──────────────────────────────────────────────────────────────────────────────

import { useFleetData } from './data/useFleetData';
import FleetSidebar from './components/FleetSidebar';
import FleetHeader from './components/FleetHeader';
import KpiRow from './components/KpiRow';
import LiveUnitsTable from './components/LiveUnitsTable';
import CheckingLog from './components/CheckingLog';
import FleetMiniMap from './components/FleetMiniMap';

export default function FleetDashboard() {
  const { units, checkingLog, kpis, loading } = useFleetData();

  return (
    <div className="fleet-app">
      <FleetSidebar
        operator={{ name: 'Ruta 30 S.A. de C.V.', plan: 'Plan Flota · 80 unidades' }}
      />
      <main className="fleet-main">
        <FleetHeader kpis={kpis} />
        <KpiRow kpis={kpis} />
        <div className="fleet-grid">
          <LiveUnitsTable units={units} loading={loading} />
          <div className="fleet-right">
            <FleetMiniMap units={units} />
            <CheckingLog events={checkingLog} />
          </div>
        </div>
      </main>
    </div>
  );
}
