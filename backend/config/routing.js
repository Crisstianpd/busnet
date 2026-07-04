export const routingConfig = Object.freeze({
    initialRadiusMeters: 100,
    radiusIncrementMeters: 100,
    maximumRadiusMeters: 1000,
    maximumAlternatives: 4,
    maximumTransfers: 1,
    maximumTransferWalkMeters: 200
});

export function resolveRoutingConfig(options = {}) {
    const maximumRadiusMeters = Number(options.maximumRadiusMeters);

    return {
        ...routingConfig,
        maximumRadiusMeters:
            Number.isFinite(maximumRadiusMeters) &&
            maximumRadiusMeters >= routingConfig.initialRadiusMeters
                ? Math.min(maximumRadiusMeters, 5000)
                : routingConfig.maximumRadiusMeters
    };
}
