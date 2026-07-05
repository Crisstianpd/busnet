# SearchInput

The big destination search field that anchors the Home screen. High-contrast, green focus ring, optional clear/mic affordances. Placeholder defaults to "¿A dónde vas?".

```jsx
<SearchInput value={q} onChange={e => setQ(e.target.value)} onClear={() => setQ("")} />
<SearchInput placeholder="Busca un destino en El Salvador" trailingIcon="crosshair" />
```

Use `lg` (56px) as the hero field; `md` (48px) inside sheets. Pair with a results list below.
