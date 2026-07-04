import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Carpeta donde se encuentran los GeoJSON
const geojsonFolder = "./geojson";

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

// =========================================

app.listen(PORT, () => {
    console.log(`\n🚍 BusNET Backend iniciado con éxito`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
});