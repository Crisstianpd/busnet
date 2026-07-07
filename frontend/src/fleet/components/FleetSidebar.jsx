// FleetSidebar — fixed 240px navigation rail for the Fleet dashboard.
// Wordmark + amber "FLEET" eyebrow, static nav (Resumen active), operator card.
import { Icon } from '../ds';
import badge from '@ds/assets/logo/busnet-badge.svg';

const NAV_ITEMS = [
  { icon: 'gauge', label: 'Resumen', active: true },
  { icon: 'bus', label: 'Unidades', active: false },
  { icon: 'check-check', label: 'Checking', active: false },
  { icon: 'route', label: 'Rutas', active: false },
  { icon: 'activity', label: 'Reportes', active: false },
];

export default function FleetSidebar({ operator }) {
  const name = operator?.name ?? 'Operador';
  const plan = operator?.plan ?? '';

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--hairline)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 20px' }}>
        <img src={badge} alt="" style={{ width: 34, borderRadius: 10 }} />
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Bus<span style={{ color: 'var(--busnet-green)' }}>NET</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.04em' }}>
            FLEET
          </div>
        </div>
      </div>

      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 12px',
            borderRadius: 'var(--radius-md)',
            color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: item.active ? 'var(--state-selected)' : 'transparent',
            fontWeight: item.active ? 700 : 500,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          <Icon
            name={item.icon}
            size={19}
            style={{ color: item.active ? 'var(--busnet-green)' : 'var(--text-tertiary)' }}
          />
          {item.label}
        </div>
      ))}

      <div
        style={{
          marginTop: 'auto',
          padding: 14,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-raised)',
          border: '1px solid var(--hairline)',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{plan}</div>
      </div>
    </aside>
  );
}
