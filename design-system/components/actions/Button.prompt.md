# Button

BusNET's primary action control — large touch targets tuned for use outdoors on a phone. Use `primary` (green) for the main action per view, `secondary` for alternatives, `ghost` for low-emphasis, `danger` for emergency/destructive.

```jsx
<Button variant="primary" size="lg" iconLeft="navigation" fullWidth>Iniciar viaje</Button>
<Button variant="secondary" iconLeft="volume-2">Escuchar</Button>
<Button variant="ghost" iconRight="chevron-right">Ver rutas</Button>
<Button variant="danger" iconLeft="triangle-alert">Emergencia</Button>
```

Sizes `sm | md | lg` (40 / 44 / 52px). Supports `loading` (spinner) and `disabled`. Icons are `Icon` names.
