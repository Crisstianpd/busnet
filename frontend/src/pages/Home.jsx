import { useCallback, useEffect, useState } from "react";
import MapView from "../components/Map/MapView";
import TripOptions from "../components/Trip/TripOptions";
import useLocation from "../hooks/useLocation";
import {
    getRoute,
    getRoutes,
    planTrip,
    startTrip,
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
    const [destinationLabel, setDestinationLabel] = useState("");
    const [allowMapDestinationSelection, setAllowMapDestinationSelection] = useState(false);
    const [routeCalculated, setRouteCalculated] = useState(false);
    const [plan, setPlan] = useState(null);
    const [selectedPlanOption, setSelectedPlanOption] = useState(null);
    const [plannedGeojsons, setPlannedGeojsons] = useState([]);
    const [planning, setPlanning] = useState(false);
    const [planningError, setPlanningError] = useState("");
    const [startingTrip, setStartingTrip] = useState(false);
    const [tripMessage, setTripMessage] = useState("");

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

    const handleDestinationSelect = useCallback(coordinates => {
        setDestination(coordinates);
        setDestinationLabel("Punto seleccionado en el mapa");
        setSelectedPlace(null);
        setSearchResults([]);
        setPlanningError("");
        setTripMessage("");
        setPlan(null);
        setSelectedPlanOption(null);
        setPlannedGeojsons([]);
        setRouteCalculated(false);
    }, []);

    const handleCalculateRoute = useCallback(async () => {
        if (!destination) {
            return;
        }

        if (!location) {
            setPlanningError(
                locationLoading
                    ? "Esperando tu ubicación actual…"
                    : locationError || "No se pudo obtener tu ubicación."
            );
            return;
        }

        setPlanningError("");
        setTripMessage("");
        setPlanning(true);

        try {
            const result = await planTrip(location, destination);
            const routeGeojsons = await Promise.all(
                (result.bestOption.routes ?? []).map(getRoute)
            );

            setSelectedRoute("");
            setGeojson(null);
            setPlan(result);
            setSelectedPlanOption(result.bestOption);
            setPlannedGeojsons(routeGeojsons);
            setRouteCalculated(true);
        }
        catch (error) {
            setPlanningError(error.message);
            setRouteCalculated(false);
        }
        finally {
            setPlanning(false);
        }
    }, [destination, location, locationError, locationLoading]);

    async function handlePlanOptionSelect(option) {
        try {
            setPlanningError("");
            setSelectedPlanOption(option);
            setSelectedRoute("");
            setGeojson(null);
            setPlannedGeojsons(
                await Promise.all((option.routes ?? []).map(getRoute))
            );
        }
        catch (error) {
            setPlanningError(error.message);
        }
    }

    async function handleRouteChange(event) {
        const route = event.target.value;

        setSelectedRoute(route);
        setPlan(null);
        setSelectedPlanOption(null);
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
        setDestination(null);
        setDestinationLabel("");
        setPlan(null);
        setPlannedGeojsons([]);
        setPlanningError("");
        setTripMessage("");
        setRouteCalculated(false);

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
        setDestination({ latitude, longitude });
        setDestinationLabel(place.title);
        setPlan(null);
        setPlannedGeojsons([]);
        setPlanningError("");
        setTripMessage("");
        setRouteCalculated(false);
    }

    async function handleStartTrip() {
        if (!destination || !routeCalculated) {
            return;
        }

        if (!location) {
            setTripMessage(
                locationLoading
                    ? "Esperando tu ubicación para iniciar el viaje…"
                    : locationError || "No se pudo obtener tu ubicación."
            );
            return;
        }

        setStartingTrip(true);
        setTripMessage("");

        try {
            const response = await startTrip(location, {
                ...destination,
                name: destinationLabel || selectedPlace?.title || "Destino seleccionado"
            });

            setTripMessage(response.message || "Viaje iniciado.");
        }
        catch (error) {
            setTripMessage(error.message);
        }
        finally {
            setStartingTrip(false);
        }
    }

    function handleCancelTrip() {
        setSelectedPlace(null);
        setDestination(null);
        setDestinationLabel("");
        setSearchQuery("");
        setSearchResults([]);
        setPlan(null);
        setPlannedGeojsons([]);
        setPlanningError("");
        setTripMessage("");
        setRouteCalculated(false);
        setStartingTrip(false);
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
                <div className="search-header">
                    <div className="search-input-group">
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
                    </div>

                    <button
                        type="button"
                        className={`map-toggle-button ${allowMapDestinationSelection ? "is-active" : ""}`}
                        onClick={() => setAllowMapDestinationSelection(value => !value)}
                        aria-pressed={allowMapDestinationSelection}
                        aria-label="Activar o desactivar selección de punto en el mapa"
                    >
                        <span className="map-toggle-button-dot" aria-hidden="true" />
                        <span className="map-toggle-button-text">
                            {allowMapDestinationSelection ? "Mapa activo" : "Mapa apagado"}
                        </span>
                    </button>
                </div>

                <div className="search-note">
                    Activa el toggle para colocar un punto en el mapa. Primero calcula la ruta y luego realiza el viaje.
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

                {destination && (
                    <div className="trip-actions">
                        <div className="trip-destination">
                            Destino seleccionado: <b>{destinationLabel || selectedPlace?.title || "Punto en el mapa"}</b>
                        </div>

                        <button
                            type="button"
                            className="trip-start-button"
                            onClick={routeCalculated ? handleStartTrip : handleCalculateRoute}
                            disabled={startingTrip || planning}
                        >
                            {startingTrip
                                ? "Iniciando viaje..."
                                : planning
                                    ? "Calculando ruta..."
                                    : routeCalculated
                                        ? "Realizar viaje"
                                        : "Calcular ruta"}
                        </button>

                        <button
                            type="button"
                            className="trip-cancel-button"
                            onClick={handleCancelTrip}
                        >
                            Cancelar viaje
                        </button>

                        {tripMessage && (
                            <div className="trip-message">
                                {tripMessage}
                            </div>
                        )}
                    </div>
                )}

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
                    selectedOption={selectedPlanOption}
                    onSelectOption={handlePlanOptionSelect}
                />
            </div>

            <MapView
                geojson={geojson}
                plannedGeojsons={plannedGeojsons}
                location={location}
                destination={destination}
                planOption={selectedPlanOption}
                onDestinationSelect={allowMapDestinationSelection ? handleDestinationSelect : null}
            />
        </div>
    );
}
