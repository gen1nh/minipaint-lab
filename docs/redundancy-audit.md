# Redundancy audit
Reviewed the dashboard, navigation, mixer, recipe extras, catalog picker, color tools, corrector, cel shading, color domain, CSS and package manifest. Home shortcuts intentionally reuse existing views. No duplicate runtime library identified in the four direct runtime dependencies.

## Changes
- Shared catalog hook for loading state and manufacturer options; cached loader remains the data source.
- Shared reference colors for reverse mixing and correction.
- Removed repeated correction heading.
- Added prevention rules to AGENTS.md.

## Remaining consolidation
- Atelier should own recipe management; mixer should own saving the current recipe. Current atelier is a read-only list with links into mixer management. Move management without losing backup, compare or deletion safeguards.
- Consolidate layered global/workspace CSS after visual regression review.
- Remove unused RGB recipe preview after checking all consumers; retain distinct artistic and spectral operations. Share exact sRGB conversion where appropriate, not unlike algorithms.
- Reconcile historical design and release notes with current behavior.
- Validate navigation and storage behavior with regression tests. Academy content unchanged.

## Second pass
Recipe management moved to Atelier, with backup, comparison, opening and deletion retained. Mixer keeps saving. Removed obsolete RGB calculation from recipe quantities; spectral preview remains unchanged. Regression tests updated. CSS consolidation remains pending visual validation.

## Third pass
Consolidated global theme tokens, control styling and responsive rules; feature-specific layout stays in feature CSS. Mixer save panel no longer duplicates library count or cached recipe state. Pending CI and visual review of this candidate.


## Performance and identity pass

Measured with the production build. The home page requests the document, one JavaScript entry, one stylesheet, one variable font and the favicon. It makes no catalog or artwork requests.

| Resource | Before | After |
| --- | ---: | ---: |
| Entry JavaScript, gzip | 78.41 kB | 74.79 kB |
| Entry CSS, gzip | 7.70 kB | 7.42 kB |
| Local WOFF2 payload | 76.06 kB | 30.09 kB |

Academy and Atelier load on first access. Two replaced font files and their distribution notices were removed. The relative sizes above measure the distribution files, independently of browser cache and connection speed.

The first catalog load fetches the index and ten brand files in parallel after reading the index, totaling 248 kB of raw JSON. Keep the attributed brand files as the source. A generated compressed bundle is worth testing against the current setup on a slow connection. The 4× CPU throttling smoke run measured about 76 ms for the standard search handler and 133 ms for advanced search. If reproduced on target phones, moving the search off the main thread would protect interaction responsiveness. This was a single local sample of the synchronous handler, separate from elapsed network and rendering time.

The three SVGs total 441 kB raw and are fetched by selection. Future SVG optimization must preserve paint masks and attribution. The repository still uses Tailwind reset, a spacing token and the screen-reader-only utility. A CSS-only reset migration would require a deliberate cross-browser visual regression review. Generated build outputs, test artifacts and installed dependencies are already ignored by Git.


## Mixer follow-up

The catalog now ships as one generated JSON response while keeping the per-brand source files and their provenance. Both the picker and the nearest-paint result recover together after a retry. The build reports about 248 kB raw and 65 kB gzip for the combined response.

OKLab values for catalog paints are reused, and requesting one match uses a single scan. In five local Chromium measurements per mode with 4× CPU throttling, the advanced search handler median went from 81 to 59 ms. The measurements cover synchronous event work only. Worker migration remains a separate decision after testing on representative devices.

The mixer closes its save dialog on navigation, commits a new paint only after selection and restores focus on cancel and removal. The preview appears before the scale where the available workspace is under 800 px. The preview tabs share a stable height. New recipes store catalog identifiers, and legacy dilution rules still recognize the former composite paint names.
