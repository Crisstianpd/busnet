/* global React */
// BusNET Fleet — desktop dashboard for transport operators. KPIs, live units
// table, a checking log that fills in real time (the pitch climax), mini map.

function MiniMap() {
  const DS = window.BusNETDesignSystem_abb9a1;
  const { BusMarker } = DS;
  const streets = ["M-10,60 L420,90", "M-10,150 L420,130", "M-10,220 L420,240", "M60,-10 L50,300", "M170,-10 L185,300", "M300,-10 L290,300"];
  return (
    <div style={{ position: "relative", height: 260, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--hairline)", background: "radial-gradient(120% 90% at 60% 10%, #14203a, #0B1220 65%)" }}>
      <svg viewBox="0 0 400 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        {streets.map((d, i) => <path key={i} d={d} fill="none" stroke="#1c2740" strokeWidth={i < 3 ? 6 : 3} strokeLinecap="round" />)}
        <path d="M30,220 C120,180 180,240 260,180 S360,120 400,150" fill="none" stroke="var(--route-1)" strokeWidth="4" opacity="0.9" strokeLinecap="round" />
        <path d="M20,80 C120,120 200,60 300,110" fill="none" stroke="var(--route-6)" strokeWidth="4" opacity="0.9" strokeLinecap="round" />
      </svg>
      {[["30B", "var(--route-1)", 120, 190, 40], ["7D", "var(--route-6)", 250, 90, 200], ["42", "var(--route-4)", 300, 200, 120]].map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b[2], top: b[3], transform: "translate(-50%,-50%)" }}>
          <BusMarker route={b[0]} color={b[1]} bearing={b[4]} size={30} state={i === 0 ? "selected" : "moving"} />
        </div>
      ))}
      <span style={{ position: "absolute", top: 12, left: 12 }}>
        <DS.Badge variant="live">En vivo</DS.Badge>
      </span>
    </div>
  );
}

