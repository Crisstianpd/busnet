import { useEffect, useRef, useState } from "react";
import busnetBadge from "@ds/assets/logo/busnet-badge.svg";
import { Icon } from "../ui";
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
    routes,
    selectedRoute,
    onRouteChange,
    children
}) {
    const canCalculate = Boolean(origin && destination) && !planning;
    const showStartTripAction = false;
    const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false);
    const panelRef = useRef(null);
    const sheetDragStartY = useRef(null);
    const sheetDragHandled = useRef(false);
    const mobileSheetCollapsed = routeCalculated && !mobileSheetExpanded;

    useEffect(() => {
        panelRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, [routeCalculated, mobileSheetExpanded]);

    const collapseMobileSheet = () => {
        if (typeof window !== "undefined" && window.innerWidth <= 720) {
            setMobileSheetExpanded(false);
        }
    };

    const toggleMobileSheet = () => {
        if (sheetDragHandled.current) {
            sheetDragHandled.current = false;
            return;
        }

        setMobileSheetExpanded(current => !current);
    };

    const handleSheetPointerDown = event => {
        if (
            !routeCalculated ||
            typeof window === "undefined" ||
            window.innerWidth > 720
        ) return;

        sheetDragStartY.current = event.clientY;
        sheetDragHandled.current = false;
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const handleSheetPointerUp = event => {
        if (sheetDragStartY.current === null) return;

        const deltaY = event.clientY - sheetDragStartY.current;

        sheetDragStartY.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);

        if (Math.abs(deltaY) < 24) return;

        sheetDragHandled.current = true;
        setMobileSheetExpanded(deltaY < 0);
    };

    const handleSheetPointerCancel = event => {
        sheetDragStartY.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    };

    const handleCalculateRoute = () => {
        collapseMobileSheet();
        onCalculateRoute();
    };

    const handleCancelTrip = () => {
        setMobileSheetExpanded(false);
        onCancelTrip();
    };

    return (
        <section
            ref={panelRef}
            className={`route-control-panel ${
                routeCalculated ? "is-planned" : ""
            } ${mobileSheetCollapsed ? "is-collapsed" : ""}`}
            aria-label="Planificador de viaje"
        >
            {routeCalculated && (
                <button
                    type="button"
                    className="route-control-sheet-handle"
                    aria-label={
                        mobileSheetCollapsed
                            ? "Mostrar detalles de la ruta"
                            : "Minimizar detalles de la ruta"
                    }
                    aria-expanded={!mobileSheetCollapsed}
                    onClick={toggleMobileSheet}
                    onPointerDown={handleSheetPointerDown}
                    onPointerUp={handleSheetPointerUp}
                    onPointerCancel={handleSheetPointerCancel}
                >
                    <span className="route-control-sheet-grip" aria-hidden="true" />
                    <Icon
                        name={mobileSheetCollapsed ? "chevron-up" : "chevron-down"}
                        size={18}
                        strokeWidth={2.6}
                    />
                </button>
            )}

            <header className="route-control-brand">
                <div className="route-control-brand-lockup">
                    <img
                        className="route-control-logo"
                        src={busnetBadge}
                        alt=""
                        aria-hidden="true"
                    />
                    <div>
                        <span className="route-control-eyebrow">Movilidad inteligente</span>
                        <h1>BUSNET</h1>
                    </div>
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
                            destinationLabel || "Busca destino o elige en mapa"
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
                onClick={handleCalculateRoute}
                disabled={!canCalculate}
            >
                {planning ? (
                    <>
                        <span className="route-control-spinner" aria-hidden="true" />
                        Calculando ruta…
                    </>
                ) : routeCalculated ? (
                    "Actualizar ruta"
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
                        onClick={handleCancelTrip}
                    >
                        Limpiar viaje
                    </button>
                </div>
            )}

            {tripMessage && (
                <div className="route-control-message">{tripMessage}</div>
            )}

            {children && <div className="route-control-trip-options">{children}</div>}

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
        </section>
    );
}
