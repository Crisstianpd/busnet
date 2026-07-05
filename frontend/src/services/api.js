const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const EL_SALVADOR_VIEWBOX = "-90.15,14.60,-87.55,13.00";

async function parseResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Error HTTP ${response.status}`);
    }

    return data;
}

export async function getRoutes() {
    const response = await fetch(`${API}/routes`);

    return parseResponse(response);
}

export async function getRoute(id) {
    const response = await fetch(`${API}/routes/${id}`);

    return parseResponse(response);
}

export async function searchPlaces(query, signal) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=sv&bounded=1&viewbox=${EL_SALVADOR_VIEWBOX}&addressdetails=1&limit=8`,
        {
            signal,
            headers: {
                "Accept-Language": "es"
            }
        }
    );
    const results = await parseResponse(response);

    return results
        .map((place, index) => {
            const latitude = Number(place.lat);
            const longitude = Number(place.lon);
            const address = place.address || {};
            const title =
                place.name ||
                place.display_name?.split(",")[0] ||
                query;
            const locality =
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                address.suburb ||
                address.county ||
                "El Salvador";

            return {
                id: `${place.osm_type || "place"}-${place.osm_id || index}`,
                title,
                subtitle: locality,
                description: place.display_name,
                coordinates: [longitude, latitude]
            };
        })
        .filter(place =>
            Number.isFinite(place.coordinates[0]) &&
            Number.isFinite(place.coordinates[1])
        );
}

export async function planTrip(origin, destination, options = {}) {
    const response = await fetch(`${API}/plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            origin,
            destination,
            options
        })
    });

    return parseResponse(response);
}

export async function getCommunityTrafficReports() {
    const response = await fetch(`${API}/traffic/community`);

    return parseResponse(response);
}

export async function createCommunityTrafficReport(report) {
    const response = await fetch(`${API}/traffic/report`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(report)
    });

    return parseResponse(response);
}

export async function analyzeCommunityTrafficPlan(option) {
    const response = await fetch(`${API}/traffic/analyze-plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ option })
    });

    return parseResponse(response);
}

export async function startTrip(origin, destination) {
    const response = await fetch(`${API}/trip/start`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            origin,
            destination
        })
    });

    return parseResponse(response);
}
