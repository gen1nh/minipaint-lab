# Color Lab
The laboratory uses Spectral.js 3.0.0 for approximate digital paint mixing and OKLab for nearest swatch ranking. Recipes use integer drops, dilution, scaling, optional volume and average cost estimates. Commercial catalog: 4743 entries from ten brands; see color-audit.md for structural findings and provenance limitations.
Suggested recipes and individual matches open in the mixer. Drafts survive navigation within the session. Saved recipes persist locally, support comparison and versioned JSON backup with duplicate-content filtering. Image extraction stays in the browser. Cel shading and primer preview are artistic approximations.
## Scope and release
No physical accuracy claims, measured pigment calibration, or exhaustive catalog coverage required. Manual pigment strength remains optional and experimental. No new algorithm or dependency without practical evidence of benefit.
CI passed at 9dc4d0ef9d609d230326175c3fbf5851aec1bd43, including npm ci, lint, typecheck, unit tests, build and Chromium integration tests for recipe scaling, catalog selection, navigation persistence, mobile width and saved recipe deletion protection.
Remaining: validate the final candidate, inspect desktop/mobile appearance and keyboard accessibility, then release through a protected main PR and verify Vercel. Academy remains unchanged.
