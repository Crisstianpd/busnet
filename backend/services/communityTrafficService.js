import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
    distance,
    nearestPointOnLine,
    point
} from "@turf/turf";
import { communityTrafficConfig } from "../config/communityTraffic.js";

const defaultDataFile = fileURLToPath(
    new URL("../data/community-traffic.json", import.meta.url)
);

const severityPriority = {
    low: 1,
    medium: 2,
    high: 3
};

export class CommunityTrafficValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommunityTrafficValidationError";
        this.statusCode = 400;
    }
}

function validateCoordinates(latitude, longitude) {
    return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
}

export function validateCommunityReport(
    input,
    config = communityTrafficConfig
) {
    const type = String(input?.type || "").trim();
    const severity = String(input?.severity || "").trim();
    const description = String(input?.description || "").trim();
    const latitude = Number(input?.latitude);
    const longitude = Number(input?.longitude);
    const requestedRadius = input?.radiusMeters == null
        ? config.defaultRadiusMeters
        : Number(input.radiusMeters);
    const routeId = input?.routeId == null
        ? null
        : String(input.routeId).trim() || null;

    if (!config.allowedTypes.includes(type)) {
        throw new CommunityTrafficValidationError(
            `type debe ser uno de: ${config.allowedTypes.join(", ")}.`
        );
    }

    if (!config.allowedSeverities.includes(severity)) {
        throw new CommunityTrafficValidationError(
            `severity debe ser uno de: ${config.allowedSeverities.join(", ")}.`
        );
    }

    if (
        description.length < config.minimumDescriptionLength ||
        description.length > config.maximumDescriptionLength
    ) {
        throw new CommunityTrafficValidationError(
            `description debe tener entre ${config.minimumDescriptionLength} y ${config.maximumDescriptionLength} caracteres.`
        );
    }

    if (!validateCoordinates(latitude, longitude)) {
        throw new CommunityTrafficValidationError(
            "latitude y longitude deben ser coordenadas válidas."
        );
    }

    if (
        !Number.isFinite(requestedRadius) ||
        requestedRadius < config.minimumRadiusMeters ||
        requestedRadius > config.maximumRadiusMeters
    ) {
        throw new CommunityTrafficValidationError(
            `radiusMeters debe estar entre ${config.minimumRadiusMeters} y ${config.maximumRadiusMeters}.`
        );
    }

    return {
        type,
        severity,
        description,
        latitude,
        longitude,
        radiusMeters: Math.round(requestedRadius),
        routeId
    };
}

function emptyStore() {
    return {
        version: 1,
        lastUpdatedAt: null,
        reports: []
    };
}

function collectPlanPoints(option) {
    const candidates = [
        option?.boardingPoint,
        option?.dropoffPoint,
        ...(option?.legs ?? []).flatMap(leg => [
            leg?.fromPoint,
            leg?.toPoint,
            leg?.point,
            leg?.start,
            leg?.end
        ]),
        ...(option?.transfers ?? []).flatMap(transfer => [
            transfer?.fromPoint,
            transfer?.toPoint,
            Number.isFinite(Number(transfer?.latitude)) &&
            Number.isFinite(Number(transfer?.longitude))
                ? {
                    latitude: Number(transfer.latitude),
                    longitude: Number(transfer.longitude)
                }
                : null
        ])
    ];

    return candidates
        .filter(candidate =>
            validateCoordinates(
                Number(candidate?.latitude),
                Number(candidate?.longitude)
            )
        )
        .map(candidate =>
            point([
                Number(candidate.longitude),
                Number(candidate.latitude)
            ])
        );
}

function nearestDistanceToPlanMeters(
    report,
    option,
    routesById
) {
    const reportPoint = point([
        report.longitude,
        report.latitude
    ]);
    let nearestDistance = Infinity;

    for (const routeId of option?.routes ?? []) {
        const route = routesById.get(String(routeId).toLowerCase());

        for (const line of route?.lines ?? []) {
            try {
                const nearest = nearestPointOnLine(
                    line.feature,
                    reportPoint,
                    { units: "kilometers" }
                );
                const distanceMeters = distance(
                    reportPoint,
                    nearest,
                    { units: "meters" }
                );

                nearestDistance = Math.min(
                    nearestDistance,
                    distanceMeters
                );
            }
            catch {
                // Una geometría inválida no interrumpe el análisis.
            }
        }
    }

    for (const planPoint of collectPlanPoints(option)) {
        nearestDistance = Math.min(
            nearestDistance,
            distance(reportPoint, planPoint, { units: "meters" })
        );
    }

    return nearestDistance;
}

