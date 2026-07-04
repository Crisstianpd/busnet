import assert from "node:assert/strict";
import test from "node:test";
import {
    feature,
    featureCollection,
    lineString
} from "@turf/turf";
import { normalizeRoutes } from "../services/geojsonNormalizer.js";
import { planTrip } from "../services/routePlanner.js";

function createRoute(route, coordinates) {
    const geojson = featureCollection([lineString(coordinates)]);

    return {
        route,
        name: `Ruta de prueba ${route}`,
        color: "#1E88E5",
        geojson
    };
}

test("encuentra una ruta directa dentro del radio inicial", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.2, 13.7],
            [-89.19, 13.71]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7001, longitude: -89.2001 },
        destination: { latitude: 13.7099, longitude: -89.1901 },
        routes
    });

    assert.equal(result.bestOption.type, "direct");
    assert.deepEqual(result.bestOption.routes, ["A"]);
    assert.equal(result.search.originRadiusMeters, 100);
    assert.equal(result.search.destinationRadiusMeters, 100);
});

test("amplía el radio en pasos de 100 metros", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.2, 13.7],
            [-89.19, 13.7]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7015, longitude: -89.2 },
        destination: { latitude: 13.7015, longitude: -89.19 },
        routes
    });

    assert.equal(result.search.originRadiusMeters, 200);
    assert.equal(result.search.destinationRadiusMeters, 200);
    assert.equal(result.bestOption.type, "direct");
});

test("encuentra una combinación con un transbordo", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.21, 13.7],
            [-89.2, 13.7]
        ]),
        createRoute("B", [
            [-89.2, 13.7],
            [-89.2, 13.71]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.2099 },
        destination: { latitude: 13.7099, longitude: -89.2 },
        routes
    });

    assert.equal(result.bestOption.type, "transfer");
    assert.deepEqual(result.bestOption.routes, ["A", "B"]);
    assert.equal(result.bestOption.transferWalkDistanceMeters, 0);
});

test("termina sin resultado al alcanzar el radio máximo", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.2, 13.7],
            [-89.19, 13.7]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 14, longitude: -90 },
        destination: { latitude: 14.1, longitude: -90.1 },
        routes,
        options: { maximumRadiusMeters: 400 }
    });

    assert.equal(result.bestOption, null);
    assert.equal(result.search.originRadiusMeters, 400);
    assert.equal(result.search.destinationRadiusMeters, 400);
});

test("normaliza GeometryCollection sin perder sus líneas", () => {
    const geojson = featureCollection([
        feature({
            type: "GeometryCollection",
            geometries: [
                {
                    type: "LineString",
                    coordinates: [
                        [-89.21, 13.7],
                        [-89.2, 13.7]
                    ]
                },
                {
                    type: "LineString",
                    coordinates: [
                        [-89.2, 13.7],
                        [-89.19, 13.7]
                    ]
                }
            ]
        })
    ]);
    const [route] = normalizeRoutes([{
        route: "GC",
        name: "Ruta GeometryCollection",
        color: "#00897B",
        geojson
    }]);

    assert.equal(route.lines.length, 2);
});

test("respeta un radio máximo personalizado", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.2, 13.7],
            [-89.19, 13.7]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.704, longitude: -89.2 },
        destination: { latitude: 13.704, longitude: -89.19 },
        routes,
        options: { maximumRadiusMeters: 300 }
    });

    assert.equal(result.bestOption, null);
    assert.equal(result.search.maximumRadiusMeters, 300);
});

test("amplía candidatos hasta encontrar una conexión válida", () => {
    const routes = normalizeRoutes([
        createRoute("CercanaOrigen", [
            [-89.21, 13.7],
            [-89.205, 13.7]
        ]),
        createRoute("Directa", [
            [-89.21, 13.702],
            [-89.19, 13.702]
        ]),
        createRoute("CercanaDestino", [
            [-89.195, 13.7],
            [-89.19, 13.7]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.21 },
        destination: { latitude: 13.7, longitude: -89.19 },
        routes,
        options: { maximumRadiusMeters: 300 }
    });

    assert.equal(result.bestOption.type, "direct");
    assert.deepEqual(result.bestOption.routes, ["Directa"]);
    assert.equal(result.search.originRadiusMeters, 300);
    assert.equal(result.search.destinationRadiusMeters, 300);
});
