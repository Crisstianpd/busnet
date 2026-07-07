// seed.js — static seed data for the fleet simulator: unit roster, route
// color palette, checkpoint name pool, and an offline fallback route set
// (hand-drawn polylines around San Salvador) so the dashboard has something
// honest to animate even when the backend route service is unreachable.

// Displayed fleet size for the operator (KPI copy / sidebar plan), independent
// of how many units are actively simulated/rendered live.
export const TOTAL_UNITS = 80;

// Cycles through the design system's route color tokens, expected to be
// defined as CSS custom properties (--route-1 .. --route-8) by the design
// system consuming this data.
export const ROUTE_COLOR_PALETTE = [
  'var(--route-1)',
  'var(--route-2)',
  'var(--route-3)',
  'var(--route-4)',
  'var(--route-5)',
  'var(--route-6)',
  'var(--route-7)',
  'var(--route-8)',
];

export function colorForRouteIndex(index) {
  return ROUTE_COLOR_PALETTE[index % ROUTE_COLOR_PALETTE.length];
}

// Base roster of simulated units. Placas follow the "P-###-XX" pattern.
// speedKmh/punctuality carry small per-unit variance baked in up front so the
// simulation feels organic instead of uniform (createFleet adds further
// per-run jitter on top of these).
export const SEED_UNITS = [
  { id: 'P-482-AB', driver: 'José Martínez', speedKmh: 27, punctuality: 92 },
  { id: 'P-107-CJ', driver: 'María Alvarado', speedKmh: 24, punctuality: 88 },
  { id: 'P-963-LM', driver: 'Carlos Rivas', speedKmh: 31, punctuality: 95 },
  { id: 'P-215-QR', driver: 'Ana Beltrán', speedKmh: 22, punctuality: 79 },
  { id: 'P-748-TN', driver: 'Luis Portillo', speedKmh: 29, punctuality: 90 },
  { id: 'P-330-WZ', driver: 'Sofía Cruz', speedKmh: 26, punctuality: 84 },
  { id: 'P-591-DK', driver: 'Óscar Díaz', speedKmh: 33, punctuality: 97 },
  { id: 'P-826-FH', driver: 'Gabriela Menjívar', speedKmh: 21, punctuality: 76 },
  { id: 'P-064-GY', driver: 'Ricardo Pineda', speedKmh: 28, punctuality: 91 },
  { id: 'P-457-BV', driver: 'Daniela Escobar', speedKmh: 25, punctuality: 86 },
  { id: 'P-192-XE', driver: 'Fernando Quintanilla', speedKmh: 30, punctuality: 93 },
  { id: 'P-609-SP', driver: 'Patricia Alas', speedKmh: 23, punctuality: 82 },
];

// A handful of memorable checkpoint names sprinkled in among the generic
// "Punto N · <ruta>" samples so the checking log reads naturally.
export const NAMED_CHECKPOINTS = [
  'Terminal Occidente',
  'Punto Metrocentro',
  'Redondel Masferrer',
  'Terminal Oriente',
  'Parque Cuscatlán',
  'Plaza Salvador del Mundo',
  'Hospital Bloom',
];

// Offline fallback: hand-made polylines around San Salvador (~[-89.2, 13.70])
// used only if the backend route service is unreachable, so the simulator
// always has real-looking geometry to animate over.
export const FALLBACK_ROUTES = [
  {
    route: '30B',
    name: 'Ruta 30B · Centro - Metrocentro',
    color: '#e0464b',
    coords: [
      [-89.2182, 13.6989],
      [-89.214, 13.6975],
      [-89.2095, 13.6968],
      [-89.2041, 13.6949],
      [-89.1998, 13.693],
      [-89.1943, 13.6902],
      [-89.1899, 13.6884],
      [-89.1861, 13.6858],
      [-89.1822, 13.6839],
    ],
  },
  {
    route: '42A',
    name: 'Ruta 42A · Masferrer - Terminal Oriente',
    color: '#2f8fe0',
    coords: [
      [-89.241, 13.705],
      [-89.2355, 13.701],
      [-89.2296, 13.6978],
      [-89.2233, 13.6949],
      [-89.2172, 13.6919],
      [-89.2101, 13.6888],
      [-89.2038, 13.6853],
      [-89.1965, 13.682],
      [-89.1889, 13.679],
    ],
  },
  {
    route: '101',
    name: 'Ruta 101 · Cuscatlán - Bloom',
    color: '#3fae5c',
    coords: [
      [-89.1998, 13.7132],
      [-89.1978, 13.708],
      [-89.1961, 13.7025],
      [-89.1949, 13.6971],
      [-89.1934, 13.6918],
      [-89.1911, 13.6864],
      [-89.1889, 13.6811],
      [-89.1861, 13.6758],
    ],
  },
  {
    route: '11',
    name: 'Ruta 11 · Soyapango - Centro',
    color: '#d69a1f',
    coords: [
      [-89.1546, 13.7096],
      [-89.163, 13.7069],
      [-89.171, 13.7038],
      [-89.1789, 13.7005],
      [-89.1865, 13.6968],
      [-89.1938, 13.6928],
      [-89.2005, 13.6885],
    ],
  },
];
