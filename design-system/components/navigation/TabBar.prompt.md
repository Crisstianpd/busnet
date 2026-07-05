# TabBar

Fixed bottom navigation for the passenger app. Active tab turns brand green.

```jsx
<TabBar
  activeId="map"
  onChange={setTab}
  items={[
    { id: "map", label: "Mapa", icon: "map-pin" },
    { id: "routes", label: "Rutas", icon: "route" },
    { id: "live", label: "En vivo", icon: "zap" },
    { id: "profile", label: "Perfil", icon: "user" },
  ]}
/>
```
