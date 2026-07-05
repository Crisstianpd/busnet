import { useCallback, useState } from "react";

const STORAGE_KEY = "animationsEnabled";

function initialPreference() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored !== null) return stored !== "false";

    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function useAnimationsPreference() {
    const [animationsEnabled, setAnimationsEnabled] =
        useState(initialPreference);

    const toggleAnimations = useCallback(() => {
        setAnimationsEnabled(current => {
            const next = !current;
            localStorage.setItem(STORAGE_KEY, String(next));
            return next;
        });
    }, []);

    return { animationsEnabled, toggleAnimations };
}
