import { useCallback, useEffect, useState } from "react";

export default function useLocation() {
    const isGeolocationSupported = "geolocation" in navigator;
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(isGeolocationSupported);
    const [error, setError] = useState(
        isGeolocationSupported
            ? null
            : "Tu navegador no soporta geolocalización."
    );

    const requestLocation = useCallback(() => {
        if (!isGeolocationSupported) {
            setError("Tu navegador no soporta geolocalización.");
            return Promise.resolve(null);
        }

        setLoading(true);
        setError(null);
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const nextLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    };

                    setLocation(nextLocation);
                    setLoading(false);
                    resolve(nextLocation);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    }, [isGeolocationSupported]);

    useEffect(() => {
        const timeoutId = setTimeout(requestLocation, 0);

        return () => clearTimeout(timeoutId);
    }, [requestLocation]);

    return {
        location,
        loading,
        error,
        requestLocation,
    };
}
