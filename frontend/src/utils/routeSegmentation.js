import lineSlice from "@turf/line-slice";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import {
    directionColor,
    directionForFeature
} from "./routeDirectionStyle.js";

function pointFeature(location) {
    return {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude]
        }
    };
}

function collectLines(geometry, properties, output) {
    if (!geometry) return;

    if (geometry.type === "LineString") {
        output.push({
            type: "Feature",
            properties: { ...properties },
            geometry
        });
        return;
    }

    if (geometry.type === "MultiLineString") {
        for (const coordinates of geometry.coordinates) {
            collectLines(
                { type: "LineString", coordinates },
                properties,
                output
            );
        }
        return;
    }

    if (geometry.type === "GeometryCollection") {
        for (const child of geometry.geometries ?? []) {
            collectLines(child, properties, output);
        }
    }
}

export function normalizeRouteLines(geojson) {
    const lines = [];
    const rootProperties = geojson?.properties ?? {};

    if (geojson?.type === "FeatureCollection") {
        geojson.features.forEach((feature, featureIndex) => {
            collectLines(
                feature.geometry,
                {
                    ...rootProperties,
                    ...feature.properties,
                    sourceFeatureIndex: featureIndex
                },
                lines
            );
        });
    }
    else if (geojson?.type === "Feature") {
        collectLines(
            geojson.geometry,
            { ...rootProperties, ...geojson.properties },
            lines
        );
    }
    else {
        collectLines(geojson, rootProperties, lines);
    }

    return lines.filter(
        line => line.geometry.coordinates.length >= 2
    );
}

function routeMetadata(geojson) {
    return {
        color:
            geojson?.properties?.color ||
            geojson?.features?.[0]?.properties?.color ||
            "#2563EB",
        name:
            geojson?.properties?.name ||
            geojson?.properties?.nase ||
            geojson?.features?.[0]?.properties?.name ||
            `Ruta ${geojson?.properties?.route ?? ""}`.trim()
    };
}

function renderFeature(
    feature,
    metadata,
    direction,
    segmentType,
    used
) {
    return {
        ...feature,
        properties: {
            ...feature.properties,
            direction,
            routeName: metadata.name,
            routeColor: metadata.color,
            segmentType,
            renderColor: directionColor(metadata.color, direction),
            renderOpacity: used ? 1 : 0.3,
            renderWidth: used ? 6 : 4
        }
    };
}

export function styleManualRoute(geojson) {
    const metadata = routeMetadata(geojson);

    return {
        type: "FeatureCollection",
        properties: geojson?.properties ?? {},
        features: normalizeRouteLines(geojson).map((feature, index) =>
            renderFeature(
                feature,
                metadata,
                directionForFeature(feature, index),
                "complete",
                true
            )
        )
    };
}

function bestLineCandidate(lines, start, end) {
    const startPoint = pointFeature(start);
    const endPoint = pointFeature(end);

    return lines
        .map((line, index) => {
            const snappedStart = nearestPointOnLine(line, startPoint);
            const snappedEnd = nearestPointOnLine(line, endPoint);

            return {
                index,
                line,
                snappedStart,
                snappedEnd,
                score:
                    (snappedStart.properties.dist ?? Infinity) +
                    (snappedEnd.properties.dist ?? Infinity)
            };
        })
        .sort((left, right) => left.score - right.score)[0];
}

function slicedParts(candidate) {
    const { line, snappedStart, snappedEnd } = candidate;
    const coordinates = line.geometry.coordinates;
    const first = {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
    const last = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Point",
            coordinates: coordinates[coordinates.length - 1]
        }
    };
    const startLocation = snappedStart.properties.location ?? 0;
    const endLocation = snappedEnd.properties.location ?? 0;
    const lower = startLocation <= endLocation
        ? snappedStart
        : snappedEnd;
    const upper = startLocation <= endLocation
        ? snappedEnd
        : snappedStart;
    const parts = [];

    if ((lower.properties.location ?? 0) > 0.5) {
        parts.push(["before", lineSlice(first, lower, line), false]);
    }

    parts.push(["useful", lineSlice(lower, upper, line), true]);

    const totalLocation = nearestPointOnLine(line, last)
        .properties.location ?? 0;
    if (totalLocation - (upper.properties.location ?? 0) > 0.5) {
        parts.push(["after", lineSlice(upper, last, line), false]);
    }

    return parts;
}

export function segmentCalculatedRoute(
    geojson,
    start,
    end
) {
    const lines = normalizeRouteLines(geojson);
    const metadata = routeMetadata(geojson);

    if (!start || !end || lines.length === 0) {
        return styleManualRoute(geojson);
    }

    const candidate = bestLineCandidate(lines, start, end);
    const features = [];

    lines.forEach((line, index) => {
        const direction = directionForFeature(line, index);

        if (index !== candidate.index) {
            features.push(
                renderFeature(
                    line,
                    metadata,
                    direction,
                    "unused",
                    false
                )
            );
            return;
        }

        for (const [segmentType, segment, used] of slicedParts(candidate)) {
            features.push(
                renderFeature(
                    segment,
                    metadata,
                    direction,
                    segmentType,
                    used
                )
            );
        }
    });

    return {
        type: "FeatureCollection",
        properties: geojson?.properties ?? {},
        features
    };
}

export function routeEndpoints(planOption, routeIndex) {
    const transfers = planOption?.transferPoints ?? [];
    const isFirst = routeIndex === 0;
    const isLast = routeIndex === (planOption?.routes?.length ?? 1) - 1;

    return {
        start: isFirst
            ? planOption?.boardingPoint
            : transfers[routeIndex - 1]?.toPoint,
        end: isLast
            ? planOption?.dropoffPoint
            : transfers[routeIndex]?.fromPoint
    };
}
