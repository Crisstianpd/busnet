# Badge

Small pill for labels and status. Key BusNET variants: `route` (route-number pill in the route's color), `premium` (amber Premium chip), `live` (pulsing EN VIVO), plus `success`/`warning`/`danger`/`neutral`.

```jsx
<Badge variant="route" color="var(--route-4)">30B</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="live">En vivo</Badge>
<Badge variant="warning" icon="triangle-alert">Retraso</Badge>
```

For route numbers on markers use `BusMarker`; `Badge variant="route"` is for inline chips in cards and steps.
