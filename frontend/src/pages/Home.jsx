import { useEffect, useState } from "react";
import MapView from "../components/Map/MapView";
import { getRoute, getRoutes, searchPlaces } from "../services/api";

export default function Home() {

    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState("");
    const [geojson, setGeojson] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    useEffect(() => {

        getRoutes().then(setRoutes);

    }, []);

    useEffect(() => {

        const query = searchQuery.trim();

        if (!query) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {

            setSearchLoading(true);

            try {
                const results = await searchPlaces(query, controller.signal);
                setSearchResults(results);
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

    async function handleRouteChange(e) {

        const route = e.target.value;

        setSelectedRoute(route);

        if (!route) {
            setGeojson(null);
            return;
        }

        const data = await getRoute(route);

        setGeojson(data);

    }

    function handleSearchChange(e) {

        setSearchQuery(e.target.value);
        setSelectedPlace(null);

    }

    function handlePlaceSelect(place) {

        setSelectedPlace(place);
        setSearchQuery(place.title);

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
                    Buscar lugares en El Salvador
                </label>

                <input
                    id="place-search"
                    className="search-input"
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Busca un lugar, colonia, municipio o punto de interés"
                />

                <div className="search-note">
                    Se buscan lugares del mapa dentro de El Salvador y se muestran abajo.
                </div>

                <div className="search-results">

                    {searchLoading && (
                        <div className="search-status">
                            Buscando coincidencias...
                        </div>
                    )}

                    {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                        <div className="search-status">
                            No se encontraron coincidencias.
                        </div>
                    )}

                    {searchResults.map(place => (
                        <button
                            key={place.id}
                            type="button"
                            className={`search-result ${selectedPlace?.id === place.id ? "is-selected" : ""}`}
                            onClick={() => handlePlaceSelect(place)}
                        >
                            <span className="search-result-title">{place.title}</span>
                            <span className="search-result-subtitle">{place.subtitle}</span>
                            <span className="search-result-description">{place.description}</span>
                        </button>
                    ))}

                </div>

                <label className="route-label" htmlFor="route-select">
                    Ruta
                </label>

                <select
                    id="route-select"
                    className="route-select"
                    value={selectedRoute}
                    onChange={handleRouteChange}
                >

                    <option value="">
                        Seleccione una ruta
                    </option>

                    {routes.map(route => (
                        <option key={route.route} value={route.route}>
                            {route.name}
                        </option>
                    ))}

                </select>

            </div>

            <MapView geojson={geojson} focusLocation={selectedPlace} />

        </div>

    );

}