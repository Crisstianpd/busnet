import {
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

function roundMeters(value) {
    return Math.round(value);
}

function toLocation(feature) {
    const [longitude, latitude] = feature.geometry.coordinates;

    return { latitude, longitude };
}

function compareOptions(left, right) {
    return (
        left.walkingDistanceMeters - right.walkingDistanceMeters ||
        left.transferCount - right.transferCount ||
        left.radiusUsedMeters - right.radiusUsedMeters ||
        left.estimatedDistanceMeters - right.estimatedDistanceMeters ||
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

export function findNearbyRoutes(searchPoint, routes, config) {
    const measuredRoutes = routes
        .map(route => {
            const nearest = nearestRoutePoint(searchPoint, route);

            return nearest ? { ...route, ...nearest } : null;
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
        )
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

function findTransfer(routeFrom, routeTo, maximumWalkMeters) {
    let bestTransfer = null;

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
                    if (!bestTransfer || bestTransfer.distanceMeters > 0) {
                        bestTransfer = {
                            connectionType: "intersection",
                            distanceMeters: 0,
                            firstPoint: intersection,
                            secondPoint: intersection,
                            fromLine: fromConnectionLine.source,
                            toLine: toConnectionLine.source
                        };
                    }
                }

                if (bestTransfer?.distanceMeters === 0) continue;

                const candidate = findClosestPointsBetweenLines(
                    fromLine,
                    toLine
                );

                if (
                    candidate &&
                    candidate.distanceMeters <= maximumWalkMeters &&
                    (
                        !bestTransfer ||
                        candidate.distanceMeters < bestTransfer.distanceMeters
                    )
                ) {
                    bestTransfer = {
                        ...candidate,
                        connectionType:
                            candidate.distanceMeters <= 1
                                ? "intersection"
                                : "proximity",
                        fromLine: fromConnectionLine.source,
                        toLine: toConnectionLine.source
                    };
                }
            }
            catch {
                // Se ignora únicamente el par de líneas inválido.
            }
        }
    }

    return bestTransfer &&
        bestTransfer.distanceMeters <= maximumWalkMeters
        ? bestTransfer
        : null;
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
        cached.maximumWalkMeters === config.maximumTransferWalkMeters
    ) {
        return cached.transfers;
    }

    const transfers = new Map();

    networkCache.set(routes, {
        maximumWalkMeters: config.maximumTransferWalkMeters,
        transfers
    });

    return transfers;
}

function findCachedTransfer(routeFrom, routeTo, routes, config) {
    const cache = getTransferCache(routes, config);
    const key = `${routeFrom.route}>${routeTo.route}`;

    if (cache.has(key)) return cache.get(key);

    const transfer = findTransfer(
        routeFrom,
        routeTo,
        config.maximumTransferWalkMeters
    );

    cache.set(key, transfer);
    cache.set(
        `${routeTo.route}>${routeFrom.route}`,
        transfer ? reverseTransfer(transfer) : null
    );

    return transfer;
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
        estimated: true,
        reason:
            "El destino está a menos de 200 metros. Se recomienda caminar."
    };
}

