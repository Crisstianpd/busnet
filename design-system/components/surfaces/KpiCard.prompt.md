# KpiCard

Metric card for the BusNET Fleet dashboard. Big Manrope number, label, icon chip, and an optional trend delta.

```jsx
<KpiCard label="Unidades activas" value="42" icon="bus" delta="+4" deltaDirection="up" />
<KpiCard label="Puntualidad" value="91" unit="%" icon="gauge" tone="amber" delta="-2%" deltaDirection="down" />
<KpiCard label="Vueltas hoy" value="318" icon="repeat" />
```

`tone` tints the icon chip. Lay several out in a responsive grid at the top of the dashboard.
