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
