# Frontend Design System Integration Spec

## Objective

Integrate the vendored BusNET design system into the current passenger web app after the latest `main` pull, preserving the new route-planning engine and the current MapLibre route rendering flow.

## Non-negotiable invariants

- Do not edit the route engine or engine-adjacent handlers:
  - `backend/services/routePlanner.js`
  - `backend/services/geojsonNormalizer.js`
  - `backend/services/planRequestValidator.js`
  - `backend/config/routing.js`
  - existing `/plan`, `/routes`, `/routes/:route`, and `/search` handlers in `backend/index.js`
- Treat `design-system/` as vendored and read-only.
- Keep `MapView` mounted as the imperative MapLibre owner. UI changes must not remount the map or replace the route/source/layer contracts.
- Preserve the current passenger flow: geolocation, "A dónde vas" search, Nominatim results, `/plan`, alternatives, route selection, and map rendering.
- Preserve the current `RouteControlPanel` and `TripOptions` data contracts from latest `main`.
- Prioritize mobile at 375px, then desktop. The demo must be usable on phones and laptops.

## Integration approach

- Import `design-system/styles.css` once from the frontend entry point.
- Expose design-system components through `frontend/src/components/ui/index.js` using the Vite `@ds` alias.
- Keep the latest `main` frontend architecture:
  - `Home.jsx` owns orchestration.
  - `RouteControlPanel` owns destination/search UI.
  - `TripOptions` owns alternatives and expanded details.
  - `MapView` owns all MapLibre rendering.
- Improve hierarchy through CSS and token adoption without changing backend payloads or planner behavior.

## Acceptance criteria

- `frontend` lint passes.
- `frontend` production build passes.
- `backend` tests pass.
- `/plan` smoke test returns at least one option on the latest pulled engine.
- `git diff --stat` is empty for the protected engine paths.
- Mobile screenshot at 375px shows no broken overlap and keeps the map usable behind the route panel.
- Desktop screenshot shows a stable left-side planning panel, visible map, and route alternatives.

## PR audit checklist

- No hardcoded hex colors in touched app UI files, except inside the vendored design-system tokens.
- No direct edits inside `design-system/`.
- No accidental generated files, secrets, `node_modules`, or binary exports outside the vendored design system.
- Branch contains the restored project documents required by F0.1/F0.3.
