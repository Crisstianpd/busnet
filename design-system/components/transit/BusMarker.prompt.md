# BusMarker

The live bus on the map — a route-colored badge with the route number kept upright and legible, plus a nub that rotates to the bus's `bearing`. Three states.

```jsx
<BusMarker route="30B" color="var(--route-1)" bearing={64} state="moving" />
<BusMarker route="7D" color="var(--route-6)" state="stopped" />
<BusMarker route="42" color="var(--route-4)" state="selected" onClick={select} />
```

Keep `size` ~40 so the number stays readable at marker scale. Animate `bearing` and position between WebSocket updates for the "sliding bus" effect.
