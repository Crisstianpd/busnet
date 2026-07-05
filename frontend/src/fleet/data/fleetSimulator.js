// fleetSimulator.js — pure simulation core (no React, no timers, no fetch).
// State flows in, state flows out, so tests can drive it deterministically.
//
// Public API:
//   createFleet(routes, options?) -> { routes, units }
//   stepFleet(state, dtSeconds, options?) -> state
//   detectCheckings(prevState, state, checkpointsByRoute?) -> CheckingEvent[]
//   computeKpis(state, checkingsCount) -> FleetKpis

import { interpolateAlong, polylineLengthMeters } from './geo.js';
import { NAMED_CHECKPOINTS, SEED_UNITS, TOTAL_UNITS, colorForRouteIndex } from './seed.js';

export const CHECKINGS_TODAY_START = 1240;

const CHECKPOINT_SPACING_METERS = 1500;

const STATUS_LABELS = {
  en_ruta: 'En ruta',
  detenido: 'Detenido',
  retraso: 'Retraso',
};

const MIN_SPEED_KMH = 20;
const MAX_SPEED_KMH = 35;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTimeLabel(date) {
  const label = new Intl.DateTimeFormat('es-SV', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  // Normalize Intl's "3:55 a. m." spacing/punctuation to "3:55 a.m.".
  return label.replace(/\s*([ap])\.?\s?m\.?/i, (_, letter) => ` ${letter.toLowerCase()}.m.`);
}

function formatDateLabel(date) {
  // Build manually rather than relying on Intl's locale-default punctuation
  // (which inserts a comma after the weekday) to match "viernes 4 de julio".
  const weekday = new Intl.DateTimeFormat('es-SV', { weekday: 'long' }).format(date);
  const day = new Intl.DateTimeFormat('es-SV', { day: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('es-SV', { month: 'long' }).format(date);

  return `${weekday} ${day} de ${month}`;
}

function buildCheckpoints(route, routeIndex) {
  const lengthMeters = polylineLengthMeters(route.coords);
  const checkpoints = [];

  let distance = CHECKPOINT_SPACING_METERS;
  let n = 1;

  while (distance < lengthMeters) {
    const useNamed = (routeIndex + n) % 3 === 0;
    const name = useNamed
      ? NAMED_CHECKPOINTS[(routeIndex + n) % NAMED_CHECKPOINTS.length]
      : `Punto ${n} · ${route.name || route.route}`;

    checkpoints.push({ name, distanceMeters: distance });
    distance += CHECKPOINT_SPACING_METERS;
    n += 1;
  }

  return checkpoints;
}

// routes = [{ route, name, color, coords: [[lng,lat], ...] }]
export function createFleet(routes, options = {}) {
  const { seedUnits = SEED_UNITS, random = Math.random } = options;

  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error('createFleet requires at least one route with coords');
  }

  const preparedRoutes = routes.map((route, index) => ({
    ...route,
    color: route.color || colorForRouteIndex(index),
    lengthMeters: polylineLengthMeters(route.coords),
    checkpoints: buildCheckpoints(route, index),
  }));

  const units = seedUnits.map((seed, index) => {
    const routeIndex = index % preparedRoutes.length;
    const route = preparedRoutes[routeIndex];
    const lengthMeters = route.lengthMeters || 1;

    // Spread starting offsets around the loop so units don't all bunch up.
    const startRatio = ((index * 0.37) % 1 + random() * 0.05) % 1;
    const distanceMeters = startRatio * lengthMeters;
    const speedKmh = clamp(seed.speedKmh + (random() - 0.5) * 4, MIN_SPEED_KMH, MAX_SPEED_KMH);

    const { position, bearing } = interpolateAlong(route.coords, distanceMeters);

    // Seed laps already completed so far today (3..9) so the operator panel
    // shows believable per-unit vueltas on first render; live wraparound keeps
    // incrementing from here.
    const laps = 3 + Math.floor(random() * 7);

    return {
      id: seed.id,
      route: route.route,
      routeColor: route.color,
      driver: seed.driver,
      status: 'en_ruta',
      statusLabel: STATUS_LABELS.en_ruta,
      laps,
      punctuality: Math.round(seed.punctuality),
      position,
      bearing,
      // internal simulation state (not part of the public FleetUnit contract,
      // but harmless extra fields kept alongside it for the simulator/tests)
      routeIndex,
      distanceMeters,
      speedKmh,
      stopSecondsRemaining: 0,
    };
  });

  // Laps attributed to the rest of the fleet (the units beyond the live-
  // simulated roster) so kpis.lapsToday reads as a whole-fleet figure in the
  // believable ~250–340 range, while still ticking up as live units wrap.
  const restUnits = Math.max(0, TOTAL_UNITS - units.length);
  const baseLaps = restUnits > 0 ? Math.round(restUnits * (2.8 + random() * 0.6)) : 0;

  return { routes: preparedRoutes, units, baseLaps };
}

export function stepFleet(state, dtSeconds, options = {}) {
  const { random = Math.random } = options;

  const units = state.units.map(unit => {
    const route = state.routes[unit.routeIndex];
    const lengthMeters = route.lengthMeters || 1;

    let { status, stopSecondsRemaining, punctuality } = unit;
    const { speedKmh, distanceMeters, laps } = unit;

    if (status === 'detenido') {
      stopSecondsRemaining = Math.max(0, stopSecondsRemaining - dtSeconds);
      if (stopSecondsRemaining <= 0) {
        status = 'en_ruta';
      }
    } else if (random() < 0.004 * dtSeconds) {
      status = 'detenido';
      stopSecondsRemaining = 8 + random() * 12;
    } else if (status === 'retraso') {
      if (random() < 0.01 * dtSeconds) {
        status = 'en_ruta';
      }
    } else if (random() < 0.002 * dtSeconds) {
      status = 'retraso';
    }

    const isMoving = status !== 'detenido';
    const speedMps = (speedKmh * 1000) / 3600;
    const effectiveSpeedMps = status === 'retraso' ? speedMps * 0.6 : speedMps;

    let nextDistance = distanceMeters;
    if (isMoving) {
      nextDistance = distanceMeters + effectiveSpeedMps * dtSeconds;
    }

    let nextLaps = laps;
    if (lengthMeters > 0 && nextDistance >= lengthMeters) {
      nextLaps = laps + Math.floor(nextDistance / lengthMeters);
      nextDistance = nextDistance % lengthMeters;
    }

    const drift = (random() - 0.5) * 1.5;
    const nextPunctuality = clamp(Math.round(punctuality + drift), 0, 100);

    const { position, bearing } = interpolateAlong(route.coords, nextDistance);

    return {
      ...unit,
      status,
      statusLabel: STATUS_LABELS[status],
      stopSecondsRemaining,
      distanceMeters: nextDistance,
      laps: nextLaps,
      punctuality: nextPunctuality,
      position,
      bearing,
    };
  });

  return { ...state, units };
}

// Detects checkpoint crossings between prevState and state. checkpointsByRoute
// is optional — when omitted it's derived from state.routes[*].checkpoints.
export function detectCheckings(prevState, state, checkpointsByRoute) {
  const map =
    checkpointsByRoute ||
    Object.fromEntries(state.routes.map(route => [route.route, route.checkpoints || []]));

  const now = new Date();
  const events = [];

  state.units.forEach((unit, index) => {
    const prevUnit = prevState.units[index];
    if (!prevUnit || prevUnit.id !== unit.id) return;

    const route = state.routes[unit.routeIndex];
    const lengthMeters = route?.lengthMeters || 0;
    const checkpoints = map[unit.route] || [];

    const prevDistance = prevUnit.distanceMeters;
    const currDistance = unit.distanceMeters;
    const wrapped = lengthMeters > 0 && currDistance < prevDistance;

    checkpoints.forEach(cp => {
      const crossed = wrapped
        ? cp.distanceMeters > prevDistance || cp.distanceMeters <= currDistance
        : cp.distanceMeters > prevDistance && cp.distanceMeters <= currDistance;

      if (!crossed) return;

      events.push({
        id: `${unit.id}-${cp.name}-${now.getTime()}-${Math.round(cp.distanceMeters)}`,
        unitId: unit.id,
        route: unit.route,
        routeColor: unit.routeColor,
        checkpointName: cp.name,
        timestamp: now.getTime(),
        timeLabel: formatTimeLabel(now),
      });
    });
  });

  return events;
}

// Builds a synthetic CheckingEvent for a random live unit at one of its route's
// checkpoints. Pure: pass `random`/`now` for deterministic output.
export function syntheticChecking(state, options = {}) {
  const { random = Math.random, now = Date.now() } = options;
  const units = state.units || [];
  if (units.length === 0) return null;

  const unit = units[Math.floor(random() * units.length)];
  const route = state.routes[unit.routeIndex];
  const checkpoints = (route && route.checkpoints) || [];
  const cp = checkpoints.length
    ? checkpoints[Math.floor(random() * checkpoints.length)]
    : { name: `Punto 1 · ${route?.name || unit.route}`, distanceMeters: 0 };

  return {
    id: `${unit.id}-${cp.name}-${now}-${Math.round(cp.distanceMeters)}`,
    unitId: unit.id,
    route: unit.route,
    routeColor: unit.routeColor,
    checkpointName: cp.name,
    timestamp: now,
    timeLabel: formatTimeLabel(new Date(now)),
  };
}

// Pre-fills the checking log with a few recent events (newest first, timestamps
// descending, fresh:false) so the panel isn't empty on load.
export function seedCheckingLog(state, options = {}) {
  const { count = 4, random = Math.random, now = Date.now(), spacingMs = 45000 } = options;
  const events = [];

  for (let i = 0; i < count; i++) {
    const eventNow = now - i * spacingMs - Math.floor(random() * 20000);
    const event = syntheticChecking(state, { random, now: eventNow });
    if (event) events.push({ ...event, fresh: false });
  }

  return events;
}

export function computeKpis(state, checkingsCount) {
  const units = state.units || [];
  const activeUnits = units.filter(u => u.status !== 'detenido').length;
  const baseLaps = state.baseLaps || 0;
  const lapsToday = baseLaps + units.reduce((sum, u) => sum + u.laps, 0);
  const punctuality = units.length
    ? Math.round(units.reduce((sum, u) => sum + u.punctuality, 0) / units.length)
    : 0;

  const now = new Date();

  return {
    activeUnits,
    totalUnits: TOTAL_UNITS,
    lapsToday,
    punctuality,
    checkingsToday: checkingsCount,
    dateLabel: formatDateLabel(now),
    timeLabel: formatTimeLabel(now),
  };
}
