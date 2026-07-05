import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { lineString } from "@turf/turf";
import {
    CommunityTrafficValidationError,
    createCommunityTrafficService
} from "../services/communityTrafficService.js";

function createTestService(t, initialDate = "2026-07-04T12:00:00.000Z") {
    const directory = fs.mkdtempSync(
        path.join(os.tmpdir(), "busnet-community-traffic-")
    );
    const filePath = path.join(directory, "reports.json");
    let currentDate = new Date(initialDate);
    const service = createCommunityTrafficService({
        filePath,
        now: () => new Date(currentDate)
    });

    t.after(() => {
        fs.rmSync(directory, { recursive: true, force: true });
    });

    return {
        service,
        filePath,
        setNow(value) {
            currentDate = new Date(value);
        }
    };
}

function validReport(overrides = {}) {
    return {
        type: "traffic",
        severity: "medium",
        description: "Tráfico lento reportado por la comunidad",
        latitude: 13.7,
        longitude: -89.2,
        radiusMeters: 150,
        ...overrides
    };
}

function routeMap(coordinates) {
    return new Map([
        [
            "a",
            {
                route: "A",
                lines: [{
                    feature: lineString(coordinates)
                }]
            }
        ]
    ]);
}

test("crea y persiste un reporte comunitario válido", t => {
    const { service, filePath } = createTestService(t);
    const report = service.createReport(validReport({
        routeId: "29-E"
    }));
    const stored = JSON.parse(fs.readFileSync(filePath, "utf8"));

    assert.ok(report.id);
    assert.equal(report.source, "community");
    assert.equal(report.status, "active");
    assert.equal(report.routeId, "29-E");
    assert.equal(
        Date.parse(report.expiresAt) - Date.parse(report.createdAt),
        2 * 60 * 60 * 1000
    );
    assert.equal(stored.reports.length, 1);
});

test("rechaza coordenadas inválidas", t => {
    const { service } = createTestService(t);

    assert.throws(
        () => service.createReport(validReport({
            latitude: 91
        })),
        CommunityTrafficValidationError
    );
});

test("lista únicamente reportes activos", t => {
    const { service, filePath } = createTestService(t);
    const active = service.createReport(validReport());
    const store = JSON.parse(fs.readFileSync(filePath, "utf8"));

    store.reports.push({
        ...active,
        id: "resolved-report",
        status: "resolved"
    });
    fs.writeFileSync(
        filePath,
        JSON.stringify(store, null, 2),
        "utf8"
    );

    const reports = service.listActiveReports();

    assert.equal(reports.length, 1);
    assert.equal(reports[0].id, active.id);
});

test("ignora reportes expirados", t => {
    const { service, setNow } = createTestService(t);

    service.createReport(validReport());
    setNow("2026-07-04T14:00:01.000Z");

    assert.deepEqual(service.listActiveReports(), []);
});

test("detecta una ruta cercana a un reporte activo", t => {
    const { service } = createTestService(t);

    service.createReport(validReport({
        latitude: 13.7004,
        longitude: -89.2,
        severity: "high",
        radiusMeters: 100
    }));
    const result = service.analyzePlan(
        { routes: ["A"], transfers: [] },
        routeMap([
            [-89.21, 13.7],
            [-89.19, 13.7]
        ])
    );

    assert.equal(result.affected, true);
    assert.equal(result.trafficLevel, "high");
    assert.equal(result.riskLevel, "high");
    assert.equal(result.alertCount, 1);
    assert.ok(result.alerts[0].distanceToRouteMeters < 100);
    assert.match(result.alerts[0].message, /comunidad/i);
    assert.match(result.recommendation, /tráfico alto/i);
    assert.match(result.voiceMessage, /comunidad/i);
});

test("no detecta una ruta alejada del reporte", t => {
    const { service } = createTestService(t);

    service.createReport(validReport({
        latitude: 13.8,
        longitude: -89.3,
        radiusMeters: 100
    }));
    const result = service.analyzePlan(
        { routes: ["A"], transfers: [] },
        routeMap([
            [-89.21, 13.7],
            [-89.19, 13.7]
        ])
    );

    assert.equal(result.affected, false);
    assert.equal(result.trafficLevel, "none");
    assert.equal(result.alertCount, 0);
    assert.deepEqual(result.alerts, []);
    assert.ok(result.voiceMessage);
});
