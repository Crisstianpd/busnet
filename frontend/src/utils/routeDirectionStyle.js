function normalizeHex(color) {
    const value = color?.replace("#", "");

    return /^[0-9a-f]{6}$/i.test(value) ? value : "2563EB";
}

function mixWithWhite(color, amount) {
    const value = Number.parseInt(normalizeHex(color), 16);
    const channels = [
        (value >> 16) & 255,
        (value >> 8) & 255,
        value & 255
    ].map(channel =>
        Math.round(channel + (255 - channel) * amount)
    );

    return `#${channels
        .map(channel => channel.toString(16).padStart(2, "0"))
        .join("")}`;
}

export function directionForFeature(feature, index) {
    const properties = feature?.properties ?? {};
    const direction = properties.direction?.toLowerCase();

    if (direction === "ida" || direction === "regreso") {
        return direction;
    }

    const declaredDirection = (
        properties.SENTIDO ||
        properties.sentido ||
        properties.name ||
        ""
    ).toString().toLowerCase();

    if (declaredDirection.includes("regreso")) return "regreso";
    if (declaredDirection.includes("ida")) return "ida";

    const sourceFeatureIndex =
        properties.sourceFeatureIndex ?? index;

    return sourceFeatureIndex === 1 ? "regreso" : "ida";
}

export function directionColor(baseColor, direction) {
    return direction === "regreso"
        ? mixWithWhite(baseColor, 0.3)
        : mixWithWhite(baseColor, 0.08);
}
