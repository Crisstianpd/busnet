// KpiRow — 4-card grid of top-line fleet KPIs. Guards for a null/undefined
// `kpis` (data may still be loading) by falling back to "—" placeholders.
import { KpiCard } from '../ds';

export default function KpiRow({ kpis }) {
  const activeUnits = kpis?.activeUnits ?? '—';
  const totalUnits = kpis?.totalUnits ?? '—';
  const lapsToday = kpis?.lapsToday ?? '—';
  const punctuality = kpis?.punctuality ?? '—';
  const checkingsToday =
    typeof kpis?.checkingsToday === 'number' ? kpis.checkingsToday.toLocaleString('es') : '—';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 16,
        marginBottom: 24,
      }}
    >
      <KpiCard
        label="Unidades activas"
        value={activeUnits}
        unit={`/ ${totalUnits}`}
        icon="bus"
        delta="+4"
        deltaDirection="up"
      />
      <KpiCard
        label="Vueltas hoy"
        value={lapsToday}
        icon="repeat"
        tone="info"
        delta="+12%"
        deltaDirection="up"
      />
      <KpiCard
        label="Puntualidad"
        value={punctuality}
        unit="%"
        icon="gauge"
        tone="amber"
        delta="-2%"
        deltaDirection="down"
      />
      <KpiCard label="Checkings hoy" value={checkingsToday} icon="check-check" tone="green" />
    </div>
  );
}
