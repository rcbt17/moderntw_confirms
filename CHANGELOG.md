# Changelog

## [1.1.1] - 2025-01-04

### Changed
- **BREAKING (but backwards compatible)**: Refactored configuration to use accessor methods instead of hash keys
  - Old syntax: `config[:backdrop_class] = "..."`
  - New syntax: `config.backdrop_class = "..."`
  - The old hash-based syntax is still supported via the `config` alias for backwards compatibility
- Removed dependency on ActiveSupport's `mattr_accessor`

## [1.1.0] - 2024-05-xx
    - Default to native confirms on mobile with optional opt-in via config[:enable_on_mobile]

### Added
- Default to native browser confirms on mobile devices with the option to re-enable Tailwind modals via `config[:enable_on_mobile]`

## [0.1.0] - 2025-10-21

### Added
- Initial release
- Automatic interception of Rails `data-confirm` attributes
- Support for Turbo `data-turbo-confirm` attributes
- Beautiful Tailwind CSS modal design
- Smooth fade and scale animations
- Keyboard navigation support (ESC to cancel, Enter to confirm)
- Rails generator for easy installation
- Support for importmap, Webpacker, and Asset Pipeline
- Optional Stimulus controller for advanced customization
- Configurable Tailwind classes via initializer
- Dynamic content support (works with AJAX/Turbo loaded content)
- Focus management for accessibility
