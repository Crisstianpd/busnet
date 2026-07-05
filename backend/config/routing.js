export const routingConfig = Object.freeze({
    initialRadiusMeters: 100,
    radiusIncrementMeters: 100,
    maximumRadiusMeters: 1000,
    walkThresholdMeters: 200,
    directBoardingThresholdMeters: 200,
    maximumAlternatives: 4,
    maximumTransfers: 2,
    maximumTransferWalkMeters: 200,
    maximumSearchStates: 500
});

export function resolveRoutingConfig(options = {}) {
    const maximumRadiusMeters = Number(options.maximumRadiusMeters);
    const maximumTransfers = Number(options.maximumTransfers);

    return {
        ...routingConfig,
        maximumRadiusMeters:
            Number.isFinite(maximumRadiusMeters) &&
            maximumRadiusMeters >= routingConfig.initialRadiusMeters
                ? Math.min(maximumRadiusMeters, 5000)
                : routingConfig.maximumRadiusMeters,
        maximumTransfers:
            Number.isInteger(maximumTransfers) &&
            maximumTransfers >= 0
                ? Math.min(maximumTransfers, routingConfig.maximumTransfers)
                : routingConfig.maximumTransfers
    };
}
