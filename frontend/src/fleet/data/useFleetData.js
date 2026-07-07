// useFleetData.js — React hook that wires the pure fleetSimulator core to a
// live ticking clock, backed by real route geometry from the backend (with
// an offline fallback). See ../FleetDashboard.jsx header for the data
// contract this hook must satisfy.

import { useEffect, useRef, useState } from 'react';
import { getRoute, getRoutes } from '../../services/api';
import { FALLBACK_ROUTES } from './seed';
import {
  CHECKINGS_TODAY_START,
  computeKpis,
  createFleet,
  detectCheckings,
  seedCheckingLog,
  stepFleet,
  syntheticChecking,
} from './fleetSimulator';

const TICK_SECONDS = 1;
const MAX_ROUTES_TO_LOAD = 8;
const MIN_ROUTES_TO_LOAD = 6;
const CHECKING_LOG_SIZE = 9;
const SEEDED_CHECKINGS = 4;
// Organic per-tick release chance for a queued crossing.
const CHECKING_RELEASE_PROBABILITY = 0.4;
// Guarantee a queued crossing surfaces at least this often (keeps cadence
// tight even when the probability roll keeps missing).
const CHECKING_MIN_INTERVAL_MS = 2500;
// If nothing has surfaced in this long, force one out — synthesizing a plausible
// event when the queue happens to be empty — so the log never visibly stalls.
const CHECKING_FORCE_INTERVAL_MS = 4000;

function extractLineCoordinates(geometry) {
  if (!geometry) return null;

  if (geometry.type === 'LineString') {
    return geometry.coordinates;
  }

  if (geometry.type === 'MultiLineString') {
    // Flatten segments in order — good enough for a demo polyline.
    return geometry.coordinates.flat();
  }

  if (geometry.type === 'GeometryCollection') {
    for (const sub of geometry.geometries || []) {
      const found = extractLineCoordinates(sub);
      if (found) return found;
    }
  }

  return null;
}

function extractRouteCoords(geojson) {
  const features = geojson?.features || (geojson?.type === 'Feature' ? [geojson] : []);

  for (const feature of features) {
    const coords = extractLineCoordinates(feature.geometry);
    if (Array.isArray(coords) && coords.length >= 2) {
      // Drop any elevation/M component some GeoJSON coords carry — keep
      // [lng, lat] pairs only, as geo.js expects.
      return coords.map(([lng, lat]) => [lng, lat]);
    }
  }

  return null;
}

async function loadRoutesOrFallback() {
  try {
    const list = await getRoutes();

    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('No routes returned by backend');
    }

    const candidates = list.slice(0, MAX_ROUTES_TO_LOAD);

    const results = await Promise.all(
      candidates.map(async summary => {
        try {
          const geojson = await getRoute(summary.route);
          const coords = extractRouteCoords(geojson);
          if (!coords) return null;

          return {
            route: summary.route,
            name: summary.name,
            color: summary.color,
            coords,
          };
        } catch {
          return null;
        }
      })
    );

    const valid = results.filter(Boolean);

    if (valid.length < Math.min(MIN_ROUTES_TO_LOAD, candidates.length) && valid.length === 0) {
      throw new Error('No usable route geometry from backend');
    }

    return valid.length > 0 ? valid : FALLBACK_ROUTES;
  } catch {
    return FALLBACK_ROUTES;
  }
}

export function useFleetData() {
  const [units, setUnits] = useState([]);
  const [checkingLog, setCheckingLog] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  const simStateRef = useRef(null);
  const checkingsCountRef = useRef(CHECKINGS_TODAY_START);
  const pendingCheckingsRef = useRef([]);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let intervalId = null;

    async function boot() {
      const routes = await loadRoutesOrFallback();
      if (cancelled) return;

      const initialState = createFleet(routes);
      simStateRef.current = initialState;

      // Pre-fill the checking log so the panel opens with recent activity
      // instead of "Esperando checkings…".
      const seeded = seedCheckingLog(initialState, { count: SEEDED_CHECKINGS });
      checkingsCountRef.current += seeded.length;
      lastEmitRef.current = Date.now();

      setCheckingLog(seeded);
      setUnits(initialState.units);
      setKpis(computeKpis(initialState, checkingsCountRef.current));
      setLoading(false);

      intervalId = setInterval(() => {
        const prevState = simStateRef.current;
        if (!prevState) return;

        const nextState = stepFleet(prevState, TICK_SECONDS);
        const crossings = detectCheckings(prevState, nextState);
        simStateRef.current = nextState;

        if (crossings.length > 0) {
          pendingCheckingsRef.current.push(...crossings);
        }

        const queue = pendingCheckingsRef.current;
        const now = Date.now();
        const sinceLast = now - lastEmitRef.current;

        let event = null;
        if (
          queue.length > 0 &&
          (Math.random() < CHECKING_RELEASE_PROBABILITY ||
            sinceLast >= CHECKING_MIN_INTERVAL_MS)
        ) {
          event = queue.shift();
        } else if (sinceLast >= CHECKING_FORCE_INTERVAL_MS) {
          // Nothing surfaced recently — release a real crossing if one is
          // waiting, otherwise synthesize one so the log keeps moving.
          event = queue.length > 0 ? queue.shift() : syntheticChecking(nextState, { now });
        }

        if (event) {
          lastEmitRef.current = now;
          checkingsCountRef.current += 1;

          setCheckingLog(prev => {
            const withFresh = [
              { ...event, fresh: true },
              ...prev.map(existing => ({ ...existing, fresh: false })),
            ];
            return withFresh.slice(0, CHECKING_LOG_SIZE);
          });
        }

        setUnits(nextState.units);
        setKpis(computeKpis(nextState, checkingsCountRef.current));
      }, TICK_SECONDS * 1000);
    }

    boot();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return {
    units,
    checkingLog,
    kpis: kpis || {
      activeUnits: 0,
      totalUnits: 0,
      lapsToday: 0,
      punctuality: 0,
      checkingsToday: checkingsCountRef.current,
      dateLabel: '',
      timeLabel: '',
    },
    loading,
  };
}
