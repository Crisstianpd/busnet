import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    routeEndpoints,
    segmentCalculatedRoute,
    styleManualRoute
} from "../../utils/routeSegmentation.js";
import {
    animateLineReveal,
    boundsFromFeatureCollection
} from "../../utils/mapAnimations.js";
import "./MapView.css";

const EL_SALVADOR_BOUNDS = [
    [-90.2, 13],
    [-87.6, 14.5]
];
const MAP_STYLES = {
    light: "https://tiles.openfreemap.org/styles/liberty",
    dark: "https://tiles.openfreemap.org/styles/dark"
};

function toLngLat(location) {
    return [location.longitude, location.latitude];
}

function tokenValue(name) {
    if (typeof document === "undefined") return `var(${name})`;

    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || `var(${name})`;
}

function getRouteColor(geojson) {
    return (
        geojson?.properties?.color ||
        geojson?.features?.[0]?.properties?.color ||
        tokenValue("--info")
    );
}

function getRouteName(geojson, index) {
    return (
        geojson?.properties?.name ||
        geojson?.features?.[0]?.properties?.name ||
        geojson?.properties?.route ||
        `Ruta ${index + 1}`
    );
}

function animateMarkerIn(marker, enabled) {
    const element = marker.getElement();

    element.classList.add("busnet-map-marker");
    if (!enabled) return;

    element.classList.add("is-entering");
    requestAnimationFrame(() => element.classList.remove("is-entering"));
}

function removeMarker(marker, enabled) {
    if (!marker) return;

    if (!enabled) {
        marker.remove();
        return;
    }

    marker.getElement().classList.add("is-leaving");
    setTimeout(() => marker.remove(), 170);
}

