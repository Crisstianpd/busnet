// FleetHeader — page title + live badge + export action.
// Guards against `kpis` being null/undefined while data is still loading.
import { Badge, Icon } from '../ds';

export default function FleetHeader({ kpis }) {
  const dateLabel = kpis?.dateLabel ?? '—';
  const timeLabel = kpis?.timeLabel ?? '—';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          Resumen operativo
        </h1>
        <div style={{ marginTop: 4, fontSize: 14, color: 'var(--text-secondary)' }}>
          {dateLabel} · {timeLabel}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Badge variant="live">En vivo</Badge>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 42,
            padding: '0 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-raised)',
            border: '1px solid var(--hairline)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Icon name="activity" size={17} /> Exportar reporte
        </button>
      </div>
    </div>
  );
}
