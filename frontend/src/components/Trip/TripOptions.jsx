import { useState } from "react";
import "./TripOptions.css";

const trafficLevels = {
    none: { label: "Sin reportes", score: 0, multiplier: 1 },
    low: { label: "Tráfico bajo", score: 1, multiplier: 1.1 },
    medium: { label: "Tráfico medio", score: 2, multiplier: 1.25 },
    high: { label: "Tráfico alto", score: 3, multiplier: 1.45 }
};

function optionKey(option) {
    return option
        ? `${option.type}:${(option.routes ?? []).join(">")}`
        : "";
}

function formatDistance(value) {
    if (!Number.isFinite(value)) return "No disponible";
    const rounded = Math.round(value);
    return rounded <= 1 ? "Sobre la ruta (≤ 1 m)" : `${rounded} m`;
}

function formatPoint(point) {
    if (
        !Number.isFinite(point?.latitude) ||
        !Number.isFinite(point?.longitude)
    ) return "No disponible";

    return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
}

function routeName(option, index) {
    return (
        option.routeDetails?.[index]?.name ||
        `Ruta ${option.routes?.[index] ?? ""}`.trim()
    );
}

function tripCost(option) {
    return option.type === "walk"
        ? 0
        : (option.routes?.length ?? 0) * 0.25;
}

function estimatedTime(option, trafficLevel) {
    const walkingMeters = Number(option.walkingDistanceMeters) || 0;
    const walkingMinutes = walkingMeters / 75;
    const busMetersFromLegs = (option.legs ?? [])
        .filter(leg => leg.type === "bus")
        .reduce(
            (total, leg) =>
                total + (Number(leg.distanceMeters) || 0),
            0
        );
    const fallbackBusMeters = Math.max(
        0,
        (Number(option.estimatedDistanceMeters) || 0) -
            walkingMeters
    );
    const busMeters = busMetersFromLegs || fallbackBusMeters;

    if (option.type !== "walk" && busMeters <= 0) return null;

    const multiplier =
        trafficLevels[trafficLevel]?.multiplier ?? 1;
    const busMinutes = (busMeters / (22_000 / 60)) * multiplier;

    return Math.max(1, Math.round(walkingMinutes + busMinutes));
}

function tripTypeLabel(option) {
    if (option.type === "walk") return "Caminando";
    if (option.type === "direct") return "Viaje directo";
    return (option.transferCount ?? 1) === 1
        ? "Con transbordo"
        : "Con transbordos";
}

