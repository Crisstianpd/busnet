import { useState } from "react";
import TrafficReportForm from "./TrafficReportForm";

const severityColors = {
    low: "#22C55E",
    medium: "#FACC15",
    high: "#EF4444"
};

const typeLabels = {
    traffic: "Tráfico",
    accident: "Accidente",
    road_closed: "Calle cerrada",
    flood: "Inundación",
    bus_issue: "Bus detenido",
    police_control: "Control policial",
    other: "Otro incidente"
};

function remainingTime(expiresAt) {
    const remainingMinutes = Math.max(
        0,
        Math.ceil((Date.parse(expiresAt) - Date.now()) / 60000)
    );

    if (remainingMinutes < 60) return `${remainingMinutes} min`;

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
}

export default function TrafficPanel({
    reports,
    loading,
    error,
    analysis,
    currentLocation,
    reportLocation,
    selectingOnMap,
    onUseCurrentLocation,
    onSelectOnMap,
    onSubmitReport,
    onCancelReport
}) {
    const [expanded, setExpanded] = useState(true);
    const [showForm, setShowForm] = useState(false);

    if (!expanded) {
        return (
            <button
                type="button"
                onClick={() => setExpanded(true)}
                style={{
                    position: "absolute",
                    right: 18,
                    bottom: 18,
                    zIndex: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 999,
                    padding: "11px 16px",
                    background: "#0F172A",
                    color: "#F8FAFC",
                    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.38)",
                    fontWeight: 800,
                    cursor: "pointer"
                }}
            >
                Reportes comunitarios · {reports.length}
            </button>
        );
    }

    return (
        <aside
            style={{
                position: "absolute",
                right: 18,
                bottom: 18,
                zIndex: 12,
                width: "min(340px, calc(100vw - 36px))",
                maxHeight: "calc(100vh - 36px)",
                overflowY: "auto",
                border: "1px solid rgba(148, 163, 184, 0.24)",
                borderRadius: 18,
                padding: 15,
                background:
                    "linear-gradient(160deg, rgba(15, 23, 42, 0.97), rgba(30, 41, 59, 0.94))",
                color: "#F8FAFC",
                boxShadow: "0 22px 55px rgba(15, 23, 42, 0.42)",
                backdropFilter: "blur(12px)"
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            color: "#FDBA74",
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase"
                        }}
                    >
                        BUSNET · Comunidad
                    </div>
                    <h2 style={{ margin: "3px 0 4px", fontSize: 18 }}>
                        Tráfico reportado por la comunidad
                    </h2>
                    <p style={{ margin: 0, color: "#CBD5E1", fontSize: 12 }}>
                        Información colaborativa, aproximada y no oficial.
                    </p>
                </div>
                <button
                    type="button"
                    aria-label="Minimizar reportes comunitarios"
                    onClick={() => setExpanded(false)}
                    style={{
                        border: 0,
                        background: "transparent",
                        color: "#CBD5E1",
                        fontSize: 20,
                        cursor: "pointer"
                    }}
                >
                    −
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 12,
                    fontSize: 11,
                    color: "#CBD5E1"
                }}
            >
                {Object.entries(severityColors).map(([severity, color]) => (
                    <span
                        key={severity}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: color
                            }}
                        />
                        {severity === "low"
                            ? "Baja"
                            : severity === "medium"
                                ? "Media"
                                : "Alta"}
                    </span>
                ))}
            </div>

            {analysis?.affected && (
                <div
                    style={{
                        marginTop: 12,
                        borderLeft: "3px solid #F97316",
                        borderRadius: 8,
                        padding: "9px 10px",
                        background: "rgba(249, 115, 22, 0.13)",
                        fontSize: 12
                    }}
                >
                    <b>Atención en la ruta seleccionada.</b>
                    <div style={{ marginTop: 3, color: "#FED7AA" }}>
                        {analysis.alertCount} reporte(s) comunitario(s) cercano(s).
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
                {loading && (
                    <div style={{ color: "#CBD5E1", fontSize: 12 }}>
                        Cargando reportes…
                    </div>
                )}

                {!loading && reports.length === 0 && (
                    <div
                        style={{
                            borderRadius: 10,
                            padding: 10,
                            background: "rgba(148, 163, 184, 0.1)",
                            color: "#CBD5E1",
                            fontSize: 12
                        }}
                    >
                        No hay reportes comunitarios activos.
                    </div>
                )}

                {reports.slice(0, 3).map(report => (
                    <div
                        key={report.id}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "9px 1fr auto",
                            gap: 9,
                            alignItems: "start",
                            borderRadius: 10,
                            padding: 9,
                            background: "rgba(15, 23, 42, 0.64)",
                            fontSize: 12
                        }}
                    >
                        <span
                            style={{
                                width: 9,
                                height: 9,
                                marginTop: 3,
                                borderRadius: "50%",
                                background: severityColors[report.severity]
                            }}
                        />
                        <span>
                            <b>{typeLabels[report.type] ?? "Incidente"}</b>
                            <span
                                style={{
                                    display: "block",
                                    marginTop: 2,
                                    color: "#CBD5E1"
                                }}
                            >
                                {report.description}
                            </span>
                        </span>
                        <span style={{ color: "#94A3B8", whiteSpace: "nowrap" }}>
                            {remainingTime(report.expiresAt)}
                        </span>
                    </div>
                ))}
            </div>

            {error && (
                <div style={{ marginTop: 10, color: "#FCA5A5", fontSize: 12 }}>
                    {error}
                </div>
            )}

            {!showForm ? (
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    style={{
                        width: "100%",
                        marginTop: 12,
                        border: 0,
                        borderRadius: 11,
                        padding: "10px 12px",
                        background: "#F97316",
                        color: "#111827",
                        fontWeight: 900,
                        cursor: "pointer"
                    }}
                >
                    Reportar un incidente
                </button>
            ) : (
                <TrafficReportForm
                    currentLocation={currentLocation}
                    selectedLocation={reportLocation}
                    selectingOnMap={selectingOnMap}
                    onUseCurrentLocation={onUseCurrentLocation}
                    onSelectOnMap={onSelectOnMap}
                    onSubmit={async report => {
                        await onSubmitReport(report);
                        setShowForm(false);
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        onCancelReport();
                    }}
                />
            )}
        </aside>
    );
}
