import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { centerOfMass } from "@turf/turf";
import { normalizeRoutes } from "./services/geojsonNormalizer.js";
import { validatePlanRequest } from "./services/planRequestValidator.js";
import { planTrip } from "./services/routePlanner.js";
import {
    CommunityTrafficValidationError,
    communityTrafficService
} from "./services/communityTrafficService.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EL_SALVADOR_BBOX = [-90.15, 13.0, -87.55, 14.6];

// Carpeta donde se encuentran los GeoJSON
const geojsonFolder = fileURLToPath(
    new URL("./geojson", import.meta.url)
);

// =========================================
// Cargar todas las rutas al iniciar
// =========================================

const routes = fs
    .readdirSync(geojsonFolder)
    .filter(file => file.endsWith(".geojson"))
    .map(file => {
        const geojson = JSON.parse(
            fs.readFileSync(
                path.join(geojsonFolder, file),
                "utf8"
            )
        );

        // El nombre del archivo sin extensión sirve como plan B si no viene la propiedad 'route'
        const fallbackRoute = path.basename(file, ".geojson");

        // Buscamos las propiedades en la raíz O dentro del primer feature (lo más común en GeoJSON)
        const props = geojson.properties || geojson.features?.[0]?.properties || {};

        return {
            route: props.route || fallbackRoute,
            name: props.name || `Ruta ${fallbackRoute}`,
            color: props.color || "#3b82f6", // Azul por defecto si no trae color
            geojson
        };
    });

console.log(`🚍 Se cargaron ${routes.length} rutas correctamente.`);

function normalizeText(value = "") {
    return String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function stripHtml(value = "") {
    return String(value).replace(/<[^>]*>/g, " ");
}

function getFeatureCenter(feature) {
    try {
        const center = centerOfMass(feature);
        const coordinates = center?.geometry?.coordinates;

        if (!Array.isArray(coordinates) || coordinates.length < 2) {
            return null;
        }

        return coordinates;
    }
    catch {
        return null;
    }
}

function isInsideElSalvador([longitude, latitude]) {
    return longitude >= EL_SALVADOR_BBOX[0]
        && latitude >= EL_SALVADOR_BBOX[1]
        && longitude <= EL_SALVADOR_BBOX[2]
        && latitude <= EL_SALVADOR_BBOX[3];
}

function buildSearchText(route, feature) {
    const values = [
        route.route,
        route.name,
        route.color,
        route.geojson?.properties?.route,
        route.geojson?.properties?.name,
        feature?.properties?.name,
        feature?.properties?.description,
        feature?.properties?.DEPARTAMEN,
        feature?.properties?.Nombre_de_,
        feature?.properties?.SENTIDO,
        feature?.properties?.TIPO,
        feature?.properties?.SUBTIPO,
        feature?.properties?.Código_de,
        feature?.properties?.Description,
    ];

    return normalizeText(
        values
            .filter(Boolean)
            .map(stripHtml)
            .join(" ")
    );
}

function runTripPlaceholder({ origin, destination }) {
    console.log("\n🧭 [VIAJE PLACEHOLDER] Iniciando viaje");
    console.log("📍 Origen:", origin);
    console.log("🏁 Destino:", destination);
}

const normalizationStartedAt = performance.now();
const normalizedRoutes = normalizeRoutes(routes);
const normalizationDurationMilliseconds = Number(
    (performance.now() - normalizationStartedAt).toFixed(2)
);
const normalizedRoutesById = new Map(
    normalizedRoutes.map(route => [
        route.route.toLowerCase(),
        route
    ])
);

console.log(
    `🗺️ ${normalizedRoutes.length} rutas listas para planificación.`
);

// =========================================
// Devuelve la lista de rutas
// =========================================

app.get("/routes", (req, res) => {
    res.json(
        routes.map(route => ({
            route: route.route,
            name: route.name,
            color: route.color
        }))
    );
});

// =========================================
// Devuelve una ruta específica
// =========================================

app.get("/routes/:route", (req, res) => {
    const route = routes.find(
        r => r.route.toLowerCase() === req.params.route.toLowerCase()
    );

    if (!route) {
        return res.status(404).json({
            error: "Ruta no encontrada"
        });
    }

    res.json(route.geojson);
});

app.get("/search", (req, res) => {
    const query = normalizeText(req.query.q || "").trim();

    if (!query) {
        return res.json([]);
    }

    const results = [];

    routes.forEach(route => {
        const features = route.geojson?.features || [];

        features.forEach((feature, featureIndex) => {
            const searchText = buildSearchText(route, feature);

            if (!searchText.includes(query)) {
                return;
            }

            const coordinates = getFeatureCenter(feature);

            if (!coordinates || !isInsideElSalvador(coordinates)) {
                return;
            }

            results.push({
                id: `${route.route}-${featureIndex}`,
                title: feature?.properties?.name || route.name,
                subtitle: route.route,
                description: stripHtml(feature?.properties?.description || route.name),
                coordinates,
                color: route.color,
                route: route.route,
            });
        });
    });

    res.json(results.slice(0, 20));
});

// =========================================

app.post("/plan", (req, res) => {
    const validatedRequest = validatePlanRequest(req.body);

    if (validatedRequest.error) {
        return res.status(400).json({
            error: validatedRequest.error
        });
    }

    const result = planTrip({
        origin: validatedRequest.origin,
        destination: validatedRequest.destination,
        routes: normalizedRoutes,
        options: validatedRequest.options
    });

    if (result.search?.performance) {
        result.search.performance.normalizationStartupMilliseconds =
            normalizationDurationMilliseconds;
    }

    if (!result.bestOption) {
        return res.status(404).json({
            error:
                "No se encontraron rutas cercanas dentro del radio máximo.",
            ...result
        });
    }

    return res.json(result);
});

app.get("/traffic/community", (req, res) => {
    try {
        return res.json(
            communityTrafficService.listActiveReports()
        );
    }
    catch {
        return res.status(500).json({
            error: "No se pudieron leer los reportes de la comunidad."
        });
    }
});

app.post("/traffic/report", (req, res) => {
    try {
        const report = communityTrafficService.createReport(req.body);

        return res.status(201).json(report);
    }
    catch (error) {
        if (error instanceof CommunityTrafficValidationError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: "No se pudo guardar el reporte comunitario."
        });
    }
});

