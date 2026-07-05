// FleetMiniMap — compact night map with decorative streets/route paths and
// live BusMarker overlays. Marker positions are normalized from each unit's
// {lng,lat} into the container's bounding box so they spread out and move
// as positions update each tick. Guards for missing/empty positions.
import { Badge, BusMarker } from '../ds';

const STREETS = [
  'M-10,60 L420,90',
  'M-10,150 L420,130',
  'M-10,220 L420,240',
  'M60,-10 L50,300',
  'M170,-10 L185,300',
  'M300,-10 L290,300',
];

const MAP_W = 400;
const MAP_H = 260;
const PADDING = 36;
const MAX_MARKERS = 6;

function computeBounds(points) {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const p of points) {
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
  }
  // Avoid degenerate (zero-size) bounds when all units share a position.
  if (minLng === maxLng) {
    minLng -= 0.001;
    maxLng += 0.001;
  }
  if (minLat === maxLat) {
    minLat -= 0.001;
    maxLat += 0.001;
  }
  return { minLng, maxLng, minLat, maxLat };
}

export default function FleetMiniMap({ units }) {
  const withPosition = (units ?? []).filter((u) => u?.position && Number.isFinite(u.position.lng) && Number.isFinite(u.position.lat));
  const shown = withPosition.slice(0, MAX_MARKERS);
  const bounds = shown.length > 0 ? computeBounds(shown.map((u) => u.position)) : null;

  return (
    <div
      style={{
        position: 'relative',
        height: 260,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--hairline)',
        background: 'radial-gradient(120% 90% at 60% 10%, #14203a, #0B1220 65%)',
      }}
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        {STREETS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1c2740" strokeWidth={i < 3 ? 6 : 3} strokeLinecap="round" />
        ))}
        <path
          d="M30,220 C120,180 180,240 260,180 S360,120 400,150"
          fill="none"
          stroke="var(--route-1)"
          strokeWidth="4"
          opacity="0.9"
          strokeLinecap="round"
        />
        <path
          d="M20,80 C120,120 200,60 300,110"
          fill="none"
          stroke="var(--route-6)"
          strokeWidth="4"
          opacity="0.9"
          strokeLinecap="round"
        />
      </svg>

      {bounds &&
        shown.map((u) => {
          const nx = (u.position.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
          // Screen y grows downward; lat grows northward, so flip.
          const ny = 1 - (u.position.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
          const left = PADDING + nx * (MAP_W - PADDING * 2);
          const top = PADDING + ny * (MAP_H - PADDING * 2);
          return (
            <div
              key={u.id}
              style={{
                position: 'absolute',
                left: `${(left / MAP_W) * 100}%`,
                top: `${(top / MAP_H) * 100}%`,
                transform: 'translate(-50%,-50%)',
                transition: 'left 1s linear, top 1s linear',
              }}
            >
              <BusMarker route={u.route} color={u.routeColor} bearing={u.bearing} size={30} state="moving" />
            </div>
          );
        })}

      <span style={{ position: 'absolute', top: 12, left: 12 }}>
        <Badge variant="live">En vivo</Badge>
      </span>
    </div>
  );
}
