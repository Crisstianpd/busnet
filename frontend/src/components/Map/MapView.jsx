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

export default function MapView({
    geojson,
    plannedGeojsons = [],
    location,
    destination,
    plan,
    onDestinationSelect
}) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const originMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);
    const planMarkersRef = useRef([]);
    const renderedLayersRef = useRef([]);

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

        if (!map || !onDestinationSelect) return undefined;

        const handleClick = event => {
            onDestinationSelect({
                latitude: event.lngLat.lat,
                longitude: event.lngLat.lng
            });
        };

        map.on("click", handleClick);

        return () => map.off("click", handleClick);
    }, [onDestinationSelect]);

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

        for (const marker of planMarkersRef.current) marker.remove();
        planMarkersRef.current = [];

        if (!map || !plan?.bestOption) return;

        const points = [
            {
                location: plan.bestOption.boardingPoint,
                color: "#16A34A",
                label: "Punto de abordaje aproximado"
            },
            {
                location: plan.bestOption.dropoffPoint,
                color: "#EA580C",
                label: "Punto de descenso aproximado"
            }
        ];

        if (plan.bestOption.transferFromPoint) {
            points.push({
                location: plan.bestOption.transferFromPoint,
                color: "#7C3AED",
                label: "Punto de transbordo aproximado"
            });
        }

        for (const item of points) {
            const marker = new maplibregl.Marker({
                color: item.color,
                scale: 0.8
            })
                .setLngLat(toLngLat(item.location))
                .setPopup(new maplibregl.Popup().setText(item.label))
                .addTo(map);

            planMarkersRef.current.push(marker);
        }
    }, [plan]);

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
