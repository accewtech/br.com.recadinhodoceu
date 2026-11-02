# Changelog

Notable project changes are recorded here. Entries are written in English and grouped by version using the Keep a Changelog categories: Added, Changed, Deprecated, Removed, Fixed, and Security.

## [Unreleased]

## [1.1.0] - 2026-11-02

### Added

- Added a public home page and login flow for the protected message editors.
- Added JWT bearer-token authentication for the message-generation APIs.

### Security

- Protected the v1 and v2 editors and message-generation APIs with JWT sessions.

## [1.0.0] - 2026-11-02

### Added

- Added iOS-inspired selection handles to highlighted text in the v2 card.
- Added a textured SVG card shape to the message card design.

### Changed

- Made the v2 editor the default homepage and added a highlighted sample passage.

## [0.4.0] - 2026-11-01

### Added

- Added a versioned v2 message editor and API with Markdown formatting and explicit text highlights.
- Added the v1 API endpoint while keeping `/api/message` available as a v1 compatibility route.
- Added Dependabot configuration, pre-commit lint checks, and trademark usage guidelines.

### Changed

- Organized message rendering into version-specific modules and shared resources.
- Standardized the dependency lockfile on Yarn.

## [0.3.1] - 2026-10-23

### Fixed

- Corrected the browser preview and PNG download dimensions to 1080 × 1350.
- Included the Chromium binaries in the traced files for the message API.

## [0.3.0] - 2026-10-12

### Added

- Added a downloadable WebP export for `POST /api/message` using the same shared message-card component and CSS as the browser preview.

### Changed

- Updated the export and validation flow so the generated message card stays visually aligned with the browser preview.

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
