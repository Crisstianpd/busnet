import { useState } from "react";
import TrafficReportForm from "./TrafficReportForm";
import "./TrafficPanel.css";

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

const filters = [
    ["all", "Todos"],
    ["low", "Baja"],
    ["medium", "Media"],
    ["high", "Alta"],
    ["none", "Ninguno"]
];

function remainingTime(expiresAt) {
    const minutes = Math.max(
        0,
        Math.ceil((Date.parse(expiresAt) - Date.now()) / 60000)
    );

    return minutes < 60
        ? `${minutes} min`
        : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

export default function TrafficPanel({
    reports,
    loading,
    error,
    analysis,
    currentLocation,
    reportLocation,
    selectingOnMap,
    activeFilter = "all",
    onFilterChange,
    onUseCurrentLocation,
    onSelectOnMap,
    onSubmitReport,
    onCancelReport
}) {
    const [expanded, setExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const filteredReports = activeFilter === "none"
        ? []
        : activeFilter === "all"
            ? reports
            : reports.filter(report => report.severity === activeFilter);

    if (!expanded) {
        return (
            <button
                type="button"
                className="community-dock"
                onClick={() => setExpanded(true)}
            >
                <span className="community-dock-icon" aria-hidden="true">!</span>
                <span>
                    <b>Comunidad</b>
                    <small>{reports.length} reportes activos</small>
                </span>
            </button>
        );
    }

    return (
        <aside className="community-panel">
            <header className="community-header">
                <div>
                    <span>BUSNET · Comunidad</span>
                    <h2>Tráfico reportado por la comunidad</h2>
                    <p>Información colaborativa, aproximada y no oficial.</p>
                </div>
                <button
                    type="button"
                    aria-label="Minimizar reportes comunitarios"
                    onClick={() => setExpanded(false)}
                >
                    −
                </button>
            </header>

            <div className="community-filters" aria-label="Filtrar reportes">
                {filters.map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        className={activeFilter === value ? "is-active" : ""}
                        onClick={() => onFilterChange(value)}
                    >
                        {value !== "all" && value !== "none" && (
                            <span style={{ background: severityColors[value] }} />
                        )}
                        {label}
                    </button>
                ))}
            </div>

            {analysis?.affected && (
                <div className="community-alert">
                    <b>Atención en la ruta seleccionada.</b>
                    <span>
                        {analysis.alertCount} reporte(s) comunitario(s) cercano(s).
                    </span>
                </div>
            )}

            <div className="community-list">
                {loading && <p>Cargando reportes…</p>}
                {!loading && filteredReports.length === 0 && (
                    <p>No hay reportes visibles con este filtro.</p>
                )}
                {filteredReports.slice(0, 4).map(report => (
                    <article key={report.id}>
                        <i
                            style={{ background: severityColors[report.severity] }}
                        />
                        <span>
                            <b>{typeLabels[report.type] ?? "Incidente"}</b>
                            <small>{report.description}</small>
                        </span>
                        <time>{remainingTime(report.expiresAt)}</time>
                    </article>
                ))}
            </div>

            {error && <div className="community-error">{error}</div>}

            {!showForm ? (
                <button
                    type="button"
                    className="community-report-button"
                    onClick={() => setShowForm(true)}
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
