import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { lightenColor } from "../../utils/colors.js";

function toLngLat(location) {
    return [location.longitude, location.latitude];
}

function getRouteColor(geojson) {
    return (
        geojson?.properties?.color ||
        geojson?.features?.[0]?.properties?.color ||
        "#2563EB"
    );
}

const communitySeverityColors = {
    low: "#22C55E",
    medium: "#FACC15",
    high: "#EF4444"
};

const communityTypeLabels = {
    traffic: "Tráfico",
    accident: "Accidente",
    road_closed: "Calle cerrada",
    flood: "Inundación",
    bus_issue: "Bus detenido",
    police_control: "Control policial",
    other: "Otro incidente"
};

function remainingTime(expiresAt) {
    const minutes = Math.max(
        0,
        Math.ceil((Date.parse(expiresAt) - Date.now()) / 60000)
    );

    return minutes < 60
        ? `${minutes} minutos`
        : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function createCommunityPopup(report) {
    const container = document.createElement("div");
    const title = document.createElement("strong");
    const details = document.createElement("div");
    const description = document.createElement("div");
    const disclaimer = document.createElement("small");

    title.textContent =
        communityTypeLabels[report.type] ?? "Incidente";
    details.textContent =
        `Severidad: ${report.severity} · Tiempo restante: ${
            remainingTime(report.expiresAt)
        }`;
    description.textContent = report.description;
    disclaimer.textContent =
        "Tráfico reportado por la comunidad. Información aproximada y no oficial.";

    details.style.marginTop = "4px";
    details.style.color = "#475569";
    description.style.marginTop = "7px";
    disclaimer.style.display = "block";
    disclaimer.style.marginTop = "8px";
    disclaimer.style.color = "#64748B";

    container.append(title, details, description, disclaimer);

    return container;
}

export default function MapView({
    geojson,
    plannedGeojsons = [],
    location,
    destination,
    planOption,
    onDestinationSelect,
    communityReports = [],
    onTrafficLocationSelect
}) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const planMarkersRef = useRef([]);
    const renderedLayersRef = useRef([]);
    const communityMarkersRef = useRef([]);
    const communityLayerRef = useRef(null);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: [-89.2182, 13.6929],
            zoom: 12
        });

        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

        mapRef.current = map;

        return () => map.remove();
    }, []);

    useEffect(() => {
        const map = mapRef.current;

        if (
            !map ||
            (!onDestinationSelect && !onTrafficLocationSelect)
        ) return undefined;

        const handleClick = event => {
            const coordinates = {
                latitude: event.lngLat.lat,
                longitude: event.lngLat.lng
            };

            if (onTrafficLocationSelect) {
                onTrafficLocationSelect(coordinates);
                return;
            }

            onDestinationSelect?.(coordinates);
        };

        map.on("click", handleClick);

        return () => map.off("click", handleClick);
    }, [onDestinationSelect, onTrafficLocationSelect]);

    useEffect(() => {
        const map = mapRef.current;

        if (!location || !map) return;

        if (!originMarkerRef.current) {
            originMarkerRef.current = new maplibregl.Marker({
                color: "#2563EB"
            })
                .setLngLat(toLngLat(location))
                .setPopup(new maplibregl.Popup().setText("Tu ubicación"))
                .addTo(map);
        }
        else {
            originMarkerRef.current.setLngLat(toLngLat(location));
        }
    }, [location]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        if (!destination) {
            if (destinationMarkerRef.current) {
                destinationMarkerRef.current.remove();
                destinationMarkerRef.current = null;
            }

            return;
        }

        if (!destinationMarkerRef.current) {
            destinationMarkerRef.current = new maplibregl.Marker({
                color: "#DC2626"
            })
                .setLngLat(toLngLat(destination))
                .setPopup(new maplibregl.Popup().setText("Destino"))
                .addTo(map);
        }
        else {
            destinationMarkerRef.current.setLngLat(toLngLat(destination));
        }

        if (location) {
            const bounds = new maplibregl.LngLatBounds();

            bounds.extend(toLngLat(location));
            bounds.extend(toLngLat(destination));
            map.fitBounds(bounds, {
                padding: 90,
                maxZoom: 15
            });
        }
        else {
            map.flyTo({
                center: toLngLat(destination),
                zoom: 16
            });
        }
    }, [destination, location]);

    useEffect(() => {
        const map = mapRef.current;
        const displayedRoutes = plannedGeojsons.length > 0
            ? plannedGeojsons
            : geojson
                ? [geojson]
                : [];

        if (!map) return undefined;

        const drawRoutes = () => {
            for (const { sourceId, layerId } of renderedLayersRef.current) {
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(sourceId)) map.removeSource(sourceId);
            }

            renderedLayersRef.current = [];

            displayedRoutes.forEach((routeGeojson, index) => {
                const sourceId = `route-source-${index}`;
                const layerId = `route-layer-${index}`;
                const baseColor = getRouteColor(routeGeojson);
                const returnColor = lightenColor(baseColor, 45);

                map.addSource(sourceId, {
                    type: "geojson",
                    data: routeGeojson
                });
                map.addLayer({
                    id: layerId,
                    type: "line",
                    source: sourceId,
                    paint: {
                        "line-width": plannedGeojsons.length > 0 ? 6 : 5,
                        "line-opacity": 0.9,
                        "line-color": [
                            "case",
                            ["==", ["get", "direction"], "regreso"],
                            returnColor,
                            baseColor
                        ]
                    }
                });
                renderedLayersRef.current.push({ sourceId, layerId });
            });
        };

        if (map.isStyleLoaded()) {
            drawRoutes();
        }
        else {
            map.once("load", drawRoutes);
        }

        return () => map.off("load", drawRoutes);
    }, [geojson, plannedGeojsons]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return undefined;

        const clearCommunityReports = () => {
            for (const marker of communityMarkersRef.current) {
                marker.remove();
            }
            communityMarkersRef.current = [];

            const current = communityLayerRef.current;

            if (current?.layerId && map.getLayer(current.layerId)) {
                map.removeLayer(current.layerId);
            }
            if (current?.sourceId && map.getSource(current.sourceId)) {
                map.removeSource(current.sourceId);
            }

            communityLayerRef.current = null;
        };
        const drawCommunityReports = () => {
            clearCommunityReports();

            if (communityReports.length === 0) return;

            const sourceId = "community-traffic-source";
            const layerId = "community-traffic-zones";
            const data = {
                type: "FeatureCollection",
                features: communityReports.map(report => ({
                    type: "Feature",
                    properties: {
                        id: report.id,
                        severity: report.severity,
                        radiusMeters: report.radiusMeters,
                        color:
                            communitySeverityColors[report.severity] ??
                            "#94A3B8"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [
                            report.longitude,
                            report.latitude
                        ]
                    }
                }))
            };

            map.addSource(sourceId, {
                type: "geojson",
                data
            });
            map.addLayer({
                id: layerId,
                type: "circle",
                source: sourceId,
                paint: {
                    "circle-color": ["get", "color"],
                    "circle-opacity": 0.18,
                    "circle-stroke-color": ["get", "color"],
                    "circle-stroke-opacity": 0.82,
                    "circle-stroke-width": 2,
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        [
                            "max",
                            3,
                            ["/", ["get", "radiusMeters"], 70]
                        ],
                        14,
                        [
                            "max",
                            8,
                            ["/", ["get", "radiusMeters"], 10]
                        ],
                        18,
                        [
                            "max",
                            16,
                            ["/", ["get", "radiusMeters"], 1.3]
                        ]
                    ]
                }
            });
            communityLayerRef.current = { sourceId, layerId };

            for (const report of communityReports) {
                const element = document.createElement("button");

                element.type = "button";
                element.title = "Ver reporte comunitario";
                element.style.width = "18px";
                element.style.height = "18px";
                element.style.borderRadius = "50%";
                element.style.border = "3px solid #FFFFFF";
                element.style.background =
                    communitySeverityColors[report.severity] ??
                    "#94A3B8";
                element.style.boxShadow =
                    "0 3px 12px rgba(15, 23, 42, 0.4)";
                element.style.cursor = "pointer";
                element.addEventListener(
                    "click",
                    event => event.stopPropagation()
                );

                const marker = new maplibregl.Marker({ element })
                    .setLngLat([
                        report.longitude,
                        report.latitude
                    ])
                    .setPopup(
                        new maplibregl.Popup({
                            offset: 14,
                            maxWidth: "300px"
                        }).setDOMContent(createCommunityPopup(report))
                    )
                    .addTo(map);

                communityMarkersRef.current.push(marker);
            }
        };

        if (map.isStyleLoaded()) {
            drawCommunityReports();
        }
        else {
            map.once("load", drawCommunityReports);
        }

        return () => {
            map.off("load", drawCommunityReports);
            clearCommunityReports();
        };
    }, [communityReports]);

    useEffect(() => {
        const map = mapRef.current;

        for (const marker of planMarkersRef.current) marker.remove();
        planMarkersRef.current = [];

        if (!map || !planOption) return;

        const points = [];

        if (planOption.boardingPoint) {
            points.push({
                location: planOption.boardingPoint,
                color: "#16A34A",
                label: "Punto de abordaje aproximado"
            });
        }

        if (planOption.dropoffPoint) {
            points.push({
                location: planOption.dropoffPoint,
                color: "#EA580C",
                label: "Punto de descenso aproximado"
            });
        }

        const transfers = planOption.transferPoints?.length > 0
            ? planOption.transferPoints
            : planOption.transferFromPoint
                ? [{
                    fromPoint: planOption.transferFromPoint,
                    toPoint: planOption.transferToPoint
                }]
                : [];

        for (const transfer of transfers) {
            if (!transfer.fromPoint) continue;

            points.push({
                location: transfer.fromPoint,
                color: "#7C3AED",
                label: "Punto de transbordo aproximado"
            });

            if (
                transfer.toPoint &&
                (
                    transfer.toPoint.latitude !== transfer.fromPoint.latitude ||
                    transfer.toPoint.longitude !== transfer.fromPoint.longitude
                )
            ) {
                points.push({
                    location: transfer.toPoint,
                    color: "#A855F7",
                    label: "Continuación del transbordo aproximado"
                });
            }
        }

        for (const item of points) {
            if (
                !Number.isFinite(item.location?.latitude) ||
                !Number.isFinite(item.location?.longitude)
            ) continue;

            const marker = new maplibregl.Marker({
                color: item.color,
                scale: 0.8
            })
                .setLngLat(toLngLat(item.location))
                .setPopup(new maplibregl.Popup().setText(item.label))
                .addTo(map);

            planMarkersRef.current.push(marker);
        }
    }, [planOption]);

    return (
        <div
            ref={mapContainer}
            style={{
                width: "100%",
                height: "100%"
            }}
        />
    );
}
