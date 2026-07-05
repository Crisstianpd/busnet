import {
    bbox,
    distance,
    length,
    lineIntersect,
    lineSlice,
    nearestPointOnLine,
    point,
    simplify
} from "@turf/turf";
import { resolveRoutingConfig } from "../config/routing.js";

const networkCache = new WeakMap();
const connectionLinesCache = new WeakMap();
const routeBoundsCache = new WeakMap();

function roundMeters(value) {
    return Math.round(value);
}

function toLocation(feature) {
    const [longitude, latitude] = feature.geometry.coordinates;

    return { latitude, longitude };
}

function directionRank(confidence) {
    return {
        high: 0,
        medium: 1,
        low: 2
    }[confidence] ?? 2;
}

function compareOptions(left, right, config) {
    const accessPenalty = option =>
        (
            option.boardingDistanceMeters >
                config.preferredWalkToRouteMeters
                ? 10000
                : 0
        ) + (
            option.destinationDistanceMeters >
                config.preferredWalkToRouteMeters
                ? 10000
                : 0
        );

    return (
        directionRank(left.directionConfidence) -
            directionRank(right.directionConfidence) ||
        (
            left.walkingDistanceMeters + accessPenalty(left)
        ) - (
            right.walkingDistanceMeters + accessPenalty(right)
        ) ||
        left.routes.length - right.routes.length ||
        left.transferCount - right.transferCount ||
        left.estimatedDistanceMeters - right.estimatedDistanceMeters ||
        left.radiusUsedMeters - right.radiusUsedMeters ||
        left.routes.join("-").localeCompare(right.routes.join("-"))
    );
}

