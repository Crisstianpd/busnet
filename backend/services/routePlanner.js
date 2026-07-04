import {
    distance,
    lineIntersect,
    nearestPointOnLine,
    point
} from "@turf/turf";
import { resolveRoutingConfig } from "../config/routing.js";

function roundMeters(value) {
    return Math.round(value);
}

function toLocation(feature) {
    const [longitude, latitude] = feature.geometry.coordinates;

    return {
        latitude,
        longitude
    };
}

function compareOptions(left, right) {
    return (
        left.walkingDistanceMeters - right.walkingDistanceMeters ||
        left.radiusUsedMeters - right.radiusUsedMeters ||
        left.transfers - right.transfers ||
        left.routes.join("-").localeCompare(right.routes.join("-"))
    );
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
                nearest = {
                    distanceMeters,
                    snappedPoint,
                    line
                };
            }
        }
        catch {
            // Una geometría defectuosa no debe detener el resto del cálculo.
        }
    }

    return nearest;
}

export function findNearbyRoutes(searchPoint, routes, config) {
    const measuredRoutes = routes
        .map(route => {
            const nearest = nearestRoutePoint(searchPoint, route);

            return nearest
                ? {
                    ...route,
                    ...nearest
                }
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

    return {
        radiusMeters:
            measuredRoutes[0]?.requiredRadiusMeters ??
            config.maximumRadiusMeters,
        candidates: measuredRoutes
    };
}

function createDirectOption(originRoute, destinationRoute) {
    const boardingDistanceMeters = roundMeters(originRoute.distanceMeters);
    const destinationDistanceMeters = roundMeters(
        destinationRoute.distanceMeters
    );

    return {
        type: "direct",
        routes: [originRoute.route],
        routeDetails: [{
            route: originRoute.route,
            name: originRoute.name,
            color: originRoute.color
        }],
        transfers: 0,
        walkingDistanceMeters:
            boardingDistanceMeters + destinationDistanceMeters,
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
        dropoffPointLabel: "Punto de descenso aproximado"
    };
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

function findTransfer(routeFrom, routeTo, maximumWalkMeters) {
    let bestTransfer = null;

    for (const fromLine of routeFrom.lines) {
        for (const toLine of routeTo.lines) {
            try {
                const intersections = lineIntersect(
                    fromLine.feature,
                    toLine.feature
                );

                for (const intersection of intersections.features) {
                    const candidate = {
                        distanceMeters: 0,
                        firstPoint: intersection,
                        secondPoint: intersection
                    };

                    if (
                        !bestTransfer ||
                        candidate.distanceMeters < bestTransfer.distanceMeters
                    ) {
                        bestTransfer = candidate;
                    }
                }

                if (bestTransfer?.distanceMeters === 0) continue;

                const candidate = findClosestPointsBetweenLines(
                    fromLine.feature,
                    toLine.feature
                );

                if (
                    candidate &&
                    candidate.distanceMeters <= maximumWalkMeters &&
                    (
                        !bestTransfer ||
                        candidate.distanceMeters < bestTransfer.distanceMeters
                    )
                ) {
                    bestTransfer = candidate;
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

function createTransferOption(
    originRoute,
    destinationRoute,
    transfer
) {
    const boardingDistanceMeters = roundMeters(originRoute.distanceMeters);
    const destinationDistanceMeters = roundMeters(
        destinationRoute.distanceMeters
    );
    const transferWalkDistanceMeters = roundMeters(transfer.distanceMeters);

    return {
        type: "transfer",
        routes: [originRoute.route, destinationRoute.route],
        routeDetails: [
            {
                route: originRoute.route,
                name: originRoute.name,
                color: originRoute.color
            },
            {
                route: destinationRoute.route,
                name: destinationRoute.name,
                color: destinationRoute.color
            }
        ],
        transfers: 1,
        walkingDistanceMeters:
            boardingDistanceMeters +
            transferWalkDistanceMeters +
            destinationDistanceMeters,
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
        transferFromPoint: toLocation(transfer.firstPoint),
        transferToPoint: toLocation(transfer.secondPoint),
        boardingPointLabel: "Punto de abordaje aproximado",
        dropoffPointLabel: "Punto de descenso aproximado",
        transferPointLabel: "Punto de transbordo aproximado"
    };
}

function findDirectOptions(originCandidates, destinationCandidates) {
    const destinationByRoute = new Map(
        destinationCandidates.map(route => [route.route, route])
    );

    return originCandidates
        .filter(route => destinationByRoute.has(route.route))
        .map(route => createDirectOption(
            route,
            destinationByRoute.get(route.route)
        ))
        .sort(compareOptions);
}

function findTransferOptions(
    originCandidates,
    destinationCandidates,
    config
) {
    if (config.maximumTransfers < 1) return [];

    const options = [];

    for (const originRoute of originCandidates) {
        for (const destinationRoute of destinationCandidates) {
            if (originRoute.route === destinationRoute.route) continue;

            const transfer = findTransfer(
                originRoute,
                destinationRoute,
                config.maximumTransferWalkMeters
            );

            if (!transfer) continue;

            options.push(createTransferOption(
                originRoute,
                destinationRoute,
                transfer
            ));
        }
    }

    return options.sort(compareOptions);
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
        destinationSearch.candidates
    );
    const foundOptions = directOptions.length > 0
        ? directOptions
        : findTransferOptions(
            originSearch.candidates,
            destinationSearch.candidates,
            config
        );
    const rankedOptions = foundOptions
        .sort(compareOptions)
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
