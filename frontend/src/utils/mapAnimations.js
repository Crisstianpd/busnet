export function animateLineReveal(
    map,
    layerId,
    duration = 680
) {
    let frameId = null;

    map.setPaintProperty(
        layerId,
        "line-opacity-transition",
        { duration }
    );
    map.setPaintProperty(
        layerId,
        "line-width-transition",
        { duration: Math.round(duration * 0.72) }
    );
    map.setPaintProperty(layerId, "line-opacity", 0);
    map.setPaintProperty(layerId, "line-width", 1);

    frameId = requestAnimationFrame(() => {
        if (!map.getLayer(layerId)) return;

        map.setPaintProperty(
            layerId,
            "line-opacity",
            ["get", "renderOpacity"]
        );
        map.setPaintProperty(
            layerId,
            "line-width",
            ["get", "renderWidth"]
        );
    });

    return () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
    };
}

export function boundsFromFeatureCollection(featureCollection) {
    const bounds = [];

    const visitCoordinates = coordinates => {
        if (
            Array.isArray(coordinates) &&
            Number.isFinite(coordinates[0]) &&
            Number.isFinite(coordinates[1])
        ) {
            const [longitude, latitude] = coordinates;

            if (
                longitude >= -180 &&
                longitude <= 180 &&
                latitude >= -90 &&
                latitude <= 90
            ) {
                bounds.push([longitude, latitude]);
            }
            return;
        }

        for (const child of Array.isArray(coordinates) ? coordinates : []) {
            visitCoordinates(child);
        }
    };

    const visitGeometry = geometry => {
        if (!geometry) return;

        if (geometry.type === "GeometryCollection") {
            for (const child of geometry.geometries ?? []) {
                visitGeometry(child);
            }
            return;
        }

        visitCoordinates(geometry.coordinates);
    };

    const visitGeojson = geojson => {
        if (!geojson) return;

        if (geojson.type === "FeatureCollection") {
            for (const feature of geojson.features ?? []) {
                visitGeojson(feature);
            }
            return;
        }

        if (geojson.type === "Feature") {
            visitGeometry(geojson.geometry);
            return;
        }

        visitGeometry(geojson);
    };

    visitGeojson(featureCollection);

    return bounds;
}
