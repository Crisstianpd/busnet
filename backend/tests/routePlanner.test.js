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

test("recomienda caminar cuando el destino está a menos de 200 metros", () => {
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.2 },
        destination: { latitude: 13.701, longitude: -89.2 },
        routes: []
    });

    assert.equal(result.bestOption.type, "walk");
    assert.equal(result.bestOption.transferCount, 0);
    assert.deepEqual(result.bestOption.routes, []);
    assert.deepEqual(result.bestOption.legs, []);
    assert.deepEqual(result.bestOption.transfers, []);
    assert.equal(result.bestOption.boardingPoint, null);
    assert.equal(result.bestOption.dropoffPoint, null);
    assert.ok(result.bestOption.walkingDistanceMeters < 200);
    assert.match(result.bestOption.reason, /recomienda caminar/i);
});

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
    assert.equal(result.bestOption.transferCount, 0);
    assert.deepEqual(result.bestOption.routes, ["A"]);
    assert.equal(result.search.originRadiusMeters, 100);
    assert.equal(result.search.destinationRadiusMeters, 100);
});

test("prioriza una directa válida aunque un transbordo camine unos metros menos", () => {
    const routes = normalizeRoutes([
        createRoute("Directa", [
            [-89.21, 13.70045],
            [-89.19, 13.70045]
        ]),
        createRoute("A", [
            [-89.21, 13.7],
            [-89.2, 13.7]
        ]),
        createRoute("B", [
            [-89.2, 13.7],
            [-89.19, 13.7]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.21 },
        destination: { latitude: 13.7, longitude: -89.19 },
        routes
    });

    assert.equal(result.bestOption.type, "direct");
    assert.deepEqual(result.bestOption.routes, ["Directa"]);
    assert.ok(result.bestOption.walkingDistanceMeters > 0);
    assert.ok(result.alternatives.every(
        option => option.type === "direct"
    ));
});

test("no usa como ruta final una ruta fuera del radio resuelto del destino", () => {
    const routes = normalizeRoutes([
        createRoute("Origen", [
            [-89.21, 13.7],
            [-89.19, 13.7]
        ]),
        createRoute("Destino", [
            [-89.19, 13.7015],
            [-89.185, 13.7015]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.21 },
        destination: { latitude: 13.7015, longitude: -89.19 },
        routes
    });

    assert.equal(result.search.destinationRadiusMeters, 100);
    assert.equal(result.bestOption.type, "transfer");
    assert.deepEqual(result.bestOption.routes, ["Origen", "Destino"]);
    assert.equal(result.bestOption.destinationDistanceMeters, 0);
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
    assert.equal(
        result.bestOption.transferPoints[0].label,
        "Punto de transbordo aproximado"
    );
    assert.equal(
        result.bestOption.transferPoints[0].connectionType,
        "intersection"
    );
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

test("no amplía candidatos después de encontrar cobertura en ambos extremos", () => {
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

    assert.equal(result.bestOption, null);
    assert.equal(result.search.originRadiusMeters, 100);
    assert.equal(result.search.destinationRadiusMeters, 100);
});

test("devuelve varias combinaciones con un transbordo", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.21, 13.7],
            [-89.2, 13.7]
        ]),
        createRoute("B", [
            [-89.2, 13.7],
            [-89.19, 13.71]
        ]),
        createRoute("C", [
            [-89.2, 13.7005],
            [-89.19, 13.71]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.21 },
        destination: { latitude: 13.71, longitude: -89.19 },
        routes,
        options: { maximumRadiusMeters: 300 }
    });
    const options = [
        result.bestOption,
        ...result.alternatives
    ];

    assert.ok(options.some(option =>
        option.routes.join(">") === "A>B"
    ));
    assert.ok(options.some(option =>
        option.routes.join(">") === "A>C"
    ));
    assert.equal(options[0].type, "transfer");
    assert.ok(options[0].estimatedDistanceMeters > 0);
});

