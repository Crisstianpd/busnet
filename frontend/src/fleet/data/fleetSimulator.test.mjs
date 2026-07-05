// fleetSimulator.test.mjs — node --test, ESM, no fetch/timers. Drives the
// pure simulator core with synthetic routes and a seeded PRNG so results are
// fast and deterministic.

import test from 'node:test';
import assert from 'node:assert/strict';

import { haversineMeters, interpolateAlong, polylineLengthMeters } from './geo.js';
import {
  CHECKINGS_TODAY_START,
  computeKpis,
  createFleet,
  detectCheckings,
  stepFleet,
} from './fleetSimulator.js';

// Deterministic PRNG (mulberry32) so runs are reproducible.
function makeRandom(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHORT_ROUTE = {
  route: 'T1',
  name: 'Ruta Test Corta',
  color: '#ff0000',
  coords: [
    [-89.2, 13.7],
    [-89.198, 13.701],
    [-89.196, 13.702],
    [-89.194, 13.703],
    [-89.192, 13.704],
    [-89.19, 13.705],
  ],
};

const LONG_ROUTE = {
  route: 'T2',
  name: 'Ruta Test Larga',
  color: '#00ff00',
  coords: [
    [-89.22, 13.69],
    [-89.21, 13.695],
    [-89.2, 13.7],
    [-89.19, 13.705],
    [-89.18, 13.71],
    [-89.17, 13.715],
    [-89.16, 13.72],
  ],
};

test('interpolateAlong at 0 meters returns (approximately) the first coordinate', () => {
  const { position } = interpolateAlong(SHORT_ROUTE.coords, 0);
  assert.ok(Math.abs(position.lng - SHORT_ROUTE.coords[0][0]) < 1e-9);
  assert.ok(Math.abs(position.lat - SHORT_ROUTE.coords[0][1]) < 1e-9);
});

test('polylineLengthMeters is positive for a real polyline', () => {
  const length = polylineLengthMeters(SHORT_ROUTE.coords);
  assert.ok(length > 0);
});

test('haversineMeters is zero for identical points and symmetric', () => {
  const a = SHORT_ROUTE.coords[0];
  const b = SHORT_ROUTE.coords[1];
  assert.equal(haversineMeters(a, a), 0);
  assert.ok(Math.abs(haversineMeters(a, b) - haversineMeters(b, a)) < 1e-6);
});

test('stepFleet advances distance over time and never decreases laps', () => {
  const random = makeRandom(42);
  const { units: initialUnits, routes } = createFleet([SHORT_ROUTE], { random });
  let state = { routes, units: initialUnits };

  const startDistances = state.units.map(u => u.distanceMeters);
  let lastLaps = state.units.map(u => u.laps);
  let advanced = false;

  for (let i = 0; i < 200; i++) {
    state = stepFleet(state, 5, { random });

    state.units.forEach((u, idx) => {
      assert.ok(u.laps >= lastLaps[idx], 'laps must never decrease');
    });
    lastLaps = state.units.map(u => u.laps);

    if (
      state.units.some(
        (u, idx) => u.distanceMeters !== startDistances[idx] || u.laps > 0
      )
    ) {
      advanced = true;
    }
  }

  assert.ok(advanced, 'at least one unit should have advanced');
});

test('detectCheckings emits well-formed CheckingEvents as units cross checkpoints', () => {
  const random = makeRandom(7);
  const { units, routes } = createFleet([LONG_ROUTE], { random });
  let state = { routes, units };
  const events = [];

  for (let i = 0; i < 80; i++) {
    const prevState = state;
    state = stepFleet(state, 5, { random });
    events.push(...detectCheckings(prevState, state));
  }

  assert.ok(events.length > 0, 'expected at least one checking event over the run');

  for (const event of events) {
    assert.ok(event.id, 'event.id present');
    assert.ok(event.unitId, 'event.unitId present');
    assert.ok(event.route, 'event.route present');
    assert.ok(event.checkpointName, 'event.checkpointName present');
    assert.ok(event.timeLabel, 'event.timeLabel present');
  }
});

test('computeKpis stays within expected bounds', () => {
  const random = makeRandom(3);
  const { units, routes } = createFleet([SHORT_ROUTE, LONG_ROUTE], { random });
  let state = { routes, units };

  for (let i = 0; i < 40; i++) {
    state = stepFleet(state, 3, { random });
  }

  const kpis = computeKpis(state, CHECKINGS_TODAY_START + 5);

  assert.ok(kpis.activeUnits <= kpis.totalUnits, 'activeUnits <= totalUnits');
  assert.ok(kpis.punctuality >= 0 && kpis.punctuality <= 100, 'punctuality within 0..100');
  assert.ok(kpis.checkingsToday >= CHECKINGS_TODAY_START, 'checkingsToday >= start counter');
  assert.ok(typeof kpis.dateLabel === 'string' && kpis.dateLabel.length > 0, 'dateLabel present');
  assert.ok(typeof kpis.timeLabel === 'string' && kpis.timeLabel.length > 0, 'timeLabel present');
});
