import { useEffect, useState } from "react";

function initialPreference() {
    if (typeof window === "undefined") return true;

    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function useAnimationsPreference() {
    const [animationsEnabled, setAnimationsEnabled] =
        useState(initialPreference);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = () => setAnimationsEnabled(!mediaQuery.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return animationsEnabled;
}
