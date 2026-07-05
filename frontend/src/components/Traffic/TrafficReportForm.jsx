import { useState } from "react";

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
            className="community-report-form"
        >
            <label>
                Tipo de incidente
                <select
                    value={type}
                    onChange={event => setType(event.target.value)}
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

            <label>
                Severidad
                <select
                    value={severity}
                    onChange={event => setSeverity(event.target.value)}
                >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
            </label>

            <label>
                Descripción breve
                <textarea
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    maxLength={200}
                    rows={3}
                    placeholder="¿Qué está ocurriendo?"
                />
            </label>

            <label>
                Zona aproximada
                <select
                    value={radiusMeters}
                    onChange={event =>
                        setRadiusMeters(Number(event.target.value))
                    }
                >
                    <option value={100}>100 metros</option>
                    <option value={150}>150 metros</option>
                    <option value={250}>250 metros</option>
                    <option value={400}>400 metros</option>
                </select>
            </label>

            <div className="community-report-actions">
                <button
                    type="button"
                    disabled={!currentLocation}
                    onClick={onUseCurrentLocation}
                >
                    Usar mi ubicación
                </button>

                <button
                    type="button"
                    onClick={onSelectOnMap}
                    className={selectingOnMap ? "is-selecting" : ""}
                >
                    {selectingOnMap ? "Haz clic en el mapa" : "Elegir en mapa"}
                </button>
            </div>

            <div
                className={`community-report-location ${
                    location ? "is-ready" : "is-pending"
                }`}
            >
                {location
                    ? `Ubicación lista: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                    : "Selecciona dónde ocurre el incidente."}
            </div>

            <div className="community-report-actions">
                <button
                    type="button"
                    onClick={onCancel}
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
                    className="is-submit"
                >
                    {submitting ? "Guardando…" : "Publicar reporte"}
                </button>
            </div>
        </form>
    );
}
