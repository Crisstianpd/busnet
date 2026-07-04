import assert from "node:assert/strict";
import test from "node:test";
import { validatePlanRequest } from "../services/planRequestValidator.js";

test("rechaza coordenadas faltantes", () => {
    const result = validatePlanRequest({
        origin: { latitude: 13.7 }
    });

    assert.match(result.error, /requieren las coordenadas/i);
});

test("rechaza coordenadas no numéricas", () => {
    const result = validatePlanRequest({
        origin: { latitude: "norte", longitude: -89.2 },
        destination: { latitude: 13.71, longitude: -89.19 }
    });

    assert.match(result.error, /valores numéricos/i);
});

test("rechaza coordenadas fuera de rango", () => {
    const result = validatePlanRequest({
        origin: { latitude: 100, longitude: -89.2 },
        destination: { latitude: 13.71, longitude: -89.19 }
    });

    assert.match(result.error, /fuera del rango/i);
});

test("normaliza coordenadas numéricas recibidas como texto", () => {
    const result = validatePlanRequest({
        origin: { latitude: "13.7", longitude: "-89.2" },
        destination: { latitude: "13.71", longitude: "-89.19" }
    });

    assert.deepEqual(result.origin, {
        latitude: 13.7,
        longitude: -89.2
    });
});
