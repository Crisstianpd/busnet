# BottomSheet

The sheet that floats over the dark map — 24px top corners, grabber handle, soft upward shadow. Three snap states (`collapsed` / `half` / `expanded`). Tapping the handle cycles states in prototypes.

```jsx
<BottomSheet snap={snap} onSnapChange={setSnap}
  header={<h2 style={{ font... }}>3 rutas hacia Hospital Bloom</h2>}>
  <TripCard ... />
  <TripCard ... />
</BottomSheet>
```

Position it inside a `position:relative` map container. Put the results list / trip cards / step-by-step inside.
