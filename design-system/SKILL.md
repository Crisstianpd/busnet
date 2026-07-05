---
name: busnet-design
description: Use this skill to generate well-branded interfaces and assets for BusNET, either for production or throwaway prototypes/mocks/etc. BusNET is a public-transit mobility platform for El Salvador (Waze-meets-Moovit trip planning, real-time bus tracking, and a B2B fleet dashboard). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key facts:
- **Dark-first.** Night-blue `#0B1220` background/map, surfaces `#141C2B`/`#1D2839`. Brand green `#00D26A`. Amber `#FFB020` for ETA/alerts/Premium; red `#FF4D4D` only for errors. Text `#F3F6FB`/`#93A1B5`.
- **8-color route palette** (`--route-1…8`) for painting distinct bus routes on the dark map.
- **Manrope** (display/UI, extrabold for route numbers & ETAs) + **JetBrains Mono** (placas/códigos).
- **High contrast, big touch targets (≥44px), friendly radii (12–16px, sheets 24px)** — passengers use it outdoors in sunlight.
- **Copy in neutral Salvadoran Spanish**, "tú" not "usted" ("¿A dónde vas?", "Tu bus llega en 6 min").
- Tokens in `tokens/`, components under `window.BusNETDesignSystem_...` (see README index), UI kits in `ui_kits/`, motion spec in `guidelines/micro-animations.md`.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
