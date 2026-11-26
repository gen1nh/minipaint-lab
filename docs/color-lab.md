# Color Lab — recipe foundation
Custom paint names, manufacturers, digital swatches, integer drop quantities, dilution, recipe scaling and text export. RGB preview is explicitly provisional; equal drop volume assumed. No official catalog data imported. Next: verify Spectral.js API/license and integrate through a domain adapter, then add licensed catalog and calibration. References: https://github.com/rvanwijnen/spectral.js and https://github.com/iffprove/airbrush-color-mixer (no code copied).

## Spectral preview
The UI now uses a Spectral.js 3.0.0 adapter. RGB remains in the quantity module as a legacy preview for comparison. The library reconstructs reflectance from RGB, not measured paint spectra; drop factors are not physical concentration measurements. Tinting strength defaults to 1; calibration and official catalog remain pending. Upstream example regression tests added. Installation/build not yet verified.

## Appearance and experimental calibration
Cel shading supports an artistic warm/cool bias, not a measured illuminant. Primer preview composites in linear sRGB with user-defined coverage and repeated layers; it is not a physical coating model. Pigment strength is adjustable per ingredient (0.1–5, default 1) and retained in local recipes. This is manual tuning, not manufacturer-specific calibration. Compare dried swatches under consistent light, primer, layer count and dilution; do not claim verified pigment strength without measurements.

## Release checklist
Suggested recipes open directly in the mixer. Local recipes support comparison and versioned JSON backup. Image extraction includes approximate dominant colors using quantized RGB bins. Physical pigment measurements, catalog completeness, browser accessibility, responsive visual review and end-to-end CI remain acceptance checks; deployment success alone does not establish them.
