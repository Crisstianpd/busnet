// geo.js — pure geometry math over GeoJSON-style [lng, lat] coordinate pairs.
// No external dependencies (no @turf): haversine distance, polyline length,
// and along-line interpolation with bearing, implemented by hand so the
// fleet simulator can walk real route polylines without a mapping library.

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

// Great-circle distance between two [lng, lat] points, in meters.
export function haversineMeters(a, b) {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const dPhi = toRadians(lat2 - lat1);
  const dLambda = toRadians(lng2 - lng1);

  const sinDPhi = Math.sin(dPhi / 2);
  const sinDLambda = Math.sin(dLambda / 2);

  const h =
    sinDPhi * sinDPhi +
    Math.cos(phi1) * Math.cos(phi2) * sinDLambda * sinDLambda;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));

  return EARTH_RADIUS_METERS * c;
}

// Initial bearing (degrees, 0..360, 0 = north) from point a to point b.
export function bearingDegrees(a, b) {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const dLambda = toRadians(lng2 - lng1);

  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);

  const theta = Math.atan2(y, x);

  return (toDegrees(theta) + 360) % 360;
}

// Total length of a polyline (array of [lng, lat] pairs), in meters.
export function polylineLengthMeters(coords) {
  if (!Array.isArray(coords) || coords.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineMeters(coords[i - 1], coords[i]);
  }
  return total;
}

// Walks the polyline to the given distance (meters) and returns the
// interpolated position plus the bearing of the segment it landed on.
// Distances beyond the polyline's length clamp to the final point.
export function interpolateAlong(coords, meters) {
  if (!Array.isArray(coords) || coords.length === 0) {
    return { position: { lng: 0, lat: 0 }, bearing: 0 };
  }

  if (coords.length === 1) {
    const [lng, lat] = coords[0];
    return { position: { lng, lat }, bearing: 0 };
  }

  const target = Math.max(0, meters);
  let remaining = target;

  for (let i = 1; i < coords.length; i++) {
    const start = coords[i - 1];
    const end = coords[i];
    const segmentLength = haversineMeters(start, end);
    const isLastSegment = i === coords.length - 1;

    if (remaining <= segmentLength || isLastSegment) {
      const ratio =
        segmentLength === 0 ? 0 : Math.min(1, Math.max(0, remaining / segmentLength));
      const lng = start[0] + (end[0] - start[0]) * ratio;
      const lat = start[1] + (end[1] - start[1]) * ratio;
      const bearing = bearingDegrees(start, end);

      return { position: { lng, lat }, bearing };
    }

    remaining -= segmentLength;
  }

  const [lng, lat] = coords[coords.length - 1];
  return { position: { lng, lat }, bearing: 0 };
}