app.post("/traffic/analyze-plan", (req, res) => {
    const option =
        req.body?.bestOption ??
        req.body?.option ??
        req.body;

    if (
        !option ||
        typeof option !== "object" ||
        !Array.isArray(option.routes)
    ) {
        return res.status(400).json({
            error:
                "Debes enviar bestOption u option con un arreglo routes."
        });
    }

    try {
        return res.json(
            communityTrafficService.analyzePlan(
                option,
                normalizedRoutesById
            )
        );
    }
    catch {
        return res.status(500).json({
            error:
                "No se pudo analizar el tráfico reportado por la comunidad."
        });
    }
});

app.post("/trip/start", (req, res) => {
    const {
        origin,
        destination
    } = req.body || {};

    const originLat = Number(origin?.latitude);
    const originLng = Number(origin?.longitude);
    const destinationLat = Number(destination?.latitude);
    const destinationLng = Number(destination?.longitude);

    if (
        !Number.isFinite(originLat)
        || !Number.isFinite(originLng)
        || !Number.isFinite(destinationLat)
        || !Number.isFinite(destinationLng)
    ) {
        return res.status(400).json({
            error: "Origen y destino deben incluir coordenadas válidas."
        });
    }

    runTripPlaceholder({
        origin: {
            latitude: originLat,
            longitude: originLng
        },
        destination: {
            latitude: destinationLat,
            longitude: destinationLng,
            name: destination?.name || "Destino seleccionado"
        }
    });

    return res.json({
        ok: true,
        message: "Viaje simulado correctamente."
    });
});

// =========================================

app.listen(PORT, () => {
    console.log(`🚍 BusNET Backend iniciado con éxito`);
    console.log(`🔗 Puerto: ${PORT}`);
});
