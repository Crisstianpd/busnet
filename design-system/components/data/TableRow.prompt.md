# TableRow

Grid-based row for dashboard tables — the live-units table and the checking log. Define shared `columns` once and reuse it on the header (`head`) and data rows. `entering` flashes a newly-arrived checking-log row so the log feels alive.

```jsx
const cols = "110px 70px 1fr 120px 90px";
<TableRow head columns={cols} cells={["Unidad","Ruta","Motorista","Estado","Vueltas"]} />
<TableRow columns={cols} cells={[
  <span style={{fontFamily:"var(--font-mono)"}}>P-482-AB</span>,
  <Badge variant="route" color="var(--route-1)">30B</Badge>,
  "José Martínez",
  <Badge variant="success">En ruta</Badge>,
  "7",
]} />
<TableRow entering columns={cols} cells={[...]} />
```
