import "./theme.css";

const nextTheme = {
    system: "light",
    light: "dark",
    dark: "system"
};

const labels = {
    system: "Sistema",
    light: "Claro",
    dark: "Oscuro"
};

function ThemeIcon({ theme }) {
    if (theme === "light") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
            </svg>
        );
    }

    if (theme === "dark") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    );
}

export default function ThemeToggle({ theme, onChange }) {
    const label = labels[theme];

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={() => onChange(nextTheme[theme])}
            aria-label={`Tema actual: ${label}. Cambiar tema`}
            title={`Tema: ${label}`}
        >
            <span key={theme} className="theme-toggle-icon">
                <ThemeIcon theme={theme} />
            </span>
        </button>
    );
}