export function createCommunityTrafficService({
    filePath = defaultDataFile,
    now = () => new Date(),
    config = communityTrafficConfig
} = {}) {
    function readStore() {
        if (!fs.existsSync(filePath)) return emptyStore();

        const parsed = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        return {
            version: parsed.version ?? 1,
            lastUpdatedAt: parsed.lastUpdatedAt ?? null,
            reports: Array.isArray(parsed.reports)
                ? parsed.reports
                : []
        };
    }

    function writeStore(store) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const temporaryPath = `${filePath}.${process.pid}.tmp`;
        const updatedStore = {
            ...store,
            lastUpdatedAt: now().toISOString()
        };

        fs.writeFileSync(
            temporaryPath,
            `${JSON.stringify(updatedStore, null, 2)}\n`,
            "utf8"
        );
        fs.renameSync(temporaryPath, filePath);
    }

    function listActiveReports() {
        const currentTime = now().getTime();

        return readStore().reports.filter(report =>
            report.status === "active" &&
            Date.parse(report.expiresAt) > currentTime
        );
    }

    function createReport(input) {
        const validated = validateCommunityReport(input, config);
        const createdAt = now();
        const expiresAt = new Date(
            createdAt.getTime() +
            config.expirationHours * 60 * 60 * 1000
        );
        const report = {
            id: randomUUID(),
            ...validated,
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
            source: "community",
            status: "active"
        };
        const store = readStore();

        store.reports.push(report);
        writeStore(store);

        return report;
    }

    function analyzePlan(option, routesById = new Map()) {
        const reports = listActiveReports();
        const alerts = reports
            .map(report => {
                const distanceMeters = nearestDistanceToPlanMeters(
                    report,
                    option,
                    routesById
                );

                if (
                    !Number.isFinite(distanceMeters) ||
                    distanceMeters > report.radiusMeters
                ) {
                    return null;
                }

                return {
                    reportId: report.id,
                    type: report.type,
                    severity: report.severity,
                    description: report.description,
                    distanceToRouteMeters: Math.round(distanceMeters),
                    radiusMeters: report.radiusMeters,
                    routeId: report.routeId,
                    source: "community",
                    message:
                        "La ruta pasa cerca de tráfico reportado por la comunidad."
                };
            })
            .filter(Boolean)
            .sort((left, right) =>
                severityPriority[right.severity] -
                    severityPriority[left.severity] ||
                left.distanceToRouteMeters - right.distanceToRouteMeters
            );
        const riskLevel = alerts.reduce(
            (current, alert) =>
                severityPriority[alert.severity] >
                severityPriority[current]
                    ? alert.severity
                    : current,
            "low"
        );
        const trafficLevel =
            alerts.length > 0 ? riskLevel : "none";
        const recommendation =
            trafficLevel === "high"
                ? "Hay tráfico alto reportado por la comunidad en esta ruta."
                : trafficLevel === "medium"
                    ? "Hay tráfico medio reportado por la comunidad en esta ruta."
                    : trafficLevel === "low"
                        ? "Hay tráfico bajo reportado por la comunidad en esta ruta."
                        : "No hay reportes comunitarios activos cerca de esta opción.";
        const routeDescription = option?.routes?.length
            ? ` para ${option.routes.join(" y ")}`
            : "";

        return {
            affected: alerts.length > 0,
            source: "community",
            trafficLevel,
            riskLevel: trafficLevel,
            alertCount: alerts.length,
            alerts,
            recommendation,
            voiceMessage:
                trafficLevel === "none"
                    ? "No hay reportes comunitarios activos cerca de la ruta."
                    : `${recommendation} Revisa el mapa antes de iniciar el viaje${routeDescription}.`
        };
    }

    return {
        createReport,
        listActiveReports,
        analyzePlan
    };
}

export const communityTrafficService =
    createCommunityTrafficService();
