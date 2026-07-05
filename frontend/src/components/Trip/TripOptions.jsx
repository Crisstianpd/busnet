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

const trafficLevels = {
    none: {
        label: "Sin reportes",
        color: "#166534",
        background: "#DCFCE7",
        score: 0
    },
    low: {
        label: "Tráfico bajo",
        color: "#166534",
        background: "#DCFCE7",
        score: 1
    },
    medium: {
        label: "Tráfico medio",
        color: "#854D0E",
        background: "#FEF9C3",
        score: 2
    },
    high: {
        label: "Tráfico alto",
        color: "#991B1B",
        background: "#FEE2E2",
        score: 3
    }
};

function OptionCard({
    option,
    primary = false,
    selected = false,
    onSelect,
    communityAnalysis,
    communityAnalysisLoading = false,
    suggestedAlternative
}) {
    const transfer = option.transferPoints?.[0];
    const isWalk = option.type === "walk";
    const trafficLevel =
        communityAnalysis?.trafficLevel ?? null;
    const trafficStyle = trafficLevels[trafficLevel];

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

            {!isWalk && (
                <div style={{ marginTop: 7 }}>
                    {communityAnalysisLoading && !communityAnalysis ? (
                        <span
                            style={{
                                display: "inline-flex",
                                borderRadius: 999,
                                padding: "4px 8px",
                                background: "#E2E8F0",
                                color: "#334155",
                                fontSize: 12,
                                fontWeight: 800
                            }}
                        >
                            Analizando tráfico comunitario…
                        </span>
                    ) : trafficStyle ? (
                        <span
                            style={{
                                display: "inline-flex",
                                borderRadius: 999,
                                padding: "4px 8px",
                                background: trafficStyle.background,
                                color: trafficStyle.color,
                                fontSize: 12,
                                fontWeight: 900
                            }}
                        >
                            {trafficStyle.label}
                        </span>
                    ) : null}
                </div>
            )}

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
                <>
                    {communityAnalysis?.trafficLevel === "high" && (
                        <div
                            style={{
                                marginTop: 9,
                                borderLeft: "3px solid #DC2626",
                                padding: "7px 8px",
                                background: "#FEF2F2",
                                color: "#7F1D1D",
                                fontSize: 13
                            }}
                        >
                            Hay tráfico alto reportado por la comunidad en esta ruta.
                        </div>
                    )}

                    {suggestedAlternative && (
                        <div
                            style={{
                                marginTop: 7,
                                borderLeft: "3px solid #F59E0B",
                                padding: "7px 8px",
                                background: "#FFFBEB",
                                color: "#78350F",
                                fontSize: 13
                            }}
                        >
                            Considera la alternativa{" "}
                            <b>{suggestedAlternative.routes.join(" → ")}</b>{" "}
                            para evitar tráfico.
                        </div>
                    )}

                    <small
                        style={{
                            display: "block",
                            marginTop: 8,
                            color: "#000000"
                        }}
                    >
                        Los puntos mostrados son aproximados, no paradas oficiales.
                    </small>
                </>
            )}
        </button>
    );
}

export default function TripOptions({
    plan,
    loading,
    error,
    selectedOption,
    onSelectOption,
    communityAnalysisByOption = {},
    communityAnalysisLoading = false
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

    const options = [
        plan.bestOption,
        ...(plan.alternatives ?? [])
    ];
    const suggestedAlternativeFor = option => {
        const current =
            communityAnalysisByOption[optionKey(option)];
        const currentLevel = trafficLevels[current?.trafficLevel];

        if (!currentLevel || current?.trafficLevel !== "high") {
            return null;
        }

        return options
            .filter(candidate =>
                optionKey(candidate) !== optionKey(option)
            )
            .filter(candidate => {
                const candidateAnalysis =
                    communityAnalysisByOption[optionKey(candidate)];
                const candidateLevel =
                    trafficLevels[candidateAnalysis?.trafficLevel];

                return (
                    candidateLevel &&
                    candidateLevel.score < currentLevel.score
                );
            })
            .sort((left, right) => {
                const leftLevel = trafficLevels[
                    communityAnalysisByOption[
                        optionKey(left)
                    ].trafficLevel
                ];
                const rightLevel = trafficLevels[
                    communityAnalysisByOption[
                        optionKey(right)
                    ].trafficLevel
                ];

                return leftLevel.score - rightLevel.score;
            })[0] ?? null;
    };

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
                communityAnalysis={
                    communityAnalysisByOption[
                        optionKey(plan.bestOption)
                    ]
                }
                communityAnalysisLoading={
                    communityAnalysisLoading
                }
                suggestedAlternative={
                    suggestedAlternativeFor(plan.bestOption)
                }
            />

            {(plan.alternatives ?? []).map((option, index) => (
                <OptionCard
                    key={`${optionKey(option)}-${index}`}
                    option={option}
                    selected={
                        optionKey(selectedOption) === optionKey(option)
                    }
                    onSelect={onSelectOption}
                    communityAnalysis={
                        communityAnalysisByOption[optionKey(option)]
                    }
                    communityAnalysisLoading={
                        communityAnalysisLoading
                    }
                    suggestedAlternative={
                        suggestedAlternativeFor(option)
                    }
                />
            ))}
        </div>
    );
}
