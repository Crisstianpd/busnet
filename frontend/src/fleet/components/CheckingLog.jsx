// CheckingLog — real-time feed of digital checking events (the pitch climax).
// Freshly-arrived events pass `entering` through to TableRow for the flash-in.
import { Badge, Icon, TableRow } from '../ds';

export default function CheckingLog({ events }) {
  const list = events ?? [];

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="check-check" size={18} style={{ color: 'var(--busnet-green)' }} />
        <h2
          style={{
            margin: 0,
            flex: 1,
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}
        >
          Checking digital
        </h2>
        <Badge variant="live">Vivo</Badge>
      </div>

      <div style={{ maxHeight: 320, overflow: 'hidden' }}>
        {list.length === 0 && (
          <div style={{ padding: '24px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>
            Esperando checkings…
          </div>
        )}
        {list.map((e, i) => (
          <TableRow
            key={`${e.id ?? `${e.unitId}-${e.timestamp}`}-${i}`}
            entering={e.fresh}
            columns="60px 1fr 88px"
            cells={[
              <Badge variant="route" color={e.routeColor} size="sm">
                {e.route}
              </Badge>,
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {e.unitId}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {e.checkpointName}
                </div>
              </div>,
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)' }}>
                {e.timeLabel}
              </span>,
            ]}
          />
        ))}
      </div>
    </section>
  );
}
