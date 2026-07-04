import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import useLocation from "../../hooks/useLocation";
import { lightenColor } from "../../utils/colors.js";

export default function MapView({ geojson, focusLocation }) {

    const { location } = useLocation();

    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const searchMarkerRef = useRef(null);
    const searchMarkerTimeoutRef = useRef(null);

    const ROUTE_SOURCE = "route-source";
    const ROUTE_LAYER = "route-layer";

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

        if (!location || !mapRef.current) return;

        const { latitude, longitude } = location;

        mapRef.current.flyTo({

            center: [longitude, latitude],

            zoom: 16

        });

        if (!markerRef.current) {

            markerRef.current = new maplibregl.Marker({

                color: "#2563EB"

            })

                .setLngLat([longitude, latitude])

                .addTo(mapRef.current);

        }

        else {

            markerRef.current.setLngLat([longitude, latitude]);

        }

    }, [location]);

    useEffect(() => {

        return () => {

            if (searchMarkerTimeoutRef.current) {
                clearTimeout(searchMarkerTimeoutRef.current);
            }

            if (searchMarkerRef.current) {
                searchMarkerRef.current.remove();
            }

        };

    }, []);

    useEffect(() => {

        if (!focusLocation?.coordinates || !mapRef.current) return;

        const [longitude, latitude] = focusLocation.coordinates;

        mapRef.current.flyTo({

            center: [longitude, latitude],

            zoom: 16

        });

        if (searchMarkerRef.current) {

            searchMarkerRef.current.remove();
        }

        if (searchMarkerTimeoutRef.current) {

            clearTimeout(searchMarkerTimeoutRef.current);
        }

        searchMarkerRef.current = new maplibregl.Marker({

            color: "#f97316"

        })

            .setLngLat([longitude, latitude])

            .addTo(mapRef.current);

        searchMarkerTimeoutRef.current = setTimeout(() => {

            if (searchMarkerRef.current) {

                searchMarkerRef.current.remove();
                searchMarkerRef.current = null;
            }

        }, 4500);

    }, [focusLocation]);

    useEffect(() => {

        if (!mapRef.current) return;

        const map = mapRef.current;

        if (map.getLayer(ROUTE_LAYER))
            map.removeLayer(ROUTE_LAYER);

        if (map.getSource(ROUTE_SOURCE))
            map.removeSource(ROUTE_SOURCE);

        if (!geojson) return;

        const baseColor = geojson.properties.color;

        const returnColor = lightenColor(baseColor, 45);

        const draw = () => {

            map.addSource(ROUTE_SOURCE, {

                type: "geojson",

                data: geojson

            });

            map.addLayer({

                id: ROUTE_LAYER,

                type: "line",

                source: ROUTE_SOURCE,

                paint: {

                    "line-width": 5,

                    "line-opacity": 0.9,

                    "line-color": [

                        "case",

                        ["==", ["get", "direction"], "ida"],

                        baseColor,

                        returnColor

                    ]

                }

            });

        };

        if (map.isStyleLoaded())

            draw();

        else

            map.once("load", draw);

    }, [geojson]);

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