function Dashboard() {
  const DS = window.BusNETDesignSystem_abb9a1;
  const { KpiCard, TableRow, Badge, Icon } = DS;

  const cols = "132px 70px 1fr 130px 74px 96px";
  const units = [
    ["P-482-AB", "30B", "var(--route-1)", "José Martínez", "success", "En ruta", "7", "96%"],
    ["P-118-CD", "7D", "var(--route-6)", "María Alvarado", "success", "En ruta", "5", "92%"],
    ["P-903-EF", "42", "var(--route-4)", "Carlos Rivas", "neutral", "Detenido", "6", "88%"],
    ["P-256-GH", "101", "var(--route-3)", "Ana Beltrán", "warning", "Retraso", "4", "79%"],
    ["P-771-IJ", "12", "var(--route-5)", "Luis Portillo", "success", "En ruta", "8", "97%"],
    ["P-640-KL", "2B", "var(--route-2)", "Sofía Cruz", "success", "En ruta", "6", "94%"],
    ["P-329-MN", "8", "var(--route-7)", "Óscar Díaz", "neutral", "Detenido", "5", "90%"],
  ];

  // checking log fills in real time
  const seed = [
    { u: "P-118-CD", r: "7D", c: "var(--route-6)", pt: "Terminal Occidente", t: "10:14:02" },
    { u: "P-482-AB", r: "30B", c: "var(--route-1)", pt: "Punto Metrocentro", t: "10:13:41" },
    { u: "P-771-IJ", r: "12", c: "var(--route-5)", pt: "Redondel Masferrer", t: "10:13:08" },
  ];
  const pool = [
    { u: "P-640-KL", r: "2B", c: "var(--route-2)", pt: "Terminal Oriente" },
    { u: "P-903-EF", r: "42", c: "var(--route-4)", pt: "Parque Cuscatlán" },
    { u: "P-329-MN", r: "8", c: "var(--route-7)", pt: "Plaza Salvador del Mundo" },
    { u: "P-256-GH", r: "101", c: "var(--route-3)", pt: "Terminal Occidente" },
    { u: "P-482-AB", r: "30B", c: "var(--route-1)", pt: "Hospital Bloom" },
  ];
  const [log, setLog] = React.useState(seed);
  const [count, setCount] = React.useState(1240);
  React.useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      const base = pool[n % pool.length];
      const now = new Date();
      const t = `10:${String(14 + (n % 40)).padStart(2, "0")}:${String((n * 7) % 60).padStart(2, "0")}`;
      setLog((prev) => [{ ...base, t, fresh: true }, ...prev].slice(0, 9));
      setCount((c) => c + 1);
      n++;
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const nav = [["gauge", "Resumen", true], ["bus", "Unidades", false], ["check-check", "Checking", false], ["route", "Rutas", false], ["activity", "Reportes", false]];

  return (
    <div style={{ width: 1440, minHeight: 900, display: "flex", background: "var(--night)", fontFamily: "var(--font-ui)" }}>
      {/* sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: "var(--surface)", borderRight: "1px solid var(--hairline)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px" }}>
          <img src="../../assets/logo/busnet-badge.svg" style={{ width: 34, borderRadius: 10 }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Bus<span style={{ color: "var(--busnet-green)" }}>NET</span></div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", letterSpacing: "0.04em" }}>FLEET</div>
          </div>
        </div>
        {nav.map(([ic, label, on]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: "var(--radius-md)", color: on ? "var(--text-primary)" : "var(--text-secondary)", background: on ? "var(--state-selected)" : "transparent", fontWeight: on ? 700 : 500, fontSize: 14, cursor: "pointer" }}>
            <Icon name={ic} size={19} style={{ color: on ? "var(--busnet-green)" : "var(--text-tertiary)" }} /> {label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: 14, borderRadius: "var(--radius-lg)", background: "var(--surface-raised)", border: "1px solid var(--hairline)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Ruta 30 S.A. de C.V.</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Plan Flota · 80 unidades</div>
        </div>
      </aside>

      {/* main */}
      <main style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Resumen operativo</h1>
            <div style={{ marginTop: 4, fontSize: 14, color: "var(--text-secondary)" }}>Viernes 4 de julio · 10:14 a.m.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge variant="live">En vivo</Badge>
            <button style={{ display: "flex", alignItems: "center", gap: 8, height: 42, padding: "0 16px", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", border: "1px solid var(--hairline)", color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              <Icon name="activity" size={17} /> Exportar reporte
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          <KpiCard label="Unidades activas" value="42" unit="/ 80" icon="bus" delta="+4" deltaDirection="up" />
          <KpiCard label="Vueltas hoy" value="318" icon="repeat" delta="+12%" deltaDirection="up" tone="info" />
          <KpiCard label="Puntualidad" value="91" unit="%" icon="gauge" tone="amber" delta="-2%" deltaDirection="down" />
          <KpiCard label="Checkings hoy" value={count.toLocaleString("es")} icon="check-check" tone="green" />
        </div>

        {/* two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 20, alignItems: "start" }}>
          {/* units table */}
          <section style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Unidades en vivo</h2>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>42 en ruta</span>
            </div>
            <TableRow head columns={cols} cells={["Unidad", "Ruta", "Motorista", "Estado", "Vueltas", "Puntual."]} />
            {units.map((u, i) => (
              <TableRow key={i} columns={cols} cells={[
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{u[0]}</span>,
                <Badge variant="route" color={u[2]}>{u[1]}</Badge>,
                u[3],
                <Badge variant={u[4]} icon={u[4] === "warning" ? "triangle-alert" : u[4] === "success" ? "check" : undefined}>{u[5]}</Badge>,
                <span style={{ fontWeight: 700 }}>{u[6]}</span>,
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{u[7]}</span>,
              ]} />
            ))}
          </section>

          {/* right column: mini map + checking log */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <MiniMap />
            <section style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <div style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="check-check" size={18} style={{ color: "var(--busnet-green)" }} />
                <h2 style={{ margin: 0, flex: 1, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Checking digital</h2>
                <Badge variant="live">Vivo</Badge>
              </div>
              <div style={{ maxHeight: 320, overflow: "hidden" }}>
                {log.map((e, i) => (
                  <TableRow key={e.u + e.t + i} entering={e.fresh} columns="60px 1fr 88px" cells={[
                    <Badge variant="route" color={e.c} size="sm">{e.r}</Badge>,
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{e.u}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.pt}</div>
                    </div>,
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>{e.t}</span>,
                  ]} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
window.Dashboard = Dashboard;
