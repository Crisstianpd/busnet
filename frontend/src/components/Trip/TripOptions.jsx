function formatDistance(value) {
    const roundedValue = Math.round(value);

    return roundedValue <= 1
        ? "Sobre la ruta (≤ 1 m)"
        : `${roundedValue} m`;
}

function optionKey(option) {
    return option
        ? `${option.type}:${(option.routes ?? []).join(">")}`
        : "";
}

function routeName(option, index) {
    return (
        option.routeDetails?.[index]?.name ||
        `Ruta ${option.routes[index]}`
    );
}

function OptionCard({
    option,
    primary = false,
    selected = false,
    onSelect
}) {
    const transfer = option.transferPoints?.[0];
    const isWalk = option.type === "walk";

    return (
        <button
            type="button"
            onClick={() => onSelect(option)}
            style={{
                width: "100%",
                border: selected
                    ? "3px solid #2563EB"
                    : primary
                        ? "2px solid #2563EB"
                        : "1px solid #D6E1EA",
                borderRadius: 12,
                padding: 12,
                background: primary ? "#EFF6FF" : "#FFFFFF",
                color: "#000000",
                textAlign: "left",
                cursor: "pointer"
            }}
        >
            <strong style={{ color: "#000000" }}>
                {isWalk
                    ? "Recomendación: caminar"
                    : `${primary ? "Ruta recomendada" : "Alternativa"}: ${
                        (option.routes ?? []).join(" → ")
                    }`}
            </strong>

            <div style={{ marginTop: 6, color: "#000000", fontSize: 14 }}>
                {isWalk
                    ? "Trayecto a pie"
                    : option.type === "direct"
                    ? "Viaje directo"
                    : "Viaje con transbordo"}
            </div>

            {isWalk ? (
                <div style={{ marginTop: 8, color: "#000000" }}>
                    {option.reason}
                </div>
            ) : option.type === "direct" ? (
                <div style={{ marginTop: 8, color: "#000000" }}>
                    <b>Ruta:</b> {routeName(option, 0)}
                </div>
            ) : (
                <>
                    <div style={{ marginTop: 8, color: "#000000" }}>
                        <b>Ruta inicial:</b> {routeName(option, 0)}
                    </div>
                    <div style={{ marginTop: 4, color: "#000000" }}>
                        <b>Punto de transbordo aproximado:</b>{" "}
                        {formatDistance(
                            transfer?.walkingDistanceMeters ??
                            option.transferWalkDistanceMeters
                        )} de caminata
                    </div>
                    <div style={{ marginTop: 4, color: "#000000" }}>
                        <b>Ruta final:</b>{" "}
                        {routeName(option, option.routes.length - 1)}
                    </div>
                </>
            )}

            <div style={{ marginTop: 8, color: "#000000", fontSize: 13 }}>
                <b>
                    {isWalk
                        ? "Distancia caminando estimada:"
                        : "Distancia caminando total:"}
                </b>{" "}
                {formatDistance(option.walkingDistanceMeters)}
                {!isWalk && (
                    <>
                        <br />
                        <b>Punto de abordaje aproximado:</b>{" "}
                        {formatDistance(option.boardingDistanceMeters)}
                        <br />
                        <b>Punto de descenso aproximado:</b>{" "}
                        {formatDistance(option.destinationDistanceMeters)}
                        <br />
                        <b>Radio usado en la búsqueda:</b>{" "}
                        {formatDistance(option.radiusUsedMeters)}
                    </>
                )}
            </div>

            {!isWalk && (
                <small
                    style={{
                        display: "block",
                        marginTop: 8,
                        color: "#000000"
                    }}
                >
                    Los puntos mostrados son aproximados, no paradas oficiales.
                </small>
            )}
        </button>
    );
}

export default function TripOptions({
    plan,
    loading,
    error,
    selectedOption,
    onSelectOption
}) {
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
                Selecciona un destino o haz clic en el mapa.
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gap: 10,
                maxHeight: "48vh",
                overflowY: "auto",
                padding: 12
            }}
        >
            <OptionCard
                option={plan.bestOption}
                primary
                selected={
                    optionKey(selectedOption) ===
                    optionKey(plan.bestOption)
                }
                onSelect={onSelectOption}
            />

            {(plan.alternatives ?? []).map((option, index) => (
                <OptionCard
                    key={`${optionKey(option)}-${index}`}
                    option={option}
                    selected={
                        optionKey(selectedOption) === optionKey(option)
                    }
                    onSelect={onSelectOption}
                />
            ))}
        </div>
    );
}
