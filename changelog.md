# Changelog

Notable project changes are recorded here. Entries are written in English and grouped by version using the Keep a Changelog categories: Added, Changed, Deprecated, Removed, Fixed, and Security.

## [Unreleased]

## [0.2.0] - 2026-10-12

### Added

- Made `POST /api/message` return the generated SVG as a downloadable attachment.

### Changed

- Download the preview PNG directly in the browser without uploading it to an external service.

### Removed

- Removed the unused image upload API and the Vercel Blob dependency.

## [0.1.3] - 2026-10-12

### Fixed

- Adjusted the preview card layout and background styling so the generated message card remains readable and visually consistent across export sizes.
- Corrected the export flow to wait for fonts to finish loading before capturing the preview image.

### Changed

- Updated the preview frame proportions and typography to better match the card design and improve visual balance.

## [0.1.2] - 2026-10-11

### Added

- Added repository-specific AI instructions, skills, and an on-demand semantic versioning prompt.

### Changed

- Standardized repository references on the name Message from Heaven and changed the Blob upload path prefix to `message-from-heaven`.
