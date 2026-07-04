export function validatePlanRequest(body = {}) {
    const { origin, destination, options } = body;
    const coordinates = [
        origin?.latitude,
        origin?.longitude,
        destination?.latitude,
        destination?.longitude
    ];

    if (coordinates.some(value => value === undefined || value === null)) {
        return {
            error: "Se requieren las coordenadas de origen y destino."
        };
    }

    if (coordinates.some(value => !Number.isFinite(Number(value)))) {
        return {
            error: "Las coordenadas deben ser valores numéricos."
        };
    }

    const numericOrigin = {
        latitude: Number(origin.latitude),
        longitude: Number(origin.longitude)
    };
    const numericDestination = {
        latitude: Number(destination.latitude),
        longitude: Number(destination.longitude)
    };

    if (
        Math.abs(numericOrigin.latitude) > 90 ||
        Math.abs(numericDestination.latitude) > 90 ||
        Math.abs(numericOrigin.longitude) > 180 ||
        Math.abs(numericDestination.longitude) > 180
    ) {
        return {
            error: "Las coordenadas están fuera del rango permitido."
        };
    }

    return {
        origin: numericOrigin,
        destination: numericDestination,
        options
    };
}
