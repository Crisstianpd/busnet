# StepItem

A single step of the Moovit-style turn-by-turn plan, rendered on a vertical timeline. Walk/transfer steps get a dashed connector; bus steps get a solid route-colored line. Stack several to form the full itinerary.

```jsx
<StepItem type="origin" title="Tu ubicación" />
<StepItem type="walk" title="Camina hasta la parada" detail="Metrocentro, sobre Alameda" duration="4 min · 450 m" />
<StepItem type="bus" route="30B" routeColor="var(--route-1)" title="Toma la ruta 30B" detail="Cada ~12 min · 6 paradas" duration="18 min" active />
<StepItem type="transfer" title="Transbordo" detail="Camina 120 m a la parada de la 7D" duration="2 min" />
<StepItem type="destination" title="Hospital Bloom" last />
```
