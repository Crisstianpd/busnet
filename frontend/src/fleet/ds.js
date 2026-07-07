// Single import surface for the vendored Claude Design components used by the
// Fleet dashboard. The design-system/ export is READ-ONLY (GUARDRAILS §4) — we
// consume it, never edit it. Import from here, not from @ds/components/** directly.
export { Icon } from '@ds/components/foundations/Icon.jsx';
export { Button } from '@ds/components/actions/Button.jsx';
export { Badge } from '@ds/components/feedback/Badge.jsx';
export { Spinner } from '@ds/components/feedback/Spinner.jsx';
export { KpiCard } from '@ds/components/surfaces/KpiCard.jsx';
export { TableRow } from '@ds/components/data/TableRow.jsx';
export { BusMarker } from '@ds/components/transit/BusMarker.jsx';
