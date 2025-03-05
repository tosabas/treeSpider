# Changelog

## 1.0.2 (2025-03-05)

- Updated: The README.md, and added screenshots and the link to demo and documentation

## 1.0.1 (2024-11-03)

- Fix: hSpider tree type css style issue

## 1.0.0 (2024-11-02)

- Fix: customElement bug on mobile browsers
- Fix: bugs on mobile browsers that caused so many parts of the codebase to be reimplemented
- Added: dropshadow option for the default and landscape chart heads

## 0.0.2 (2024-10-26)

- Fix: Typescript not resolving module error, and typos in the README doc.

## 0.0.1 (2024-10-26)

- Fix: Bloated bundle size because of bundled faker-js, now bundle size reduced from 15mb to 5.1mb
- Fix: TypeScript not properly configured
- Changed: Loading of d3 through the script tag to import and packaged with the library, and also faker-js changed from `allFakers` to `faker`.
- Removed: `random_data_locale` parameter has been removed until later, because of the change from using `allFakers` to `faker`