function OptionCard({
    option,
    optionIndex,
    primary,
    selected,
    expanded,
    onToggle,
    communityAnalysis,
    communityAnalysisLoading,
    suggestedAlternative
}) {
    const trafficLevel = communityAnalysis?.trafficLevel ?? "none";
    const minutes = estimatedTime(option, trafficLevel);
    const cost = tripCost(option);
    const transfers = option.transferPoints ?? [];
    const busCount = option.type === "walk"
        ? 0
        : option.routes?.length ?? 0;
    const transferCount = option.type === "walk"
        ? 0
        : Math.max(0, busCount - 1);
    const busLabel = `${busCount} ${busCount === 1 ? "bus" : "buses"}`;
    const transferLabel =
        `${transferCount} ${
            transferCount === 1 ? "transbordo" : "transbordos"
        }`;

    return (
        <article
            className={`trip-option-card ${
                primary ? "is-primary" : ""
            } ${selected ? "is-selected" : ""}`}
        >
            <button
                type="button"
                className="trip-option-summary"
                onClick={onToggle}
                aria-expanded={expanded}
            >
                <span className="trip-option-route-mark" aria-hidden="true">
                    {option.type === "walk" ? "↟" : primary ? "★" : "→"}
                </span>
                <span className="trip-option-heading">
                    <small>
                        {primary
                            ? "Ruta recomendada · Alternativa 1"
                            : `Alternativa ${optionIndex + 1}`}
                    </small>
                    <strong>
                        {option.type === "walk"
                            ? "Caminar hasta el destino"
                            : (option.routes ?? []).join(" → ")}
                    </strong>
                    <span>
                        {tripTypeLabel(option)} · {busLabel} ·{" "}
                        {transferLabel} · ${cost.toFixed(2)}
                    </span>
                </span>
                <span className="trip-option-quick">
                    <b>${cost.toFixed(2)}</b>
                    <small>
                        {minutes ? `≈ ${minutes} min` : "Tiempo no disponible"}
                    </small>
                </span>
                <span className="trip-option-chevron" aria-hidden="true">
                    {expanded ? "⌃" : "⌄"}
                </span>
            </button>

            {expanded && (
                <div className="trip-option-details">
                    <div className="trip-option-badges">
                        <span className={`is-${trafficLevel}`}>
                            {communityAnalysisLoading && !communityAnalysis
                                ? "Analizando tráfico…"
                                : trafficLevels[trafficLevel]?.label}
                        </span>
                        <span>{tripTypeLabel(option)}</span>
                    </div>

                    {option.type !== "walk" && (
                        <div className="trip-option-route-list">
                            {(option.routes ?? []).map((route, index) => (
                                <div key={`${route}-${index}`}>
                                    <i>{index + 1}</i>
                                    <span>
                                        <small>
                                            {index === 0
                                                ? "Ruta inicial"
                                                : "Continuar en"}
                                        </small>
                                        <b>{routeName(option, index)}</b>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <dl className="trip-option-metrics">
                        <div>
                            <dt>Costo promedio</dt>
                            <dd>${cost.toFixed(2)}</dd>
                        </div>
                        <div>
                            <dt>Tiempo promedio</dt>
                            <dd>
                                {minutes
                                    ? `${minutes} min aprox.`
                                    : "No disponible"}
                            </dd>
                        </div>
                        <div>
                            <dt>Distancia caminando</dt>
                            <dd>
                                {formatDistance(option.walkingDistanceMeters)}
                            </dd>
                        </div>
                        <div>
                            <dt>Radio de búsqueda</dt>
                            <dd>{formatDistance(option.radiusUsedMeters)}</dd>
                        </div>
                    </dl>

                    {option.type !== "walk" && (
                        <div className="trip-option-points">
                            <p>
                                <b>Punto de abordaje aproximado</b>
                                <span>{formatPoint(option.boardingPoint)}</span>
                                <small>
                                    A {formatDistance(option.boardingDistanceMeters)}
                                </small>
                            </p>
                            {transfers.map(transfer => (
                                <p key={`${transfer.order}-${transfer.fromRoute}`}>
                                    <b>
                                        Punto de transbordo aproximado{" "}
                                        {transfer.order}
                                    </b>
                                    <span>{formatPoint(transfer.fromPoint)}</span>
                                    <small>
                                        De {transfer.fromRoute} a {transfer.toRoute}
                                    </small>
                                </p>
                            ))}
                            <p>
                                <b>Punto de descenso aproximado</b>
                                <span>{formatPoint(option.dropoffPoint)}</span>
                                <small>
                                    A {formatDistance(
                                        option.destinationDistanceMeters
                                    )} del destino
                                </small>
                            </p>
                        </div>
                    )}

                    {communityAnalysis?.trafficLevel === "high" && (
                        <div className="trip-option-warning">
                            Hay tráfico alto reportado por la comunidad en esta ruta.
                        </div>
                    )}

                    {suggestedAlternative && (
                        <div className="trip-option-suggestion">
                            Considera la alternativa{" "}
                            <b>{suggestedAlternative.routes.join(" → ")}</b>{" "}
                            para evitar tráfico.
                        </div>
                    )}

                    {option.reason && (
                        <p className="trip-option-reason">{option.reason}</p>
                    )}

                    {option.type !== "walk" && (
                        <small className="trip-option-disclaimer">
                            Los puntos son aproximados, no paradas oficiales.
                        </small>
                    )}
                </div>
            )}
        </article>
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
    const [expandedKey, setExpandedKey] = useState("");

    if (loading) {
        return <div className="trip-options-status">Calculando rutas cercanas…</div>;
    }
    if (error) {
        return <div className="trip-options-status is-error">{error}</div>;
    }
    if (!plan?.bestOption) {
        return (
            <div className="trip-options-status">
                Selecciona origen y destino para ver opciones.
            </div>
        );
    }

    const options = [plan.bestOption, ...(plan.alternatives ?? [])];
    const suggestedAlternativeFor = option => {
        const current = communityAnalysisByOption[optionKey(option)];
        if (current?.trafficLevel !== "high") return null;

        return options
            .filter(candidate => optionKey(candidate) !== optionKey(option))
            .filter(candidate => {
                const candidateLevel =
                    communityAnalysisByOption[optionKey(candidate)]
                        ?.trafficLevel;

                return (
                    trafficLevels[candidateLevel] &&
                    trafficLevels[candidateLevel].score <
                        trafficLevels.high.score
                );
            })
            .sort((left, right) =>
                trafficLevels[
                    communityAnalysisByOption[optionKey(left)]?.trafficLevel
                ].score -
                trafficLevels[
                    communityAnalysisByOption[optionKey(right)]?.trafficLevel
                ].score
            )[0] ?? null;
    };

    return (
        <div className="trip-options-list">
            {options.map((option, index) => {
                const key = optionKey(option);

                return (
                    <OptionCard
                        key={`${key}-${index}`}
                        option={option}
                        optionIndex={index}
                        primary={index === 0}
                        selected={optionKey(selectedOption) === key}
                        expanded={expandedKey === key}
                        onToggle={() => {
                            onSelectOption(option);
                            setExpandedKey(current =>
                                current === key ? "" : key
                            );
                        }}
                        communityAnalysis={communityAnalysisByOption[key]}
                        communityAnalysisLoading={communityAnalysisLoading}
                        suggestedAlternative={
                            suggestedAlternativeFor(option)
                        }
                    />
                );
            })}
        </div>
    );
}
