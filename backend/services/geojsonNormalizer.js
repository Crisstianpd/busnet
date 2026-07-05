import { flattenEach } from "@turf/turf";

function hasValidCoordinates(feature) {
    const coordinates = feature?.geometry?.coordinates;

    return (
        feature?.geometry?.type === "LineString" &&
        Array.isArray(coordinates) &&
        coordinates.length >= 2 &&
        coordinates.every(
            coordinate =>
                Array.isArray(coordinate) &&
                coordinate.length >= 2 &&
                Number.isFinite(Number(coordinate[0])) &&
                Number.isFinite(Number(coordinate[1]))
        )
    );
}

function normalizeDirection(properties = {}) {
    const explicitDirection = String(
        properties.direction ?? ""
    ).toLowerCase();

    if (
        explicitDirection === "ida" ||
        explicitDirection === "regreso"
    ) {
        return explicitDirection;
    }

    const declaredDirection = String(
        properties.SENTIDO ??
        properties.sentido ??
        properties.name ??
        ""
    ).toLowerCase();

    if (declaredDirection.includes("regreso")) return "regreso";
    if (declaredDirection.includes("ida")) return "ida";

    return "estimado";
}

export function normalizeRoute(route) {
    const lines = [];

    try {
        flattenEach(route.geojson, (
            flattenedFeature,
            featureIndex,
            multiFeatureIndex
        ) => {
            if (!hasValidCoordinates(flattenedFeature)) return;

            lines.push({
                route: route.route,
                name: route.name,
                color: route.color,
                feature: flattenedFeature,
                geometry: flattenedFeature.geometry,
                coordinates: flattenedFeature.geometry.coordinates,
                direction: normalizeDirection(
                    flattenedFeature.properties
                ),
                featureIndex,
                multiFeatureIndex
            });
        });
    }
    catch (error) {
        console.warn(
            `No se pudo normalizar la ruta ${route.route}: ${error.message}`
        );
    }

    return {
        route: route.route,
        name: route.name,
        color: route.color,
        geojson: route.geojson,
        lines
    };
}

export function normalizeRoutes(routes) {
    return routes
        .map(normalizeRoute)
        .filter(route => route.lines.length > 0);
}
