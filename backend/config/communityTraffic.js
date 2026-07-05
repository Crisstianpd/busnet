export const communityTrafficConfig = Object.freeze({
    allowedTypes: Object.freeze([
        "traffic",
        "accident",
        "road_closed",
        "flood",
        "bus_issue",
        "police_control",
        "other"
    ]),
    allowedSeverities: Object.freeze([
        "low",
        "medium",
        "high"
    ]),
    defaultRadiusMeters: 150,
    minimumRadiusMeters: 25,
    maximumRadiusMeters: 1000,
    minimumDescriptionLength: 3,
    maximumDescriptionLength: 200,
    expirationHours: 2
});
