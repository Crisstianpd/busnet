// LiveUnitsTable — section card listing every unit currently on the road.
// Guards for `units` being undefined/empty while `loading` is true.
import { Badge, TableRow } from '../ds';

const COLUMNS = '132px 70px 1fr 130px 74px 96px';
const HEAD_CELLS = ['Unidad', 'Ruta', 'Motorista', 'Estado', 'Vueltas', 'Puntual.'];

const STATUS_VARIANT = {
  en_ruta: 'success',
  detenido: 'neutral',
  retraso: 'warning',
};

const STATUS_ICON = {
  en_ruta: 'check',
  detenido: undefined,
  retraso: 'triangle-alert',
};

export default function LiveUnitsTable({ units, loading }) {
  const list = units ?? [];

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 18px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}
        >
          Unidades en vivo
        </h2>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{list.length} en ruta</span>
      </div>

      <TableRow head columns={COLUMNS} cells={HEAD_CELLS} />

      {list.length === 0 && loading && (
        <div style={{ padding: '24px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Cargando unidades…
        </div>
      )}

      {list.map((u) => {
        const variant = STATUS_VARIANT[u.status] ?? 'neutral';
        const icon = STATUS_ICON[u.status];
        return (
          <TableRow
            key={u.id}
            columns={COLUMNS}
            cells={[
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--text-primary)',
                }}
              >
                {u.id}
              </span>,
              <Badge variant="route" color={u.routeColor}>
                {u.route}
              </Badge>,
              u.driver,
              <Badge variant={variant} icon={icon}>
                {u.statusLabel}
              </Badge>,
              <span style={{ fontWeight: 700 }}>{u.laps}</span>,
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {u.punctuality}%
              </span>,
            ]}
          />
        );
      })}
    </section>
  );
}