function removeDuplicateOptions(options) {
    const seen = new Set();

    return options.filter(option => {
        const key = `${option.type}:${option.routes.join(">")}`;

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

function requiredRadius(distanceMeters, config) {
    const expandedRadius = Math.ceil(
        distanceMeters / config.radiusIncrementMeters
    ) * config.radiusIncrementMeters;

    return Math.min(
        config.maximumRadiusMeters,
        Math.max(config.initialRadiusMeters, expandedRadius)
    );
}

function nearestRoutePoint(searchPoint, route) {
    let nearest = null;

    for (const line of route.lines) {
        try {
            const snappedPoint = nearestPointOnLine(
                line.feature,
                searchPoint,
                { units: "kilometers" }
            );
            const distanceMeters = distance(
                searchPoint,
                snappedPoint,
                { units: "meters" }
            );

            if (!nearest || distanceMeters < nearest.distanceMeters) {
                nearest = { distanceMeters, snappedPoint, line };
            }
        }
        catch {
            // Una geometría inválida no detiene las demás rutas.
        }
    }

    return nearest;
}

export function findNearbyRoutes(
    searchPoint,
    routes,
    config,
    maximumCandidates = routes.length
) {
    const measuredRoutes = routes
        .map(route => {
            const nearest = nearestRoutePoint(searchPoint, route);

            return nearest
                ? { ...route, ...nearest, searchPoint }
                : null;
        })
        .filter(Boolean)
        .filter(route => route.distanceMeters <= config.maximumRadiusMeters)
        .map(route => ({
            ...route,
            requiredRadiusMeters: requiredRadius(
                route.distanceMeters,
                config
            )
        }))
        .sort((left, right) => left.distanceMeters - right.distanceMeters);
    const radiusMeters =
        measuredRoutes[0]?.requiredRadiusMeters ??
        config.maximumRadiusMeters;

    return {
        radiusMeters,
        candidates: measuredRoutes.filter(
            route => route.distanceMeters <= radiusMeters
        ).slice(0, maximumCandidates)
    };
}

function estimateLineDistanceMeters(fromPoint, toPoint, line) {
    try {
        return roundMeters(
            length(
                lineSlice(fromPoint, toPoint, line),
                { units: "kilometers" }
            ) * 1000
        );
    }
    catch {
        return roundMeters(
            distance(fromPoint, toPoint, { units: "meters" })
        );
    }
}

function estimateRouteDistanceMeters(
    fromPoint,
    toPoint,
    preferredLine
) {
    if (preferredLine?.feature) {
        return estimateLineDistanceMeters(
            fromPoint,
            toPoint,
            preferredLine.feature
        );
    }

    return roundMeters(
        distance(fromPoint, toPoint, { units: "meters" })
    );
}

function getLineVertices(line) {
    return line.geometry.coordinates.map(coordinate => point(coordinate));
}

function findClosestPointsBetweenLines(firstLine, secondLine) {
    let nearest = null;

    const consider = (sourcePoint, targetLine, reverse = false) => {
        const targetPoint = nearestPointOnLine(
            targetLine,
            sourcePoint,
            { units: "kilometers" }
        );
        const distanceMeters = distance(
            sourcePoint,
            targetPoint,
            { units: "meters" }
        );

        if (!nearest || distanceMeters < nearest.distanceMeters) {
            nearest = {
                distanceMeters,
                firstPoint: reverse ? targetPoint : sourcePoint,
                secondPoint: reverse ? sourcePoint : targetPoint
            };
        }
    };

    for (const vertex of getLineVertices(firstLine)) {
        consider(vertex, secondLine);
    }

    for (const vertex of getLineVertices(secondLine)) {
        consider(vertex, firstLine, true);
    }

    return nearest;
}

function getConnectionLines(route) {
    const cached = connectionLinesCache.get(route);

    if (cached) return cached;

    const lines = route.lines.map(line => ({
        source: line,
        feature: simplify(line.feature, {
            tolerance: 0.00005,
            highQuality: false,
            mutate: false
        })
    }));

    connectionLinesCache.set(route, lines);

    return lines;
}

function getRouteBounds(route) {
    const cached = routeBoundsCache.get(route);

    if (cached) return cached;

    const bounds = bbox(route.geojson);

    routeBoundsCache.set(route, bounds);
    return bounds;
}

function minimumBoundsDistanceMeters(firstBounds, secondBounds) {
    const longitudeGap = Math.max(
        0,
        firstBounds[0] - secondBounds[2],
        secondBounds[0] - firstBounds[2]
    ) * 105000;
    const latitudeGap = Math.max(
        0,
        firstBounds[1] - secondBounds[3],
        secondBounds[1] - firstBounds[3]
    ) * 110000;

    return Math.hypot(longitudeGap, latitudeGap);
}

function findTransfers(
    routeFrom,
    routeTo,
    maximumWalkMeters,
    maximumCandidates
) {
    if (
        minimumBoundsDistanceMeters(
            getRouteBounds(routeFrom),
            getRouteBounds(routeTo)
        ) > maximumWalkMeters
    ) {
        return [];
    }

    const candidates = [];
    const seen = new Set();

    for (const fromConnectionLine of getConnectionLines(routeFrom)) {
        for (const toConnectionLine of getConnectionLines(routeTo)) {
            try {
                const fromLine = fromConnectionLine.feature;
                const toLine = toConnectionLine.feature;
                const intersections = lineIntersect(
                    fromLine,
                    toLine
                );

                for (const intersection of intersections.features) {
                    const [longitude, latitude] =
                        intersection.geometry.coordinates;
                    const key = [
                        fromConnectionLine.source.featureIndex,
                        fromConnectionLine.source.multiFeatureIndex,
                        toConnectionLine.source.featureIndex,
                        toConnectionLine.source.multiFeatureIndex,
                        longitude.toFixed(6),
                        latitude.toFixed(6)
                    ].join(":");

                    if (seen.has(key)) continue;
                    seen.add(key);
                    candidates.push({
                        connectionType: "intersection",
                        distanceMeters: 0,
                        firstPoint: intersection,
                        secondPoint: intersection,
                        fromLine: fromConnectionLine.source,
                        toLine: toConnectionLine.source
                    });
                }

                if (intersections.features.length > 0) continue;

                const candidate = findClosestPointsBetweenLines(
                    fromLine,
                    toLine
                );

                if (
                    candidate &&
                    candidate.distanceMeters <= maximumWalkMeters
                ) {
                    candidates.push({
                        ...candidate,
                        connectionType:
                            candidate.distanceMeters <= 1
                                ? "intersection"
                                : "proximity",
                        fromLine: fromConnectionLine.source,
                        toLine: toConnectionLine.source
                    });
                }
            }
            catch {
                // Se ignora únicamente el par de líneas inválido.
            }
        }
    }

    const selectedCandidates = [];
    const candidatesPerDirectionPair = new Map();

    for (const candidate of candidates.sort(
        (left, right) =>
            left.distanceMeters - right.distanceMeters
    )) {
        const directionPair = [
            candidate.fromLine.direction,
            candidate.toLine.direction
        ].join(">");
        const selectedForPair =
            candidatesPerDirectionPair.get(directionPair) ?? 0;

        if (selectedForPair >= 1) continue;

        candidatesPerDirectionPair.set(
            directionPair,
            selectedForPair + 1
        );
        selectedCandidates.push(candidate);

        if (selectedCandidates.length >= maximumCandidates) break;
    }

    return selectedCandidates;
}

function reverseTransfer(transfer) {
    return {
        ...transfer,
        firstPoint: transfer.secondPoint,
        secondPoint: transfer.firstPoint,
        fromLine: transfer.toLine,
        toLine: transfer.fromLine
    };
}

function getTransferCache(routes, config) {
    const cached = networkCache.get(routes);

    if (
        cached &&
        cached.maximumWalkMeters === config.maximumTransferWalkMeters &&
        cached.maximumCandidates ===
            config.maximumTransferCandidatesPerPair
    ) {
        return cached.transfers;
    }

    const transfers = new Map();

    networkCache.set(routes, {
        maximumWalkMeters: config.maximumTransferWalkMeters,
        maximumCandidates:
            config.maximumTransferCandidatesPerPair,
        transfers
    });

    return transfers;
}

function findCachedTransfers(routeFrom, routeTo, routes, config) {
    const cache = getTransferCache(routes, config);
    const key = `${routeFrom.route}>${routeTo.route}`;

    if (cache.has(key)) return cache.get(key);

    const routeTransfers = findTransfers(
        routeFrom,
        routeTo,
        config.maximumTransferWalkMeters,
        config.maximumTransferCandidatesPerPair
    );

    cache.set(key, routeTransfers);
    cache.set(
        `${routeTo.route}>${routeFrom.route}`,
        routeTransfers.map(reverseTransfer)
    );

    return routeTransfers;
}

function analyzeLineDirection(line, fromPoint, toPoint) {
    if (!line?.feature || !fromPoint || !toPoint) {
        return {
            line,
            direction: line?.direction ?? "estimado",
            directionValid: false,
            directionConfidence: "low",
            directionWarnings: [
                "No fue posible validar el orden del recorrido."
            ],
            fromDistanceAlongLineMeters: null,
            toDistanceAlongLineMeters: null,
            fromProjectionDistanceMeters: null,
            toProjectionDistanceMeters: null
        };
    }

    try {
        const snappedFrom = nearestPointOnLine(
            line.feature,
            fromPoint,
            { units: "kilometers" }
        );
        const snappedTo = nearestPointOnLine(
            line.feature,
            toPoint,
            { units: "kilometers" }
        );
        const fromDistanceAlongLineMeters = roundMeters(
            (snappedFrom.properties.location ?? 0) * 1000
        );
        const toDistanceAlongLineMeters = roundMeters(
            (snappedTo.properties.location ?? 0) * 1000
        );
        const directionValid =
            toDistanceAlongLineMeters >
            fromDistanceAlongLineMeters + 1;
        const estimatedDirection = line.direction === "estimado";
        const directionConfidence = directionValid
            ? estimatedDirection ? "medium" : "high"
            : "low";
        const directionWarnings = [];
        const fromProjectionDistanceMeters = roundMeters(distance(
            fromPoint,
            snappedFrom,
            { units: "meters" }
        ));
        const toProjectionDistanceMeters = roundMeters(distance(
            toPoint,
            snappedTo,
            { units: "meters" }
        ));

        if (!directionValid) {
            directionWarnings.push(
                `El recorrido proyectado avanza en orden inverso sobre el sentido ${line.direction}.`
            );
        }
        else if (estimatedDirection) {
            directionWarnings.push(
                "El GeoJSON no declara ida o regreso; el sentido fue estimado por el orden de sus coordenadas."
            );
        }

        return {
            line,
            direction: line.direction ?? "estimado",
            directionValid,
            directionConfidence,
            directionWarnings,
            fromDistanceAlongLineMeters,
            toDistanceAlongLineMeters,
            fromProjectionDistanceMeters,
            toProjectionDistanceMeters,
            snappedFrom,
            snappedTo
        };
    }
    catch {
        return {
            line,
            direction: line.direction ?? "estimado",
            directionValid: false,
            directionConfidence: "low",
            directionWarnings: [
                "No fue posible proyectar los puntos sobre la geometría de la ruta."
            ],
            fromDistanceAlongLineMeters: null,
            toDistanceAlongLineMeters: null,
            fromProjectionDistanceMeters: null,
            toProjectionDistanceMeters: null
        };
    }
}

function selectBestLineForLeg(
    route,
    fromPoint,
    toPoint,
    maximumFromProjectionMeters,
    maximumToProjectionMeters
) {
    const analyses = route.lines
        .map(line => analyzeLineDirection(
            line,
            fromPoint,
            toPoint
        ));
    const viableAnalyses = analyses.filter(analysis =>
        analysis.fromProjectionDistanceMeters <=
            maximumFromProjectionMeters &&
        analysis.toProjectionDistanceMeters <=
            maximumToProjectionMeters
    );

    return (viableAnalyses.length > 0 ? viableAnalyses : analyses)
        .sort((left, right) =>
            directionRank(left.directionConfidence) -
                directionRank(right.directionConfidence) ||
            (
                left.fromProjectionDistanceMeters +
                left.toProjectionDistanceMeters
            ) - (
                right.fromProjectionDistanceMeters +
                right.toProjectionDistanceMeters
            ) ||
            (
                left.toDistanceAlongLineMeters -
                left.fromDistanceAlongLineMeters
            ) - (
                right.toDistanceAlongLineMeters -
                right.fromDistanceAlongLineMeters
            )
        )[0];
}

function summarizeDirection(analyses) {
    const directionConfidence = analyses.reduce(
        (worst, analysis) =>
            directionRank(analysis.directionConfidence) >
            directionRank(worst)
                ? analysis.directionConfidence
                : worst,
        "high"
    );
    const directionWarnings = [
        ...new Set(
            analyses.flatMap(
                analysis => analysis.directionWarnings ?? []
            )
        )
    ];

    return { directionConfidence, directionWarnings };
}

function measureCandidateOnLine(candidate, line, config) {
    try {
        const snappedPoint = nearestPointOnLine(
            line.feature,
            candidate.searchPoint,
            { units: "kilometers" }
        );
        const distanceMeters = distance(
            candidate.searchPoint,
            snappedPoint,
            { units: "meters" }
        );

        if (distanceMeters > config.maximumRadiusMeters) return null;

        return {
            ...candidate,
            line,
            snappedPoint,
            distanceMeters,
            requiredRadiusMeters: requiredRadius(
                distanceMeters,
                config
            )
        };
    }
    catch {
        return null;
    }
}

function createWalkOption(walkingDistanceMeters) {
    return {
        type: "walk",
        transferCount: 0,
        routes: [],
        routeDetails: [],
        legs: [],
        transfers: [],
        transferPoints: [],
        walkingDistanceMeters,
        boardingDistanceMeters: 0,
        destinationDistanceMeters: 0,
        estimatedDistanceMeters: walkingDistanceMeters,
        radiusUsedMeters: 0,
        boardingPoint: null,
        dropoffPoint: null,
        directionConfidence: "high",
        directionWarnings: [],
        estimated: true,
        reason:
            "El destino está cerca. Se recomienda caminar."
    };
}

function createDirectOption(originRoute, destinationRoute, config) {
    const boardingDistanceMeters = roundMeters(originRoute.distanceMeters);
    const destinationDistanceMeters = roundMeters(
        destinationRoute.distanceMeters
    );
    const directionAnalysis = analyzeLineDirection(
        originRoute.line,
        originRoute.snappedPoint,
        destinationRoute.snappedPoint
    );
    const busDistanceMeters = estimateRouteDistanceMeters(
        originRoute.snappedPoint,
        destinationRoute.snappedPoint,
        originRoute.line
    );
    const walkingDistanceMeters =
        boardingDistanceMeters + destinationDistanceMeters;

    return {
        type: "direct",
        transferCount: 0,
        routes: [originRoute.route],
        routeDetails: [{
            route: originRoute.route,
            name: originRoute.name,
            color: originRoute.color
        }],
        legs: [
            { type: "walk", distanceMeters: boardingDistanceMeters },
            {
                type: "bus",
                route: originRoute.route,
                distanceMeters: busDistanceMeters,
                direction: directionAnalysis.direction,
                directionValid: directionAnalysis.directionValid,
                directionConfidence:
                    directionAnalysis.directionConfidence,
                fromDistanceAlongLineMeters:
                    directionAnalysis.fromDistanceAlongLineMeters,
                toDistanceAlongLineMeters:
                    directionAnalysis.toDistanceAlongLineMeters
            },
            { type: "walk", distanceMeters: destinationDistanceMeters }
        ],
        transfers: [],
        transferPoints: [],
        walkingDistanceMeters,
        estimatedDistanceMeters:
            walkingDistanceMeters + busDistanceMeters,
        boardingDistanceMeters,
        destinationDistanceMeters,
        transferWalkDistanceMeters: 0,
        originRadiusMeters: originRoute.requiredRadiusMeters,
        destinationRadiusMeters: destinationRoute.requiredRadiusMeters,
        radiusUsedMeters: Math.max(
            originRoute.requiredRadiusMeters,
            destinationRoute.requiredRadiusMeters
        ),
        boardingPoint: toLocation(originRoute.snappedPoint),
        dropoffPoint: toLocation(destinationRoute.snappedPoint),
        boardingPointLabel: "Punto de abordaje aproximado",
        dropoffPointLabel: "Punto de descenso aproximado",
        directionConfidence: directionAnalysis.directionConfidence,
        directionWarnings: directionAnalysis.directionWarnings,
        estimated: true,
        reason:
            boardingDistanceMeters <=
                config.preferredWalkToRouteMeters &&
            destinationDistanceMeters <=
                config.preferredWalkToRouteMeters
                ? "Existe una ruta directa con abordaje y descenso cercanos."
                : `Existe una ruta directa, pero requiere caminar más de ${config.preferredWalkToRouteMeters} metros en uno de sus extremos.`
    };
}

function createTransferRecord(transfer, fromRoute, toRoute, order) {
    const fromPoint = toLocation(transfer.firstPoint);
    const toPoint = toLocation(transfer.secondPoint);

    return {
        order,
        label: "Punto de transbordo aproximado",
        fromRoute,
        toRoute,
        connectionType: transfer.connectionType,
        walkingDistanceMeters: roundMeters(transfer.distanceMeters),
        latitude: fromPoint.latitude,
        longitude: fromPoint.longitude,
        fromPoint,
        toPoint
    };
}

function createPathOption(
    originRoute,
    destinationRoute,
    state,
    config
) {
    const transfers = state.edges.map((edge, index) =>
        createTransferRecord(
            edge.transfer,
            state.routeObjects[index].route,
            state.routeObjects[index + 1].route,
            index + 1
        )
    );
    const transferWalkDistanceMeters = transfers.reduce(
        (total, transfer) => total + transfer.walkingDistanceMeters,
        0
    );
    const busLegDetails = state.routeObjects.map((route, index) => {
        const startPoint = index === 0
            ? originRoute.searchPoint
            : state.edges[index - 1].transfer.secondPoint;
        const endPoint = index === state.edges.length
            ? destinationRoute.searchPoint
            : state.edges[index].transfer.firstPoint;
        const directionAnalysis = selectBestLineForLeg(
            route,
            startPoint,
            endPoint,
            index === 0
                ? config.maximumRadiusMeters
                : config.maximumTransferWalkMeters,
            index === state.edges.length
                ? config.maximumRadiusMeters
                : config.maximumTransferWalkMeters
        );
        const preferredLine = directionAnalysis.line;

        return {
            route: route.route,
            distanceMeters: estimateRouteDistanceMeters(
                directionAnalysis.snappedFrom ?? startPoint,
                directionAnalysis.snappedTo ?? endPoint,
                preferredLine
            ),
            ...directionAnalysis
        };
    });
    const selectedBoardingPoint =
        busLegDetails[0]?.snappedFrom ??
        originRoute.snappedPoint;
    const selectedDropoffPoint =
        busLegDetails[busLegDetails.length - 1]?.snappedTo ??
        destinationRoute.snappedPoint;
    const boardingDistanceMeters = roundMeters(distance(
        originRoute.searchPoint,
        selectedBoardingPoint,
        { units: "meters" }
    ));
    const destinationDistanceMeters = roundMeters(distance(
        destinationRoute.searchPoint,
        selectedDropoffPoint,
        { units: "meters" }
    ));
    const walkingDistanceMeters =
        boardingDistanceMeters +
        transferWalkDistanceMeters +
        destinationDistanceMeters;
    const estimatedBusDistanceMeters = busLegDetails.reduce(
        (total, leg) => total + leg.distanceMeters,
        0
    );
    const directionSummary = summarizeDirection(busLegDetails);
    const legs = [
        { type: "walk", distanceMeters: boardingDistanceMeters }
    ];

    state.routeObjects.forEach((route, index) => {
        legs.push({
            type: "bus",
            route: route.route,
            distanceMeters: busLegDetails[index].distanceMeters,
            direction: busLegDetails[index].direction,
            directionValid: busLegDetails[index].directionValid,
            directionConfidence:
                busLegDetails[index].directionConfidence,
            fromDistanceAlongLineMeters:
                busLegDetails[index].fromDistanceAlongLineMeters,
            toDistanceAlongLineMeters:
                busLegDetails[index].toDistanceAlongLineMeters
        });

        if (transfers[index]) {
            legs.push({
                type: "walk",
                reason: "Punto de transbordo aproximado",
                distanceMeters: transfers[index].walkingDistanceMeters
            });
        }
    });
    legs.push({
        type: "walk",
        distanceMeters: destinationDistanceMeters
    });

    return {
        type: "transfer",
        transferCount: transfers.length,
        routes: state.routeObjects.map(route => route.route),
        routeDetails: state.routeObjects.map(route => ({
            route: route.route,
            name: route.name,
            color: route.color
        })),
        legs,
        transfers,
        transferPoints: transfers,
        walkingDistanceMeters,
        estimatedDistanceMeters:
            walkingDistanceMeters + estimatedBusDistanceMeters,
        boardingDistanceMeters,
        destinationDistanceMeters,
        transferWalkDistanceMeters,
        originRadiusMeters: requiredRadius(
            boardingDistanceMeters,
            config
        ),
        destinationRadiusMeters: requiredRadius(
            destinationDistanceMeters,
            config
        ),
        radiusUsedMeters: Math.max(
            requiredRadius(boardingDistanceMeters, config),
            requiredRadius(destinationDistanceMeters, config)
        ),
        boardingPoint: toLocation(selectedBoardingPoint),
        dropoffPoint: toLocation(selectedDropoffPoint),
        transferFromPoint: transfers[0]?.fromPoint,
        transferToPoint: transfers[0]?.toPoint,
        boardingPointLabel: "Punto de abordaje aproximado",
        dropoffPointLabel: "Punto de descenso aproximado",
        transferPointLabel: "Punto de transbordo aproximado",
        directionConfidence: directionSummary.directionConfidence,
        directionWarnings: directionSummary.directionWarnings,
        estimated: true,
        reason:
            transfers.length === 1
                ? "Se encontró una conexión entre dos rutas cercanas."
                : `Se encontró una combinación de rutas con ${transfers.length} puntos de transbordo aproximados.`
    };
}

function findDirectOptions(
    originCandidates,
    destinationCandidates,
    config
) {
    const destinationByRoute = new Map(
        destinationCandidates.map(route => [route.route, route])
    );

    return originCandidates
        .filter(route => destinationByRoute.has(route.route))
        .flatMap(route => {
            const destinationRoute = destinationByRoute.get(
                route.route
            );

            return route.lines
                .map(line => {
                    const measuredOrigin = measureCandidateOnLine(
                        route,
                        line,
                        config
                    );
                    const measuredDestination = measureCandidateOnLine(
                        destinationRoute,
                        line,
                        config
                    );

                    return measuredOrigin && measuredDestination
                        ? createDirectOption(
                            measuredOrigin,
                            measuredDestination,
                            config
                        )
                        : null;
                })
                .filter(Boolean);
        });
}

function findConnectedOptions(
    originCandidates,
    destinationCandidates,
    routes,
    config
) {
    if (config.maximumTransfers < 1) return [];

    const routeById = new Map(routes.map(route => [route.route, route]));
    const options = [];
    let searchedStates = 0;

    for (const originCandidate of originCandidates) {
        const originRoute = routeById.get(originCandidate.route);

        for (const destinationCandidate of destinationCandidates) {
            if (originCandidate.route === destinationCandidate.route) {
                continue;
            }
            if (searchedStates >= config.maximumSearchStates) {
                return options;
            }

            searchedStates += 1;
            if (config.performanceMeasurements) {
                config.performanceMeasurements.searchedStates =
                    searchedStates;
            }
            const destinationRoute = routeById.get(
                destinationCandidate.route
            );
            const transfers = findCachedTransfers(
                originRoute,
                destinationRoute,
                routes,
                config
            );

            for (const transfer of transfers) {
                options.push(createPathOption(
                    originCandidate,
                    destinationCandidate,
                    {
                        routeObjects: [
                            originRoute,
                            destinationRoute
                        ],
                        edges: [{ route: destinationRoute, transfer }]
                    },
                    config
                ));
                if (
                    options.length >=
                    config.maximumGeneratedOptions
                ) return options;
            }
        }
    }

    if (config.maximumTransfers < 2) return options;

    for (const destinationCandidate of destinationCandidates) {
        const destinationRoute = routeById.get(
            destinationCandidate.route
        );

        for (const intermediateRoute of routes) {
            if (
                intermediateRoute.route ===
                destinationCandidate.route
            ) continue;
            if (searchedStates >= config.maximumSearchStates) {
                return options;
            }

            searchedStates += 1;
            if (config.performanceMeasurements) {
                config.performanceMeasurements.searchedStates =
                    searchedStates;
            }
            const secondTransfers = findCachedTransfers(
                intermediateRoute,
                destinationRoute,
                routes,
                config
            );

            if (secondTransfers.length === 0) continue;

            for (const originCandidate of originCandidates) {
                if (
                    originCandidate.route ===
                        destinationCandidate.route ||
                    originCandidate.route === intermediateRoute.route
                ) {
                    continue;
                }
                if (searchedStates >= config.maximumSearchStates) {
                    return options;
                }

                searchedStates += 1;
                if (config.performanceMeasurements) {
                    config.performanceMeasurements.searchedStates =
                        searchedStates;
                }
                const originRoute = routeById.get(
                    originCandidate.route
                );
                const firstTransfers = findCachedTransfers(
                    originRoute,
                    intermediateRoute,
                    routes,
                    config
                );

                if (firstTransfers.length === 0) continue;

                for (const firstTransfer of firstTransfers) {
                    for (const secondTransfer of secondTransfers) {
                        options.push(createPathOption(
                            originCandidate,
                            destinationCandidate,
                            {
                                routeObjects: [
                                    originRoute,
                                    intermediateRoute,
                                    destinationRoute
                                ],
                                edges: [
                                    {
                                        route: intermediateRoute,
                                        transfer: firstTransfer
                                    },
                                    {
                                        route: destinationRoute,
                                        transfer: secondTransfer
                                    }
                                ]
                            },
                            config
                        ));
                        if (
                            options.length >=
                            config.maximumGeneratedOptions
                        ) return options;
                    }
                }
            }
        }
    }

    return options;
}

export function planTrip({
    origin,
    destination,
    routes,
    options = {}
}) {
    const requestStartedAt = performance.now();
    const config = resolveRoutingConfig(options);
    const performanceMeasurements = {};
    config.performanceMeasurements = performanceMeasurements;
    const measure = (name, callback) => {
        const startedAt = performance.now();
        const value = callback();

        performanceMeasurements[name] = Number(
            (performance.now() - startedAt).toFixed(2)
        );
        return value;
    };
    const finish = result => {
        performanceMeasurements.totalMilliseconds = Number(
            (performance.now() - requestStartedAt).toFixed(2)
        );

        if (config.enablePerformanceLogs) {
            result.search.performance = performanceMeasurements;
            console.info(
                "[Trip Planner performance]",
                performanceMeasurements
            );
        }

        return result;
    };
    const originPoint = point([origin.longitude, origin.latitude]);
    const destinationPoint = point([
        destination.longitude,
        destination.latitude
    ]);
    const directWalkingDistanceMeters = roundMeters(
        distance(originPoint, destinationPoint, { units: "meters" })
    );

    if (
        directWalkingDistanceMeters <=
        config.walkOnlyThresholdMeters
    ) {
        return finish({
            search: {
                originRadiusMeters: 0,
                destinationRadiusMeters: 0,
                maximumRadiusMeters: config.maximumRadiusMeters
            },
            bestOption: createWalkOption(directWalkingDistanceMeters),
            alternatives: []
        });
    }

    const originSearch = measure(
        "originCandidatesMilliseconds",
        () => findNearbyRoutes(
            originPoint,
            routes,
            config,
            config.maximumOriginCandidates
        )
    );
    const destinationSearch = measure(
        "destinationCandidatesMilliseconds",
        () => findNearbyRoutes(
            destinationPoint,
            routes,
            config,
            config.maximumDestinationCandidates
        )
    );
    const search = {
        originRadiusMeters: originSearch.radiusMeters,
        destinationRadiusMeters: destinationSearch.radiusMeters,
        maximumRadiusMeters: config.maximumRadiusMeters
    };

    if (
        originSearch.candidates.length === 0 ||
        destinationSearch.candidates.length === 0
    ) {
        return finish({
            search,
            bestOption: null,
            alternatives: []
        });
    }

    const directOptions = measure(
        "directOptionsMilliseconds",
        () => findDirectOptions(
            originSearch.candidates,
            destinationSearch.candidates,
            config
        )
    );
    const hasConvenientDirectOption = directOptions.some(
        option =>
            option.boardingDistanceMeters <=
                config.preferredWalkToRouteMeters &&
            option.destinationDistanceMeters <=
                config.preferredWalkToRouteMeters
    );
    const connectedOptions = measure(
        "connectionsMilliseconds",
        () => hasConvenientDirectOption
            ? []
            : findConnectedOptions(
                originSearch.candidates,
                destinationSearch.candidates,
                routes,
                config
            )
    );
    const rankedOptions = measure(
        "rankingMilliseconds",
        () => removeDuplicateOptions([
            ...directOptions,
            ...connectedOptions
        ].sort((left, right) => compareOptions(
            left,
            right,
            config
        ))).slice(0, config.maximumAlternatives)
    );
    const bestOption = rankedOptions[0] ?? null;

    return finish({
        search: bestOption
            ? {
                ...search,
                originRadiusMeters: bestOption.originRadiusMeters,
                destinationRadiusMeters: bestOption.destinationRadiusMeters
            }
            : search,
        bestOption,
        alternatives: rankedOptions.slice(1)
    });
}
