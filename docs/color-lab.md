# Color Lab — recipe foundation
Custom paint names, manufacturers, digital swatches, integer drop quantities, dilution, recipe scaling and text export. RGB preview is explicitly provisional; equal drop volume assumed. No official catalog data imported. Next: verify Spectral.js API/license and integrate through a domain adapter, then add licensed catalog and calibration. References: https://github.com/rvanwijnen/spectral.js and https://github.com/iffprove/airbrush-color-mixer (no code copied).

## Spectral preview
The UI now uses a Spectral.js 3.0.0 adapter. RGB remains in the quantity module as a legacy preview for comparison. The library reconstructs reflectance from RGB, not measured paint spectra; drop factors are not physical concentration measurements. Tinting strength defaults to 1; calibration and official catalog remain pending. Upstream example regression tests added. Installation/build not yet verified.
