import { useEffect, useState } from "react";

export default function useLocation() {
    const isGeolocationSupported = "geolocation" in navigator;
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(isGeolocationSupported);
    const [error, setError] = useState(
        isGeolocationSupported
            ? null
            : "Tu navegador no soporta geolocalización."
    );

    useEffect(() => {
        if (!isGeolocationSupported) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [isGeolocationSupported]);

    return {
        location,
        loading,
        error,
    };
}
