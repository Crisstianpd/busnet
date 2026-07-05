const API = "http://localhost:3000";
const EL_SALVADOR_VIEWBOX = "-90.15,14.60,-87.55,13.00";
import Fuse from "fuse.js";

async function parseResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Error HTTP ${response.status}`);
    }

    return response.json();

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

    const results = await parseJson(response);

    return results.map((place, index) => {

        const latitude = Number(place.lat);
        const longitude = Number(place.lon);
        const address = place.address || {};
        const title = place.name || place.display_name?.split(",")[0] || query;
        const locality = address.city || address.town || address.village || address.municipality || address.suburb || address.county || "El Salvador";

        return {
            id: `${place.osm_type || "place"}-${place.osm_id || index}`,
            title,
            subtitle: locality,
            description: place.display_name,
            coordinates: [longitude, latitude],
        };

    }).filter(place => Number.isFinite(place.coordinates[0]) && Number.isFinite(place.coordinates[1]));

}