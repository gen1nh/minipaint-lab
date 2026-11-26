# Color Lab
The laboratory uses Spectral.js 3.0.0 for approximate digital paint mixing and OKLab for nearest swatch ranking. Recipes use integer drops and dilution, with proportions shown alongside the preview. Commercial catalog: 4743 entries from ten brands; see color-audit.md for structural findings and provenance limitations.
Suggested recipes and individual matches open in the mixer. Drafts survive navigation within the session. Saved recipes persist locally, support comparison and versioned JSON backup with duplicate-content filtering. Image extraction stays in the browser. Cel shading and primer preview are artistic approximations.
## Scope and release
No physical accuracy claims, measured pigment calibration, or exhaustive catalog coverage required. Optional strength values in older recipes are still accepted. No new algorithm or dependency without practical evidence of benefit.
The CI workflow runs npm ci, lint, typecheck, unit tests, build and Chromium integration tests for the exact release candidate.
Remaining: validate the final candidate, inspect desktop/mobile appearance and keyboard accessibility, then release through a protected main PR and verify Vercel. The Academy content remains frozen for the color release.

Application guidance is optional. New mixes start at zero diluent. Saved recipes record the selected technique and diluent. The Vallejo guidance links to examples for the matched paints. Dilution is recorded separately from the spectral color preview.
