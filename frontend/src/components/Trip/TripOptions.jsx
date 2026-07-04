function formatDistance(value) {
    const roundedValue = Math.round(value);

    return roundedValue <= 1
        ? "Sobre la ruta (≤ 1 m)"
        : `${roundedValue} m`;
}

function OptionCard({ option, primary = false }) {
    return (
        <article
            style={{
                border: primary ? "2px solid #2563EB" : "1px solid #D6E1EA",
                borderRadius: 12,
                padding: 12,
                background: primary ? "#EFF6FF" : "#FFFFFF",
                color: "#000000"
            }}
        >
            <strong>
                {primary ? "Ruta recomendada" : "Alternativa"}:{" "}
                {option.routes.join(" → ")}
            </strong>

            <div style={{ marginTop: 6, color: "#000000", fontSize: 14 }}>
                {option.type === "direct"
                    ? "Viaje directo"
                    : "Viaje con un transbordo"}
            </div>

            <div style={{ marginTop: 8, color: "#000000", fontSize: 13 }}>
                <b>Distancia caminando estimada:</b>{" "}
                {formatDistance(option.walkingDistanceMeters)}
                <br />
                Punto de abordaje aproximado:{" "}
                {formatDistance(option.boardingDistanceMeters)}
                <br />
                Punto de descenso aproximado:{" "}
                {formatDistance(option.destinationDistanceMeters)}
                <br />
                {option.type === "transfer" && (
                    <>
                        Transbordo aproximado:{" "}
                        {formatDistance(option.transferWalkDistanceMeters)}
                        <br />
                    </>
                )}
                Radio usado en la búsqueda:{" "}
                {formatDistance(option.radiusUsedMeters)}
            </div>

            <small
                style={{
                    display: "block",
                    marginTop: 8,
                    color: "#000000"
                }}
            >
                Los puntos de abordaje y descenso son aproximados.
            </small>
        </article>
    );
}

export default function TripOptions({ plan, loading, error }) {
    if (loading) {
        return <div style={{ padding: 14 }}>Calculando rutas cercanas…</div>;
    }

    if (error) {
        return (
            <div style={{ padding: 14, color: "#B91C1C" }}>
                {error}
            </div>
        );
    }

    if (!plan?.bestOption) {
        return (
            <div style={{ padding: 14 }}>
                Haz clic en el mapa para seleccionar tu destino.
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gap: 10,
                maxHeight: "42vh",
                overflowY: "auto",
                padding: 12
            }}
        >
            <OptionCard option={plan.bestOption} primary />

            {plan.alternatives.map((option, index) => (
                <OptionCard
                    key={`${option.routes.join("-")}-${index}`}
                    option={option}
                />
            ))}
        </div>
    );
}