function createTransferStopElement(label) {
    const element = document.createElement("button");

    element.type = "button";
    element.className = "busnet-transfer-stop";
    element.title = label;
    element.setAttribute("aria-label", label);
    element.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="3" width="14" height="15" rx="3"></rect>
            <path d="M8 7h8M8 11h8M8 18v3M16 18v3"></path>
            <circle cx="8.5" cy="15" r="1"></circle>
            <circle cx="15.5" cy="15" r="1"></circle>
        </svg>
    `;

    return element;
}

function createJourneyMarkerElement(type, label) {
    const element = document.createElement("button");
    const isBoarding = type === "boarding";

    element.type = "button";
    element.className = `busnet-journey-marker is-${type}`;
    element.title = label;
    element.setAttribute("aria-label", label);
    element.innerHTML = isBoarding
        ? `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="3" width="14" height="15" rx="3"></rect>
                <path d="M8 7h8M8 11h8M8 18v3M16 18v3"></path>
                <circle cx="8.5" cy="15" r="1"></circle>
                <circle cx="15.5" cy="15" r="1"></circle>
            </svg>
            <span>Inicio</span>
        `
        : `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 21V4"></path>
                <path d="M7 5h10l-2.3 3L17 11H7"></path>
                <path d="m9 17 2 2 4-5"></path>
            </svg>
            <span>Llegada</span>
        `;

    return element;
}

const communitySeverityTokens = {
    low: "--busnet-green",
    medium: "--amber",
    high: "--red"
};

function communitySeverityColor(severity) {
    return tokenValue(
        communitySeverityTokens[severity] ?? "--text-secondary"
    );
}

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
    details.style.color = "var(--text-secondary)";
    description.style.marginTop = "7px";
    disclaimer.style.display = "block";
    disclaimer.style.marginTop = "8px";
    disclaimer.style.color = "var(--text-tertiary)";

    container.append(title, details, description, disclaimer);

    return container;
}

export default function MapView({
    geojson,
    plannedGeojsons = [],
    selectedOrigin,
    selectedDestination,
    selectionMode,
    onMapPointSelected,
    animationsEnabled = true,
    resolvedTheme = "light",
    planOption,
    communityReports = [],
    onTrafficLocationSelect
}) {
    const location = selectedOrigin;
    const destination = selectedDestination;
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const planMarkersRef = useRef([]);
    const renderedLayersRef = useRef([]);
    const communityMarkersRef = useRef([]);
    const communityLayerRef = useRef(null);
    const activeMapThemeRef = useRef(resolvedTheme);

    const clearRouteTemporaryMarkers = useCallback(() => {
        const markers = planMarkersRef.current.splice(0);

        for (const marker of markers) {
            marker.remove();
        }
    }, []);

    const clearRouteTemporaryLayers = useCallback(map => {
        if (!map) {
            renderedLayersRef.current = [];
            return;
        }

        const renderedItems = renderedLayersRef.current.splice(0);

        for (const item of renderedItems) {
            const {
                sourceId,
                layerId,
                arrowLayerId,
                handlers,
                popup,
                cancelAnimation
            } = item;

            cancelAnimation?.();
            if (handlers) {
                map.off("mouseenter", layerId, handlers.enter);
                map.off("mousemove", layerId, handlers.move);
                map.off("mouseleave", layerId, handlers.leave);
            }

            popup?.remove();
            if (arrowLayerId && map.getLayer(arrowLayerId)) {
                map.removeLayer(arrowLayerId);
            }
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getSource(sourceId)) map.removeSource(sourceId);
        }

        map.getCanvas().style.cursor = "";
    }, []);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style:
                MAP_STYLES[activeMapThemeRef.current] ??
                MAP_STYLES.light,
            center: [-89.2182, 13.6929],
            zoom: 12,
            minZoom: 8,
            maxBounds: EL_SALVADOR_BOUNDS,
            pitchWithRotate: true
        });

        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

        mapRef.current = map;
        map.once("load", () => setMapLoaded(true));

        return () => {
            clearRouteTemporaryMarkers();
            clearRouteTemporaryLayers(map);
            originMarkerRef.current?.remove();
            destinationMarkerRef.current?.remove();
            for (const marker of communityMarkersRef.current.splice(0)) {
                marker.remove();
            }

            originMarkerRef.current = null;
            destinationMarkerRef.current = null;
            mapRef.current = null;
            map.remove();
        };
    }, [clearRouteTemporaryLayers, clearRouteTemporaryMarkers]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || activeMapThemeRef.current === resolvedTheme) return;

        const camera = {
            center: map.getCenter(),
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing()
        };

        activeMapThemeRef.current = resolvedTheme;
        setMapLoaded(false);

        map.once("style.load", () => {
            map.jumpTo(camera);
            setMapLoaded(true);
        });
        map.setStyle(
            MAP_STYLES[resolvedTheme] ?? MAP_STYLES.light
        );
    }, [resolvedTheme]);

    useEffect(() => {
        const map = mapRef.current;

        if (
            !map ||
            (!selectionMode && !onTrafficLocationSelect)
        ) return undefined;

        map.getCanvas().style.cursor = "crosshair";

        const handleClick = event => {
            const coordinates = {
                latitude: event.lngLat.lat,
                longitude: event.lngLat.lng
            };

            if (onTrafficLocationSelect) {
                onTrafficLocationSelect(coordinates);
                return;
            }

            if (selectionMode) {
                onMapPointSelected?.(coordinates);
            }
        };

        map.on("click", handleClick);

        return () => {
            map.off("click", handleClick);
            map.getCanvas().style.cursor = "";
        };
    }, [
        onMapPointSelected,
        onTrafficLocationSelect,
        selectionMode
    ]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        if (!location) {
            removeMarker(originMarkerRef.current, animationsEnabled);
            originMarkerRef.current = null;
            return;
        }

        if (!originMarkerRef.current) {
            originMarkerRef.current = new maplibregl.Marker({
                color: tokenValue("--info")
            })
                .setLngLat(toLngLat(location))
                .setPopup(new maplibregl.Popup().setText("Tu ubicación"))
                .addTo(map);
        }
        else {
            originMarkerRef.current.setLngLat(toLngLat(location));
        }

        animateMarkerIn(originMarkerRef.current, animationsEnabled);

        if (animationsEnabled) {
            map.flyTo({
                center: toLngLat(location),
                zoom: Math.max(map.getZoom(), 14),
                duration: 900,
                essential: true
            });
        }
    }, [animationsEnabled, location]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        if (!destination) {
            if (destinationMarkerRef.current) {
                removeMarker(
                    destinationMarkerRef.current,
                    animationsEnabled
                );
                destinationMarkerRef.current = null;
            }

            return;
        }

        if (!destinationMarkerRef.current) {
            destinationMarkerRef.current = new maplibregl.Marker({
                color: tokenValue("--amber")
            })
                .setLngLat(toLngLat(destination))
                .setPopup(new maplibregl.Popup().setText("Destino"))
                .addTo(map);
        }
        else {
            destinationMarkerRef.current.setLngLat(toLngLat(destination));
        }

        animateMarkerIn(destinationMarkerRef.current, animationsEnabled);

        if (location) {
            const bounds = new maplibregl.LngLatBounds();

            bounds.extend(toLngLat(location));
            bounds.extend(toLngLat(destination));
            map.fitBounds(bounds, {
                padding: 90,
                maxZoom: 15,
                duration: animationsEnabled ? 800 : 0
            });
        }
        else {
            map.flyTo({
                center: toLngLat(destination),
                zoom: 16
            });
        }
    }, [animationsEnabled, destination, location]);

    useEffect(() => {
        const map = mapRef.current;
        const walkingGeojson =
            planOption?.type === "walk" && location && destination
                ? {
                    type: "FeatureCollection",
                    properties: {
                        name: "Recorrido caminando",
                        color: tokenValue("--info"),
                        walking: true
                    },
                    features: [{
                        type: "Feature",
                        properties: { walking: true },
                        geometry: {
                            type: "LineString",
                            coordinates: [
                                toLngLat(location),
                                toLngLat(destination)
                            ]
                        }
                    }]
                }
                : null;
        const displayedRoutes = walkingGeojson
            ? [walkingGeojson]
            : plannedGeojsons.length > 0
                ? plannedGeojsons
                : geojson
                    ? [geojson]
                    : [];

        if (!map) return undefined;

        const drawRoutes = () => {
            clearRouteTemporaryLayers(map);

            displayedRoutes.forEach((routeGeojson, index) => {
                const sourceId = `route-source-${index}`;
                const layerId = `route-layer-${index}`;
                const arrowLayerId = `route-arrow-layer-${index}`;
                const baseColor = getRouteColor(routeGeojson);
                const routeName = getRouteName(routeGeojson, index);
                const isWalking = Boolean(
                    routeGeojson?.properties?.walking
                );
                const endpoints = routeEndpoints(planOption, index);
                const visualization = plannedGeojsons.length > 0
                    ? segmentCalculatedRoute(
                        routeGeojson,
                        endpoints.start,
                        endpoints.end
                    )
                    : styleManualRoute(routeGeojson);
                const baseWidth = isWalking
                    ? 5
                    : plannedGeojsons.length > 0
                        ? 6
                        : 5;

                map.addSource(sourceId, {
                    type: "geojson",
                    data: visualization
                });
                map.addLayer({
                    id: layerId,
                    type: "line",
                    source: sourceId,
                    paint: {
                        "line-width": ["get", "renderWidth"],
                        "line-opacity": ["get", "renderOpacity"],
                        "line-color": ["get", "renderColor"],
                        ...(isWalking
                            ? { "line-dasharray": [1.2, 1.8] }
                            : {})
                    }
                });
                map.addLayer({
                    id: arrowLayerId,
                    type: "symbol",
                    source: sourceId,
                    layout: {
                        "symbol-placement": "line",
                        "symbol-spacing": 115,
                        "text-field": "➤",
                        "text-size": 13,
                        "text-rotation-alignment": "map",
                        "text-pitch-alignment": "map",
                        "text-keep-upright": false,
                        "text-allow-overlap": false
                    },
                    paint: {
                        "text-color": ["get", "renderColor"],
                        "text-opacity": ["get", "renderOpacity"],
                        "text-halo-color":
                            resolvedTheme === "dark"
                                ? tokenValue("--night")
                                : tokenValue("--text-primary"),
                        "text-halo-width": 1.25
                    }
                });

                const popup = new maplibregl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    className: "busnet-route-label",
                    offset: 10
                }).setText(routeName);
                const handlers = {
                    enter: event => {
                        map.getCanvas().style.cursor = "pointer";
                        map.setPaintProperty(
                            layerId,
                            "line-width",
                            baseWidth + 2
                        );
                        popup.setLngLat(event.lngLat).addTo(map);
                        popup.getElement()?.style.setProperty(
                            "--route-color",
                            baseColor
                        );
                    },
                    move: event => popup.setLngLat(event.lngLat),
                    leave: () => {
                        map.getCanvas().style.cursor = "";
                        map.setPaintProperty(
                            layerId,
                            "line-width",
                            ["get", "renderWidth"]
                        );
                        popup.remove();
                    }
                };

                map.on("mouseenter", layerId, handlers.enter);
                map.on("mousemove", layerId, handlers.move);
                map.on("mouseleave", layerId, handlers.leave);

                const cancelAnimation = animationsEnabled
                    ? animateLineReveal(map, layerId)
                    : null;

                renderedLayersRef.current.push({
                    sourceId,
                    layerId,
                    arrowLayerId,
                    handlers,
                    popup,
                    cancelAnimation
                });
            });
        };

        map.on("style.load", drawRoutes);
        if (map.isStyleLoaded()) drawRoutes();

        return () => {
            map.off("style.load", drawRoutes);
            clearRouteTemporaryLayers(map);
        };
    }, [
        animationsEnabled,
        clearRouteTemporaryLayers,
        destination,
        geojson,
        location,
        planOption,
        plannedGeojsons,
        resolvedTheme
    ]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !geojson || plannedGeojsons.length > 0) return;

        const coordinates = boundsFromFeatureCollection(
            styleManualRoute(geojson)
        );
        if (coordinates.length === 0) return;

        const bounds = coordinates.reduce(
            (current, coordinate) => current.extend(coordinate),
            new maplibregl.LngLatBounds(
                coordinates[0],
                coordinates[0]
            )
        );

        map.fitBounds(bounds, {
            padding: {
                top: 96,
                right: window.innerWidth > 720 ? 88 : 42,
                bottom: 96,
                left: window.innerWidth > 720 ? 500 : 42
            },
            maxZoom: 13.5,
            duration: animationsEnabled ? 900 : 0,
            essential: true
        });
    }, [animationsEnabled, geojson, plannedGeojsons]);

    useEffect(() => {
        const map = mapRef.current;

        if (
            !map ||
            !animationsEnabled ||
            plannedGeojsons.length === 0 ||
            planOption?.type === "walk"
        ) return;

        map.easeTo({
            pitch: 46,
            bearing: -7,
            duration: 700,
            essential: true
        });
    }, [animationsEnabled, planOption, plannedGeojsons]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return undefined;

        const resetPerspective = () => {
            if (map.getPitch() === 0 && map.getBearing() === 0) return;

            map.easeTo({
                pitch: 0,
                bearing: 0,
                duration: animationsEnabled ? 420 : 0
            });
        };

        map.on("dragstart", resetPerspective);
        map.on("mousedown", resetPerspective);
        map.on("touchstart", resetPerspective);

        return () => {
            map.off("dragstart", resetPerspective);
            map.off("mousedown", resetPerspective);
            map.off("touchstart", resetPerspective);
        };
    }, [animationsEnabled]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return undefined;

        const clearCommunityReports = () => {
            for (const marker of communityMarkersRef.current) {
                marker.remove();
            }
            communityMarkersRef.current = [];

            const current = communityLayerRef.current;

            try {
                if (current?.layerId && map.getLayer(current.layerId)) {
                    map.removeLayer(current.layerId);
                }
                if (current?.sourceId && map.getSource(current.sourceId)) {
                    map.removeSource(current.sourceId);
                }
            }
            catch {
                // El estilo puede estar destruido durante una recarga HMR.
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
                        color: communitySeverityColor(report.severity)
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
                element.style.border = "3px solid var(--text-primary)";
                element.style.background = communitySeverityColor(
                    report.severity
                );
                element.style.boxShadow = "var(--shadow-marker)";
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

                animateMarkerIn(marker, animationsEnabled);
                communityMarkersRef.current.push(marker);
            }
        };

        map.on("style.load", drawCommunityReports);
        if (map.isStyleLoaded()) drawCommunityReports();

        return () => {
            map.off("style.load", drawCommunityReports);
            clearCommunityReports();
        };
    }, [animationsEnabled, communityReports]);

    useEffect(() => {
        const map = mapRef.current;

        clearRouteTemporaryMarkers();

        if (!map || !planOption) return undefined;

        const points = [];

        if (planOption.boardingPoint) {
            points.push({
                location: planOption.boardingPoint,
                type: "boarding",
                label: "Punto de abordaje aproximado"
            });
        }

        if (planOption.dropoffPoint) {
            points.push({
                location: planOption.dropoffPoint,
                type: "arrival",
                label: "Punto de llegada aproximado"
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
                color: tokenValue("--route-3"),
                type: "transfer",
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
                    color: tokenValue("--route-3-return"),
                    type: "transfer",
                    label: "Continuación del transbordo aproximado"
                });
            }
        }

        for (const item of points) {
            if (
                !Number.isFinite(item.location?.latitude) ||
                !Number.isFinite(item.location?.longitude)
            ) continue;

            const marker = new maplibregl.Marker(
                item.type === "transfer"
                    ? {
                        element: createTransferStopElement(item.label),
                        anchor: "center"
                    }
                    : item.type === "boarding" || item.type === "arrival"
                        ? {
                            element: createJourneyMarkerElement(
                                item.type,
                                item.label
                            ),
                            anchor: "bottom"
                        }
                        : {
                            color: item.color,
                            scale: 0.8
                        }
            )
                .setLngLat(toLngLat(item.location))
                .setPopup(new maplibregl.Popup().setText(item.label))
                .addTo(map);

            animateMarkerIn(marker, animationsEnabled);
            planMarkersRef.current.push(marker);
        }

        return clearRouteTemporaryMarkers;
    }, [
        animationsEnabled,
        clearRouteTemporaryMarkers,
        planOption
    ]);

    return (
        <div className="busnet-map-shell">
            <div
                ref={mapContainer}
                className="busnet-map-canvas"
            />
            <div
                className={`busnet-map-loading ${
                    mapLoaded ? "is-ready" : ""
                }`}
                aria-hidden={mapLoaded}
            >
                <div className="busnet-map-loader">
                    Preparando el mapa
                </div>
            </div>
        </div>
    );
}
