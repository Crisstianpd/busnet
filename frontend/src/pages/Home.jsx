import { useCallback, useEffect, useState } from "react";
import MapView from "../components/Map/MapView";
import TripOptions from "../components/Trip/TripOptions";
import useLocation from "../hooks/useLocation";
import {
    getRoute,
    getRoutes,
    planTrip,
    searchPlaces
} from "../services/api";

export default function Home() {
    const {
        location,
        loading: locationLoading,
        error: locationError
    } = useLocation();
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState("");
    const [geojson, setGeojson] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [destination, setDestination] = useState(null);
    const [plan, setPlan] = useState(null);
    const [plannedGeojsons, setPlannedGeojsons] = useState([]);
    const [planning, setPlanning] = useState(false);
    const [planningError, setPlanningError] = useState("");

    useEffect(() => {
        getRoutes()
            .then(setRoutes)
            .catch(error => setPlanningError(error.message));
    }, []);

    useEffect(() => {
        const query = searchQuery.trim();

        if (!query) return undefined;

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            setSearchLoading(true);

            try {
                setSearchResults(
                    await searchPlaces(query, controller.signal)
                );
            }
            catch (error) {
                if (error.name !== "AbortError") {
                    setSearchResults([]);
                }
            }
            finally {
                setSearchLoading(false);
            }
        }, 250);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [searchQuery]);

    const handleDestinationSelect = useCallback(async coordinates => {
        setDestination(coordinates);
        setPlanningError("");
        setPlan(null);
        setPlannedGeojsons([]);

        if (!location) {
            setPlanningError(
                locationLoading
                    ? "Esperando tu ubicación actual…"
                    : locationError || "No se pudo obtener tu ubicación."
            );
            return;
        }

        setPlanning(true);

        try {
            const result = await planTrip(location, coordinates);
            const routeGeojsons = await Promise.all(
                result.bestOption.routes.map(getRoute)
            );

            setSelectedRoute("");
            setGeojson(null);
            setPlan(result);
            setPlannedGeojsons(routeGeojsons);
        }
        catch (error) {
            setPlanningError(error.message);
        }
        finally {
            setPlanning(false);
        }
    }, [location, locationError, locationLoading]);

    async function handleRouteChange(event) {
        const route = event.target.value;

        setSelectedRoute(route);
        setPlan(null);
        setPlannedGeojsons([]);

        if (!route) {
            setGeojson(null);
            return;
        }

        try {
            setGeojson(await getRoute(route));
        }
        catch (error) {
            setPlanningError(error.message);
        }
    }

    function handleSearchChange(event) {
        const query = event.target.value;

        setSearchQuery(query);
        setSelectedPlace(null);

        if (!query.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
        }
    }

    function handlePlaceSelect(place) {
        const [longitude, latitude] = place.coordinates;

        setSelectedPlace(place);
        setSearchQuery(place.title);
        setSearchResults([]);
        handleDestinationSelect({ latitude, longitude });
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative"
            }}
        >
            <div className="search-panel">
                <label className="search-label" htmlFor="place-search">
                    ¿A dónde vas?
                </label>

                <input
                    id="place-search"
                    className="search-input"
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Busca un destino en El Salvador"
                />

                <div className="search-note">
                    Usa tu ubicación como origen o haz clic en el mapa.
                </div>

                <div className="search-results">
                    {searchLoading && (
                        <div className="search-status">
                            Buscando coincidencias…
                        </div>
                    )}

                    {!searchLoading &&
                        searchQuery.trim() &&
                        !selectedPlace &&
                        searchResults.length === 0 && (
                            <div className="search-status">
                                No se encontraron coincidencias.
                            </div>
                        )}

                    {searchResults.map(place => (
                        <button
                            key={place.id}
                            type="button"
                            className={`search-result ${
                                selectedPlace?.id === place.id
                                    ? "is-selected"
                                    : ""
                            }`}
                            onClick={() => handlePlaceSelect(place)}
                        >
                            <span className="search-result-title">
                                {place.title}
                            </span>
                            <span className="search-result-subtitle">
                                {place.subtitle}
                            </span>
                            <span className="search-result-description">
                                {place.description}
                            </span>
                        </button>
                    ))}
                </div>

                <label className="route-label" htmlFor="route-select">
                    Explorar una ruta manualmente
                </label>

                <select
                    id="route-select"
                    className="route-select"
                    value={selectedRoute}
                    onChange={handleRouteChange}
                >
                    <option value="">Seleccione una ruta</option>

                    {routes.map(route => (
                        <option key={route.route} value={route.route}>
                            {route.name}
                        </option>
                    ))}
                </select>

                <TripOptions
                    plan={plan}
                    loading={planning}
                    error={planningError}
                />
            </div>

            <MapView
                geojson={geojson}
                plannedGeojsons={plannedGeojsons}
                location={location}
                destination={destination}
                plan={plan}
                onDestinationSelect={handleDestinationSelect}
            />
        </div>
    );
}
