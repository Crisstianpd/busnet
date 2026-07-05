import { useState } from "react";

const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    borderRadius: 10,
    padding: "9px 10px",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#F8FAFC"
};

export default function TrafficReportForm({
    currentLocation,
    selectedLocation,
    selectingOnMap,
    onUseCurrentLocation,
    onSelectOnMap,
    onSubmit,
    onCancel
}) {
    const [type, setType] = useState("traffic");
    const [severity, setSeverity] = useState("medium");
    const [description, setDescription] = useState("");
    const [radiusMeters, setRadiusMeters] = useState(150);
    const [submitting, setSubmitting] = useState(false);
    const location = selectedLocation;

    async function handleSubmit(event) {
        event.preventDefault();

        if (!location || description.trim().length < 3) return;

        setSubmitting(true);

        try {
            await onSubmit({
                type,
                severity,
                description: description.trim(),
                latitude: location.latitude,
                longitude: location.longitude,
                radiusMeters
            });
            setDescription("");
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "grid",
                gap: 10,
                paddingTop: 12,
                borderTop: "1px solid rgba(148, 163, 184, 0.2)"
            }}
        >
            <label style={{ display: "grid", gap: 5, fontSize: 12 }}>
                Tipo de incidente
                <select
                    value={type}
                    onChange={event => setType(event.target.value)}
                    style={fieldStyle}
                >
                    <option value="traffic">Tráfico</option>
                    <option value="accident">Accidente</option>
                    <option value="road_closed">Calle cerrada</option>
                    <option value="flood">Inundación</option>
                    <option value="bus_issue">Bus detenido o averiado</option>
                    <option value="police_control">Control policial</option>
                    <option value="other">Otro incidente</option>
                </select>
            </label>

            <label style={{ display: "grid", gap: 5, fontSize: 12 }}>
                Severidad
                <select
                    value={severity}
                    onChange={event => setSeverity(event.target.value)}
                    style={fieldStyle}
                >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
            </label>

            <label style={{ display: "grid", gap: 5, fontSize: 12 }}>
                Descripción breve
                <textarea
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    maxLength={200}
                    rows={3}
                    placeholder="¿Qué está ocurriendo?"
                    style={{ ...fieldStyle, resize: "vertical" }}
                />
            </label>

            <label style={{ display: "grid", gap: 5, fontSize: 12 }}>
                Zona aproximada
                <select
                    value={radiusMeters}
                    onChange={event =>
                        setRadiusMeters(Number(event.target.value))
                    }
                    style={fieldStyle}
                >
                    <option value={100}>100 metros</option>
                    <option value={150}>150 metros</option>
                    <option value={250}>250 metros</option>
                    <option value={400}>400 metros</option>
                </select>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                    type="button"
                    disabled={!currentLocation}
                    onClick={onUseCurrentLocation}
                    style={{
                        ...fieldStyle,
                        cursor: currentLocation ? "pointer" : "not-allowed",
                        opacity: currentLocation ? 1 : 0.55
                    }}
                >
                    Usar mi ubicación
                </button>

                <button
                    type="button"
                    onClick={onSelectOnMap}
                    style={{
                        ...fieldStyle,
                        cursor: "pointer",
                        borderColor: selectingOnMap
                            ? "#F59E0B"
                            : fieldStyle.border.split(" ").at(-1)
                    }}
                >
                    {selectingOnMap ? "Haz clic en el mapa" : "Elegir en mapa"}
                </button>
            </div>

            <div
                style={{
                    borderRadius: 9,
                    padding: "8px 10px",
                    background: location
                        ? "rgba(34, 197, 94, 0.12)"
                        : "rgba(245, 158, 11, 0.12)",
                    color: location ? "#BBF7D0" : "#FDE68A",
                    fontSize: 12
                }}
            >
                {location
                    ? `Ubicación lista: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                    : "Selecciona dónde ocurre el incidente."}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        ...fieldStyle,
                        cursor: "pointer"
                    }}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={
                        submitting ||
                        !location ||
                        description.trim().length < 3
                    }
                    style={{
                        border: 0,
                        borderRadius: 10,
                        padding: "10px 12px",
                        background: "#F97316",
                        color: "#111827",
                        fontWeight: 800,
                        cursor: submitting ? "wait" : "pointer",
                        opacity:
                            !location || description.trim().length < 3
                                ? 0.55
                                : 1
                    }}
                >
                    {submitting ? "Guardando…" : "Publicar reporte"}
                </button>
            </div>
        </form>
    );
}
