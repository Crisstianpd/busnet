import { useState } from "react";
import { Icon } from "../ui";
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

function formatDistance(value, fallback = "No disponible") {
    if (!Number.isFinite(value)) return fallback;

    const rounded = Math.round(value);

    if (rounded <= 1) return "Sobre la ruta";
    if (rounded >= 1000) {
        const kilometers = rounded / 1000;

        return `${kilometers >= 10 ? Math.round(kilometers) : kilometers.toFixed(1)} km`;
    }

    return `${rounded} m`;
}

function formatPoint(point) {
    if (
        !Number.isFinite(point?.latitude) ||
        !Number.isFinite(point?.longitude)
    ) return "Coordenadas no disponibles";

    return `GPS ${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
}

function routeDetail(option, index) {
    const route = option.routes?.[index] ?? "";
    const detail = option.routeDetails?.[index] ?? {};

    return {
        route,
        name: detail.name || `Ruta ${route}`.trim(),
        color: detail.color || `var(--route-${(index % 8) + 1})`
    };
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
    if (option.type === "direct") return "Directa";

    return (option.transferCount ?? 1) === 1
        ? "Con transbordo"
        : `${option.transferCount ?? 2} transbordos`;
}

function busLegs(option) {
    return (option.legs ?? []).filter(leg => leg.type === "bus");
}

function RoutePill({ detail, compact = false }) {
    return (
        <span
            className={`trip-route-pill ${compact ? "is-compact" : ""}`}
            style={{ "--route-color": detail.color }}
        >
            {detail.route}
        </span>
    );
}

function RouteChain({ option }) {
    if (option.type === "walk") {
        return (
            <div className="trip-route-chain">
                <span className="trip-chain-node is-origin">Inicio</span>
                <Icon name="chevron-right" size={13} />
                <span className="trip-chain-walk">
                    Caminar {formatDistance(option.walkingDistanceMeters)}
                </span>
                <Icon name="chevron-right" size={13} />
                <span className="trip-chain-node is-destination">Destino</span>
            </div>
        );
    }

    return (
        <div className="trip-route-chain">
            <span className="trip-chain-node is-origin">Inicio</span>
            <Icon name="chevron-right" size={13} />
            <span className="trip-chain-walk">
                {formatDistance(option.boardingDistanceMeters)}
            </span>
            <Icon name="chevron-right" size={13} />
            {(option.routes ?? []).map((route, index) => {
                const detail = routeDetail(option, index);

                return (
                    <span
                        className="trip-chain-segment"
                        key={`${route}-${index}`}
                    >
                        <RoutePill detail={detail} compact />
                        {index < (option.routes ?? []).length - 1 && (
                            <Icon name="chevron-right" size={13} />
                        )}
                    </span>
                );
            })}
            <Icon name="chevron-right" size={13} />
            <span className="trip-chain-walk">
                {formatDistance(option.destinationDistanceMeters)}
            </span>
            <Icon name="chevron-right" size={13} />
            <span className="trip-chain-node is-destination">Destino</span>
        </div>
    );
}

function buildSteps(option) {
    if (option.type === "walk") {
        return [{
            type: "walk",
            title: "Caminá hasta el destino",
            detail: formatDistance(option.walkingDistanceMeters),
            meta: option.reason,
            icon: "footprints"
        }];
    }

    const transfers = option.transferPoints ?? option.transfers ?? [];
    const busDistances = busLegs(option);
    const steps = [{
        type: "walk",
        title: "Caminá al punto de abordaje",
        detail: formatDistance(option.boardingDistanceMeters),
        meta: formatPoint(option.boardingPoint),
        icon: "footprints"
    }];

    (option.routes ?? []).forEach((route, index) => {
        const detail = routeDetail(option, index);
        const busDistance = busDistances[index]?.distanceMeters;

        steps.push({
            type: "bus",
            title: `Tomá ${detail.name}`,
            routeDetail: detail,
            detail: formatDistance(busDistance, "Tramo en bus"),
            meta: index === 0 ? "Ruta inicial" : "Continuación del viaje",
            icon: "bus"
        });

        if (transfers[index]) {
            const transfer = transfers[index];

            steps.push({
                type: "transfer",
                title: `Transbordá a ${transfer.toRoute}`,
                detail: formatDistance(transfer.walkingDistanceMeters),
                meta: formatPoint(transfer.fromPoint),
                icon: "repeat"
            });
        }
    });

    steps.push({
        type: "destination",
        title: "Bajate cerca del destino",
        detail: `${formatDistance(option.destinationDistanceMeters)} a pie`,
        meta: formatPoint(option.dropoffPoint),
        icon: "flag"
    });

    return steps;
}

function TripStep({ step, last }) {
    return (
        <li className={`trip-step is-${step.type} ${last ? "is-last" : ""}`}>
            <span className="trip-step-marker" aria-hidden="true">
                {step.type === "bus" && step.routeDetail
                    ? <RoutePill detail={step.routeDetail} compact />
                    : <Icon name={step.icon} size={15} />}
            </span>
            <span className="trip-step-body">
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
                {step.meta && <small>{step.meta}</small>}
            </span>
        </li>
    );
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
    const busCount = option.type === "walk"
        ? 0
        : option.routes?.length ?? 0;
    const transferCount = option.type === "walk"
        ? 0
        : Math.max(0, busCount - 1);
    const routeSummary = option.type === "walk"
        ? "Caminar"
        : (option.routes ?? []).join(" + ");
    const walkingDistance = formatDistance(option.walkingDistanceMeters);
    const steps = buildSteps(option);
    const trafficLabel = communityAnalysisLoading && !communityAnalysis
        ? "Analizando tráfico"
        : trafficLevels[trafficLevel]?.label;

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
                <span className="trip-option-main">
                    <span className="trip-option-label-row">
                        <span className="trip-option-rank">
                            {primary ? "Mejor ruta" : `Alternativa ${optionIndex + 1}`}
                        </span>
                        <span className={`trip-traffic-pill is-${trafficLevel}`}>
                            {trafficLabel}
                        </span>
                    </span>
                    <span className="trip-option-title-row">
                        <strong>{routeSummary}</strong>
                    </span>
                    <RouteChain option={option} />
                </span>

                <span className="trip-option-total">
                    <b>{minutes ? minutes : "—"}</b>
                    <small>min</small>
                </span>
            </button>

            <div className="trip-option-metrics" aria-label="Resumen del viaje">
                <div>
                    <dt>Pasaje</dt>
                    <dd>${cost.toFixed(2)}</dd>
                </div>
                <div>
                    <dt>Transbordos</dt>
                    <dd>{transferCount}</dd>
                </div>
                <div>
                    <dt>Caminata</dt>
                    <dd>{walkingDistance}</dd>
                </div>
                <div>
                    <dt>Tiempo</dt>
                    <dd>{minutes ? `${minutes} min` : "No disponible"}</dd>
                </div>
                <div>
                    <dt>Tipo de viaje</dt>
                    <dd>{tripTypeLabel(option)}</dd>
                </div>
                <div>
                    <dt>Búsqueda</dt>
                    <dd>{formatDistance(option.radiusUsedMeters)}</dd>
                </div>
            </div>

            {expanded && (
                <div className="trip-option-details">
                    <div className="trip-option-section-heading">
                        <span>Cómo se toma</span>
                        <small>
                            {option.type === "walk"
                                ? "Sin buses"
                                : `${busCount} ${
                                    busCount === 1 ? "bus" : "buses"
                                }`}
                        </small>
                    </div>

                    <ol className="trip-stepper">
                        {steps.map((step, index) => (
                            <TripStep
                                key={`${step.type}-${step.title}-${index}`}
                                step={step}
                                last={index === steps.length - 1}
                            />
                        ))}
                    </ol>

                    {communityAnalysis?.trafficLevel === "high" && (
                        <div className="trip-option-warning">
                            Hay tráfico alto reportado por la comunidad.
                        </div>
                    )}

                    {suggestedAlternative && (
                        <div className="trip-option-suggestion">
                            Alternativa sugerida:{" "}
                            <b>{suggestedAlternative.routes.join(" + ")}</b>
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
    const [expandedKey, setExpandedKey] = useState(null);

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
    const bestKey = optionKey(plan.bestOption);
    const expandedOptionKey = options.some(
        option => optionKey(option) === expandedKey
    )
        ? expandedKey
        : expandedKey === ""
            ? ""
            : bestKey;
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
                        expanded={expandedOptionKey === key}
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
