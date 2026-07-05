import "./RouteControlPanel.css";

function LocationIcon({ type }) {
    return (
        <span
            className={`route-control-marker is-${type}`}
            aria-hidden="true"
        />
    );
}

export default function RouteControlPanel({
    origin,
    originLabel,
    destination,
    destinationLabel,
    activeField,
    selectionMode,
    onOriginFocus,
    onDestinationFocus,
    onUseCurrentLocation,
    onSelectOnMap,
    onCancelMapSelection,
    searchQuery,
    onSearchChange,
    searchResults,
    searchLoading,
    selectedPlace,
    onPlaceSelect,
    planning,
    onCalculateRoute,
    validationMessage,
    routeCalculated,
    startingTrip,
    onStartTrip,
    onCancelTrip,
    tripMessage,
    locationAvailable,
    locationLoading,
    onRequestLocation,
    animationsEnabled,
    onToggleAnimations,
    routes,
    selectedRoute,
    onRouteChange,
    children
}) {
    const canCalculate = Boolean(origin && destination) && !planning;
    const showStartTripAction = false;

    return (
        <section className="route-control-panel" aria-label="Planificador de viaje">
            <header className="route-control-brand">
                <div>
                    <span className="route-control-eyebrow">Movilidad inteligente</span>
                    <h1>BUSNET</h1>
                </div>
                <span className="route-control-badge">El Salvador</span>
            </header>

            <div className="route-control-utilities">
                {!locationAvailable && (
                    <button
                        type="button"
                        className="route-control-utility"
                        onClick={onRequestLocation}
                        disabled={locationLoading}
                    >
                        <span aria-hidden="true">⌖</span>
                        {locationLoading ? "Detectando ubicación…" : "Activar ubicación"}
                    </button>
                )}
                <button
                    type="button"
                    className={`route-control-utility ${
                        animationsEnabled ? "is-active" : ""
                    }`}
                    onClick={onToggleAnimations}
                    aria-pressed={animationsEnabled}
                >
                    <span aria-hidden="true">{animationsEnabled ? "✦" : "—"}</span>
                    {animationsEnabled
                        ? "Desactivar animaciones"
                        : "Activar animaciones"}
                </button>
            </div>

            <div className="route-control-fields">
                <div className="route-control-line" aria-hidden="true" />

                <div className="route-control-field">
                    <LocationIcon type="origin" />
                    <label htmlFor="route-origin">Punto inicial</label>
                    <input
                        id="route-origin"
                        type="text"
                        value={originLabel}
                        placeholder="Selecciona punto inicial"
                        readOnly
                        onFocus={onOriginFocus}
                        onClick={onOriginFocus}
                    />

                    {activeField === "origin" && (
                        <div className="route-control-options">
                            <button type="button" onClick={onUseCurrentLocation}>
                                <span aria-hidden="true">⌖</span>
                                Usar mi ubicación actual
                            </button>
                            <button
                                type="button"
                                onClick={() => onSelectOnMap("origin")}
                            >
                                <span aria-hidden="true">＋</span>
                                Seleccionar en el mapa
                            </button>
                        </div>
                    )}
                </div>

                <div className="route-control-field">
                    <LocationIcon type="destination" />
                    <label htmlFor="route-destination">Punto final</label>
                    <input
                        id="route-destination"
                        type="search"
                        value={searchQuery}
                        placeholder={
                            destinationLabel || "Busca un lugar o selecciónalo en el mapa"
                        }
                        onChange={onSearchChange}
                        onFocus={onDestinationFocus}
                    />

                    {activeField === "destination" && (
                        <div className="route-control-options">
                            <button
                                type="button"
                                onClick={() => onSelectOnMap("destination")}
                            >
                                <span aria-hidden="true">＋</span>
                                Seleccionar en el mapa
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectionMode && (
                <div className="route-control-map-mode" role="status">
                    <span className="route-control-pulse" aria-hidden="true" />
                    <span>
                        Haz clic en el mapa para elegir el{" "}
                        {selectionMode === "origin" ? "punto inicial" : "punto final"}.
                    </span>
                    <button type="button" onClick={onCancelMapSelection}>
                        Cancelar
                    </button>
                </div>
            )}

            <div className="route-control-results">
                {searchLoading && (
                    <div className="route-control-search-status">
                        Buscando lugares…
                    </div>
                )}

                {!searchLoading &&
                    searchQuery.trim() &&
                    !selectedPlace &&
                    searchResults.length === 0 && (
                        <div className="route-control-search-status">
                            No encontramos coincidencias.
                        </div>
                    )}

                {searchResults.map(place => (
                    <button
                        key={place.id}
                        type="button"
                        className="route-control-result"
                        onClick={() => onPlaceSelect(place)}
                    >
                        <strong>{place.title}</strong>
                        <span>{place.subtitle}</span>
                        <small>{place.description}</small>
                    </button>
                ))}
            </div>

            <div className="route-control-status" aria-live="polite">
                {validationMessage ||
                    (!origin
                        ? "Selecciona punto inicial"
                        : !destination
                            ? "Selecciona punto final"
                            : "Todo listo para calcular tu ruta")}
            </div>

            <button
                type="button"
                className="route-control-primary"
                onClick={onCalculateRoute}
                disabled={!canCalculate}
            >
                {planning ? (
                    <>
                        <span className="route-control-spinner" aria-hidden="true" />
                        Calculando ruta…
                    </>
                ) : (
                    "Calcular ruta"
                )}
            </button>

            {routeCalculated && (
                <div className="route-control-trip-actions">
                    {showStartTripAction && (
                    <button
                        type="button"
                        className="route-control-secondary"
                        onClick={onStartTrip}
                        disabled={startingTrip}
                    >
                        {startingTrip ? "Iniciando viaje…" : "Realizar viaje"}
                    </button>
                    )}
                    <button
                        type="button"
                        className="route-control-ghost"
                        onClick={onCancelTrip}
                    >
                        Limpiar viaje
                    </button>
                </div>
            )}

            {tripMessage && (
                <div className="route-control-message">{tripMessage}</div>
            )}

            <details className="route-control-manual">
                <summary>Explorar una ruta manualmente</summary>
                <label htmlFor="route-select">Ruta de bus</label>
                <select
                    id="route-select"
                    value={selectedRoute}
                    onChange={onRouteChange}
                >
                    <option value="">Seleccione una ruta</option>
                    {routes.map(route => (
                        <option key={route.route} value={route.route}>
                            {route.name}
                        </option>
                    ))}
                </select>
            </details>

            {children && <div className="route-control-trip-options">{children}</div>}
        </section>
    );
}
