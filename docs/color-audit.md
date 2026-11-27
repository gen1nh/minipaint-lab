# Color lab audit — 2026-11-26
Historical snapshot. Current behavior and validation are described in [Color Lab](color-lab.md).

Scope: develop at cbb68bde9a2751206888642af17fa5d8e9e48347. Reviewed catalog files, loader, match/correction, image palette changes, saved recipes, volume/cost, mixer and project guidelines.
## Catalog
4743 rows, ten brands, zero exact duplicate tuples, zero malformed HEX values. 810 empty codes (Citadel 452, Scale75 358). 21 groups sharing brand/range/code with differing HEX: Acrilex 1, Vallejo 1, Army Painter 14, TomColor 5. Preserve original records until authoritative evidence resolves them; name, range and swatch distinguish entries. Source URLs are present in all ten files. This is a structural audit, not verification of manufacturer swatches or current product availability.
## Practical decisions
Keep Spectral.js for approximate mixing and OKLab for digital ranking. No new color-science dependency without demonstrated improvement; no physical accuracy percentages. Direct catalog match now opens in mixer as a one-drop recipe. Keep optional advanced settings collapsed. No new catalog sources in this batch.
## Findings at the audited revision
Unsaved mixer state can be lost on navigation; verify and fix before release. Reverse search is bounded and not exhaustive; correction treats current color as a surrogate pigment. Cost is an average estimate, not itemized. Backup import can duplicate recipes. Review storage errors and destructive actions. Lockfile still absent. Validate exact candidate with CI and desktop/mobile browser checks before PR. Physical calibration is out of scope. Academy unchanged.