test("no agrega transbordos cuando existe una directa válida", () => {
    const routes = normalizeRoutes([
        createRoute("Directa", [
            [-89.21, 13.7],
            [-89.19, 13.71]
        ]),
        createRoute("A", [
            [-89.21, 13.7],
            [-89.2, 13.7]
        ]),
        createRoute("B", [
            [-89.2, 13.7],
            [-89.19, 13.71]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.21 },
        destination: { latitude: 13.71, longitude: -89.19 },
        routes,
        options: { maximumRadiusMeters: 300 }
    });
    const options = [
        result.bestOption,
        ...result.alternatives
    ];

    assert.equal(result.bestOption.type, "direct");
    assert.deepEqual(result.bestOption.routes, ["Directa"]);
    assert.ok(options.every(option => option.type === "direct"));
});

test("excluye una directa fuera del primer radio con cobertura", () => {
    const routes = normalizeRoutes([
        createRoute("DirectaLejana", [
            [-89.21, 13.706],
            [-89.19, 13.716]
        ]),
        createRoute("A", [
            [-89.21, 13.7],
            [-89.2, 13.7]
        ]),
        createRoute("B", [
            [-89.2, 13.7],
            [-89.19, 13.71]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.21 },
        destination: { latitude: 13.71, longitude: -89.19 },
        routes,
        options: { maximumRadiusMeters: 1000 }
    });

    assert.equal(result.bestOption.type, "transfer");
    assert.deepEqual(result.bestOption.routes, ["A", "B"]);
    const directOption = result.alternatives.find(
        option => option.type === "direct"
    );
    assert.equal(directOption, undefined);
});

test("limita resultados a cuatro alternativas sin duplicados", () => {
    const destination = [-89.19, 13.71];
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.22, 13.7],
            [-89.2, 13.7]
        ]),
        ...["B", "C", "D", "E", "F"].map((route, index) =>
            createRoute(route, [
                [-89.2 + index * 0.0001, 13.7],
                destination
            ])
        )
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.22 },
        destination: {
            latitude: destination[1],
            longitude: destination[0]
        },
        routes,
        options: { maximumRadiusMeters: 300 }
    });
    const options = [
        result.bestOption,
        ...result.alternatives
    ];
    const keys = options.map(option =>
        `${option.type}:${option.routes.join(">")}`
    );

    assert.equal(options.length, 4);
    assert.equal(new Set(keys).size, options.length);
    assert.ok(options.every(option =>
        option.type === "direct" ||
        option.type === "transfer"
    ));
});

test("encuentra una conexión con máximo dos transbordos", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.23, 13.7],
            [-89.22, 13.7]
        ]),
        createRoute("B", [
            [-89.22, 13.7],
            [-89.21, 13.71]
        ]),
        createRoute("C", [
            [-89.21, 13.71],
            [-89.2, 13.71]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.23 },
        destination: { latitude: 13.71, longitude: -89.2 },
        routes,
        options: {
            maximumRadiusMeters: 300,
            maximumTransfers: 2
        }
    });

    assert.equal(result.bestOption.type, "transfer");
    assert.equal(result.bestOption.transferCount, 2);
    assert.deepEqual(result.bestOption.routes, ["A", "B", "C"]);
    assert.equal(result.bestOption.transfers.length, 2);
    assert.equal(
        new Set(result.bestOption.routes).size,
        result.bestOption.routes.length
    );
});

test("no crea ciclos ni supera el máximo de dos transbordos", () => {
    const routes = normalizeRoutes([
        createRoute("A", [
            [-89.24, 13.7],
            [-89.23, 13.7]
        ]),
        createRoute("B", [
            [-89.23, 13.7],
            [-89.22, 13.71]
        ]),
        createRoute("C", [
            [-89.22, 13.71],
            [-89.21, 13.72]
        ]),
        createRoute("D", [
            [-89.21, 13.72],
            [-89.2, 13.73]
        ])
    ]);
    const result = planTrip({
        origin: { latitude: 13.7, longitude: -89.24 },
        destination: { latitude: 13.73, longitude: -89.2 },
        routes,
        options: {
            maximumRadiusMeters: 100,
            maximumTransfers: 2
        }
    });

    assert.equal(result.bestOption, null);
});