function createDirectOption(originRoute, destinationRoute, config) {
    const boardingDistanceMeters = roundMeters(originRoute.distanceMeters);
    const destinationDistanceMeters = roundMeters(
        destinationRoute.distanceMeters
    );
    const busDistanceMeters =
        originRoute.line === destinationRoute.line
            ? estimateRouteDistanceMeters(
                originRoute.snappedPoint,
                destinationRoute.snappedPoint,
                originRoute.line
            )
            : roundMeters(distance(
                originRoute.snappedPoint,
                destinationRoute.snappedPoint,
                { units: "meters" }
            ));
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
                distanceMeters: busDistanceMeters
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
        estimated: true,
        reason:
            boardingDistanceMeters <=
                config.directBoardingThresholdMeters
                ? "Existe una ruta directa con abordaje cercano."
                : `Existe una ruta directa, pero el abordaje requiere caminar más de ${config.directBoardingThresholdMeters} metros.`
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

function createPathOption(originRoute, destinationRoute, state) {
    const boardingDistanceMeters = roundMeters(originRoute.distanceMeters);
    const destinationDistanceMeters = roundMeters(
        destinationRoute.distanceMeters
    );
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
    const walkingDistanceMeters =
        boardingDistanceMeters +
        transferWalkDistanceMeters +
        destinationDistanceMeters;
    const busDistances = state.routeObjects.map((route, index) => {
        const startPoint = index === 0
            ? originRoute.snappedPoint
            : state.edges[index - 1].transfer.secondPoint;
        const endPoint = index === state.edges.length
            ? destinationRoute.snappedPoint
            : state.edges[index].transfer.firstPoint;
        const preferredLine = index === 0
            ? state.edges[0]?.transfer.fromLine
            : state.edges[index - 1]?.transfer.toLine;

        return estimateRouteDistanceMeters(
            startPoint,
            endPoint,
            preferredLine
        );
    });
    const estimatedBusDistanceMeters = busDistances.reduce(
        (total, value) => total + value,
        0
    );
    const legs = [
        { type: "walk", distanceMeters: boardingDistanceMeters }
    ];

    state.routeObjects.forEach((route, index) => {
        legs.push({
            type: "bus",
            route: route.route,
            distanceMeters: busDistances[index]
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
        originRadiusMeters: originRoute.requiredRadiusMeters,
        destinationRadiusMeters: destinationRoute.requiredRadiusMeters,
        radiusUsedMeters: Math.max(
            originRoute.requiredRadiusMeters,
            destinationRoute.requiredRadiusMeters
        ),
        boardingPoint: toLocation(originRoute.snappedPoint),
        dropoffPoint: toLocation(destinationRoute.snappedPoint),
        transferFromPoint: transfers[0]?.fromPoint,
        transferToPoint: transfers[0]?.toPoint,
        boardingPointLabel: "Punto de abordaje aproximado",
        dropoffPointLabel: "Punto de descenso aproximado",
        transferPointLabel: "Punto de transbordo aproximado",
        estimated: true,
        reason:
            transfers.length === 1
                ? "Se encontró una conexión entre dos rutas cercanas."
                : "Se encontró una combinación de rutas con dos transbordos aproximados."
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
        .map(route => createDirectOption(
            route,
            destinationByRoute.get(route.route),
            config
        ));
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

            if (searchedStates >= config.maximumSearchStates) return options;
            searchedStates += 1;

            const destinationRoute = routeById.get(
                destinationCandidate.route
            );
            const transfer = findCachedTransfer(
                originRoute,
                destinationRoute,
                routes,
                config
            );

            if (!transfer) continue;

            options.push(createPathOption(
                originCandidate,
                destinationCandidate,
                {
                    routeObjects: [originRoute, destinationRoute],
                    edges: [{ route: destinationRoute, transfer }]
                }
            ));
        }
    }

    if (
        config.maximumTransfers < 2 ||
        options.length >= config.maximumAlternatives
    ) {
        return options;
    }

    for (const originCandidate of originCandidates) {
        const originRoute = routeById.get(originCandidate.route);

        for (const intermediateRoute of routes) {
            if (intermediateRoute.route === originCandidate.route) continue;

            if (searchedStates >= config.maximumSearchStates) return options;
            searchedStates += 1;

            const firstTransfer = findCachedTransfer(
                originRoute,
                intermediateRoute,
                routes,
                config
            );

            if (!firstTransfer) continue;

            for (const destinationCandidate of destinationCandidates) {
                if (
                    destinationCandidate.route === originCandidate.route ||
                    destinationCandidate.route === intermediateRoute.route
                ) {
                    continue;
                }

                if (
                    searchedStates >= config.maximumSearchStates
                ) return options;
                searchedStates += 1;

                const destinationRoute = routeById.get(
                    destinationCandidate.route
                );
                const secondTransfer = findCachedTransfer(
                    intermediateRoute,
                    destinationRoute,
                    routes,
                    config
                );

                if (!secondTransfer) continue;

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
                    }
                ));
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
    const config = resolveRoutingConfig(options);
    const originPoint = point([origin.longitude, origin.latitude]);
    const destinationPoint = point([
        destination.longitude,
        destination.latitude
    ]);
    const directWalkingDistanceMeters = roundMeters(
        distance(originPoint, destinationPoint, { units: "meters" })
    );

    if (directWalkingDistanceMeters < config.walkThresholdMeters) {
        return {
            search: {
                originRadiusMeters: 0,
                destinationRadiusMeters: 0,
                maximumRadiusMeters: config.maximumRadiusMeters
            },
            bestOption: createWalkOption(directWalkingDistanceMeters),
            alternatives: []
        };
    }

    const originSearch = findNearbyRoutes(originPoint, routes, config);
    const destinationSearch = findNearbyRoutes(
        destinationPoint,
        routes,
        config
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
        return {
            search,
            bestOption: null,
            alternatives: []
        };
    }

    const directOptions = findDirectOptions(
        originSearch.candidates,
        destinationSearch.candidates,
        config
    );
    const hasConvenientDirectOption = directOptions.some(
        option =>
            option.boardingDistanceMeters <=
            config.directBoardingThresholdMeters
    );
    const connectedOptions = hasConvenientDirectOption
        ? []
        : findConnectedOptions(
            originSearch.candidates,
            destinationSearch.candidates,
            routes,
            config
        );
    const rankedOptions = removeDuplicateOptions([
        ...directOptions,
        ...connectedOptions
    ].sort(compareOptions))
        .slice(0, config.maximumAlternatives);
    const bestOption = rankedOptions[0] ?? null;

    return {
        search: bestOption
            ? {
                ...search,
                originRadiusMeters: bestOption.originRadiusMeters,
                destinationRadiusMeters: bestOption.destinationRadiusMeters
            }
            : search,
        bestOption,
        alternatives: rankedOptions.slice(1)
    };
}
