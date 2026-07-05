# Toast

Transient notice or inline alert with a colored accent rail and tone icon. Use for arrival alerts ("Tu bus salió de la terminal"), confirmations, and service notices.

```jsx
<Toast tone="success" title="Ruta iniciada" message="Buen viaje. Te avisamos al llegar." onClose={dismiss} />
<Toast tone="warning" title="Retraso en la 7D" message="Llega 4 min más tarde de lo previsto." />
```

`tone`: info | success | warning | danger. Pass `action` to embed a Button.
