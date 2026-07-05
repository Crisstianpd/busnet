import { useEffect, useState } from "react";

const STORAGE_KEY = "busnetTheme";
const THEMES = new Set(["light", "dark", "system"]);

function initialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.has(stored) ? stored : "system";
}

function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export default function useTheme() {
    const [theme, setThemeState] = useState(initialTheme);
    const [resolvedTheme, setResolvedTheme] = useState(
        theme === "system" ? systemTheme() : theme
    );

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const applyTheme = () => {
            const resolved = theme === "system"
                ? (media.matches ? "dark" : "light")
                : theme;

            setResolvedTheme(resolved);
            document.documentElement.dataset.theme = resolved;
            document.documentElement.style.colorScheme = resolved;
        };

        applyTheme();
        media.addEventListener("change", applyTheme);

        return () => media.removeEventListener("change", applyTheme);
    }, [theme]);

    function setTheme(nextTheme) {
        if (!THEMES.has(nextTheme)) return;
        localStorage.setItem(STORAGE_KEY, nextTheme);
        setThemeState(nextTheme);
    }

    return { theme, resolvedTheme, setTheme };
}
