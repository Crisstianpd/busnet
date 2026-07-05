export const routingConfig = Object.freeze({
    initialRadiusMeters: 100,
    radiusIncrementMeters: 100,
    maximumRadiusMeters: 5000,
    preferredWalkToRouteMeters: 200,
    walkOnlyThresholdMeters: 200,
    maximumAlternatives: 4,
    maximumBuses: 3,
    maximumTransfers: 2,
    maximumTransferWalkMeters: 200,
    maximumTransferCandidatesPerPair: 4,
    maximumOriginCandidates: 8,
    maximumDestinationCandidates: 8,
    maximumGeneratedOptions: 64,
    maximumSearchStates: 5000,
    enablePerformanceLogs: false
});

export function resolveRoutingConfig(options = {}) {
    const maximumRadiusMeters = Number(options.maximumRadiusMeters);
    const maximumTransfers = Number(options.maximumTransfers);

    return {
        ...routingConfig,
        maximumRadiusMeters:
            Number.isFinite(maximumRadiusMeters) &&
            maximumRadiusMeters >= routingConfig.initialRadiusMeters
                ? Math.min(
                    maximumRadiusMeters,
                    routingConfig.maximumRadiusMeters
                )
                : routingConfig.maximumRadiusMeters,
        maximumTransfers:
            Number.isInteger(maximumTransfers) &&
            maximumTransfers >= 0
                ? Math.min(
                    maximumTransfers,
                    routingConfig.maximumTransfers,
                    routingConfig.maximumBuses - 1
                )
                : routingConfig.maximumTransfers,
        enablePerformanceLogs:
            options.enablePerformanceLogs === true
    };
}
