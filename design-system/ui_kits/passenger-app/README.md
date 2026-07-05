# Passenger App UI kit

High-fidelity click-through of the BusNET passenger experience (mobile, 375 px). Four screens, composed from the design-system components.

Open **`index.html`** — a phone frame with a switcher rail. Tap the search bar on Home to walk the flow: Home → Resultados → Viaje activo. Switch to Tracking en vivo from the rail to see buses moving.

## Screens
- **`HomeScreen.jsx`** — dark map with faded routes, prominent "¿A dónde vas?" search, recent destinations sheet.
- **`ResultsScreen.jsx`** — destination set; sheet with 3 trip alternatives ordered by time (`TripCard`).
- **`ActiveTripScreen.jsx`** — painted active route, big green ETA, Moovit-style step-by-step (`StepItem`), voice button.
- **`LiveTrackingScreen.jsx`** — buses moving in real time (`BusMarker`), a selected bus with the Premium "llega en 6 min" sheet. The wow screen.

## Support files (kit-only, not design-system components)
- **`MapCanvas.jsx`** — stylized faux "night map" (street network + painted route polylines). Production uses MapLibre GL + Carto dark tiles; this reproduces the look for mockups.
- **`shared.jsx`** — `StatusBar` and the `BN_ROUTES` polyline data.
- **`app.jsx`** — screen wiring + phone frame.

All screens pull real components from `window.BusNETDesignSystem_abb9a1` via the compiled `_ds_bundle.js`.
