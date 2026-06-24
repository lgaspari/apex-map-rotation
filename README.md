# Apex Legends - Map Rotation

**UNOFFICIAL** [Apex Legends](https://www.ea.com/games/apex-legends) Map Rotation application that allows users to see the current and next maps in addition to subscribing to map change notifications.

## Motivation

Even though [Apex Legends Status](https://apexlegendsstatus.com/) is a kick-ass website along its [map rotation](https://apexlegendsstatus.com/current-map/) feature, it lacks notifications. Therefore, you would have to check manually every time you need to know which is the current map.

Apex Legends Map Rotation was born from an effort to be able to know what map is coming up so you don't have to check by yourself ever again.

## Features

- Real-time map rotation
- Foreground notifications — _background notifications are on the way!_
  - Customizable maps
  - Customizable threshold
- Installable application (see [support](#progressive-web-application-https-required-except-localhost))

## Contribute

Welcome, and thank you for contributing to Apex Legends - Map Rotation!

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit message conventions.

### Clone repository

First off, clone the repository from GitHub:

```bash
# HTTPS
git clone https://github.com/lgaspari/apex-map-rotation.git && cd apex-map-rotation

# SSH
git clone git@github.com:lgaspari/apex-map-rotation.git && cd apex-map-rotation
```

### Install packages

Then, use `pnpm` to install the dependencies (requires [Node.js](https://nodejs.org/) 24+, pinned to the version in [`.nvmrc`](.nvmrc)):

```bash
corepack enable
pnpm install
pnpm exec playwright install chromium
```

### Configure environment variables

Make a copy of the `.env` file into `.env.local`. Fill empty environment variables with their proper value as the following:

- `VITE_APEX_LEGENDS_API_SECRET_TOKEN`: [Unofficial Apex Legends API](https://apexlegendsapi.com/) secret token for authentication

### Start application in Development mode

Now, for the most part, you will be using this command to run the application:

```bash
pnpm run start
```

### Start application in Production mode

Otherwise, if you would like to run the application using production code, use this instead:

```bash
pnpm run start:production
```

To run the production build with PWA enabled (service worker and manifest):

```bash
pnpm run start:production:pwa
```

This sets `VITE_PWA_ENABLED=true` for both build and preview, so behavior does not depend on `.env.local`. Preview is served over HTTPS (self-signed cert in `certs/`) for service worker testing—unlike `pnpm lighthouse`, which intentionally uses HTTP on preview for a stable audit URL.

### Regenerate local HTTPS certificate

The `certs/` directory holds a development certificate generated with [mkcert](https://github.com/FiloSottile/mkcert). It is used when PWA is enabled (`pnpm run start` with `VITE_PWA_ENABLED=true` in `.env.local`, or `pnpm run start:production:pwa`). Certificates expire after a few years and must be regenerated on your machine.

Install [mkcert](https://github.com/FiloSottile/mkcert) and trust the local CA once:

```bash
brew install mkcert
mkcert -install
```

Then regenerate `cert.pem` and `key.pem`:

```bash
cd certs
mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1 ::1 $(ipconfig getifaddr en0)
```

Include your current LAN IP when testing on another device over the network (replace `en0` with the correct interface if needed). Restart the dev or preview server after regenerating.

### Quality metrics

We use [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) for performance, accessibility, best practices, and SEO audits.

**Local preview** (same as PR CI — config: [`lighthouserc.dev.cjs`](lighthouserc.dev.cjs)):

```bash
pnpm lighthouse
# or audit + terminal summary:
pnpm lighthouse:report
```

Reports are written to `lhci-reports/`.

**Production** (live GitHub Pages URL — config: [`lighthouserc.production.cjs`](lighthouserc.production.cjs)):

```bash
pnpm lighthouse:production
# or audit + terminal summary:
pnpm lighthouse:report:production
```

Reports are written to `lhci-reports-production/`. Requires network access.

Both checks are **advisory** in CI—they do not block merges. Scores appear in the GitHub Actions job summary; download workflow artifacts for full HTML reports.

| Workflow | Trigger | Job | Artifact |
|----------|---------|-----|----------|
| CI | PR / push to `main` | `Lighthouse` | `lighthouse-reports` |
| Lighthouse (production) | After GitHub Pages deploy to `gh-pages`; manual | `Lighthouse (production)` | `lighthouse-production-reports` |

Notes:

- Lab scores differ from real-user Web Vitals on GitHub Pages.
- If the Apex Legends API is unavailable during a preview run, Lighthouse audits the error state instead of the map view.
- Lighthouse 12 no longer scores PWA; use `pnpm test:pwa` for runtime PWA checks.
- Use the first few runs to establish a baseline before setting score thresholds.

Static accessibility rules are also enforced via [`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) in the lint step.

Locally, any Chromium-based browser works (Chrome, Brave, Edge). LHCI auto-detects Chrome/Chromium; for others, set `CHROME_PATH` to the browser executable:

```bash
CHROME_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" pnpm lighthouse
CHROME_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" pnpm lighthouse:production
```

`pnpm lighthouse` builds with PWA enabled, then previews over HTTP (`VITE_PWA_ENABLED=false`) on `127.0.0.1` for a stable audit URL. CI installs Google Chrome automatically.

### Linting & Code Formatting

We use [ESLint](https://eslint.org/) for finding and fixing problems in our code. Check your local code by running the following command:

```bash
pnpm run lint
```

In addition, you may install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions for Visual Studio Code to help you detect errors and correct code format.

### Tests

We use [Vitest](https://vitest.dev/) as the testing framework. Tests run in three suites: unit tests in Node, component tests in a headless browser (Playwright), and PWA end-to-end tests (Playwright Test).

Run all tests:

```bash
pnpm run test
```

Run suites individually or in watch mode:

```bash
pnpm run test:unit              # Node unit tests
pnpm run test:browser           # Browser component tests
pnpm run test:pwa               # PWA E2E (manifest + service worker)
pnpm run test:unit:watch        # Unit tests in watch mode
pnpm run test:browser:watch     # Browser tests in watch mode
```

`pnpm run test:pwa` builds with PWA enabled, previews over HTTP on `127.0.0.1`, and checks manifest validity and service worker registration. For manual HTTPS PWA smoke testing, use `pnpm run start:production:pwa` instead.

Generate a coverage report:

```bash
pnpm run test:coverage
```

In addition, you may install the [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) extension for Visual Studio Code to run tests quickly.

### Continuous Integration

A continuous integration workflow runs on every push to the `main` branch and on pull requests. When your changes do not pass the `Lint`, `Test`, `Build`, or `Build and test (PWA)` steps, the workflow fails. Please make sure to correct those issues in a separate commit.

The `Lighthouse` job runs `pnpm lighthouse` (local preview audit). It is advisory and does not block merges.

The [Lighthouse (production) workflow](.github/workflows/lighthouse-production.yml) runs after GitHub's `pages-build-deployment` workflow completes on `gh-pages` (following a [CD](.github/workflows/cd.yml) tag deploy) and audits the live GitHub Pages URL. It is also advisory. Re-run manually from Actions → Lighthouse (production) → Run workflow.

### Deployments

Production deployments to GitHub Pages are triggered automatically when you push a version tag (for example, `v0.12.0`):

```bash
git tag v0.12.0
git push origin v0.12.0
```

The [CD workflow](.github/workflows/cd.yml) builds the application and publishes the `dist` folder to the `gh-pages` branch.

> Please refrain from deploying to production without notice.

## Progressive Web Application

> This is an experimental feature and it might be disabled at any time.

We use [Vite](https://vitejs.dev/) to run and build the application. Therefore, for setting up the Progressive Web Application, we use the [Vite PWA](https://vite-pwa-org.netlify.app/) plugin, which makes the configuration seamlessly.

### PWA Assets generation

For generating the minimal PWA assets needed, we use [Vite PWA Assets Generator](https://vite-pwa-org.netlify.app/assets-generator/). The command below will generate the assets based on the file `public/logo.svg` using the configuration from [pwa-assets.config.ts](pwa-assets.config.ts). Make sure it's been updated before running it:

```bash
pnpm run generate-pwa-assets
```

### PWA Troubleshooting

#### Installation

Run PWA E2E checks and inspect the production build locally:

```bash
pnpm test:pwa
pnpm start:production:pwa
```

Use Chrome DevTools → Application (Manifest, Service Workers) to debug installability. Lighthouse 12 no longer includes a PWA score category.

#### Update service worker

The application should prompt if there's any update to the Service Worker.
However, to make things easier, you can turn on an option from Dev Tools to
update the service workers on reload:

1. Open Dev Tools
2. Go to Application tab
3. Check Update on reload option
4. Reload the tab using `CTRL+SHIFT+R`

If you're still facing issues you can update the service worker yourself by pressing the Update button.

#### Update assets

When updating PWA assets, you might not be able to see the new assets loaded. If that's the case, please make sure to re-install the application.

## Cross-browser Compatibility (HTTPS)

### Notifications

We use the Notification interface of the Notifications API to configure and display desktop notifications to the user. You can read more about the Notifications API in [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/notification).

#### Notification API

> Checking API support through `'Notification' in window`.

| Platform  | Brave   | Chrome  | Edge    | Firefox | Safari  | Observations |
| :-        | :-      | :-      | :-      | :-      | :-      | :-           |
| macOS     | Yes     | Yes     | Yes     | Yes     | Yes     | - -          |
| iOS       | No      | No      | No      | No      | Yes ¹   | **¹** experimental feature must be enabled. |
| Android   | Yes     | Yes     | Yes     | Yes     | N/A     | - -          |

#### Prompt Notification Permission

> Asking for Notification Permissions through `Notification.requestPermission()` using `Promises`.

| Platform  | Brave   | Chrome  | Edge    | Firefox | Safari  | Observations |
| :-        | :-      | :-      | :-      | :-      | :-      | :-           |
| macOS     | Yes ¹   | Yes ¹   | Yes ¹   | Yes     | Yes     | **¹** may require additional manual steps to grant permission. |
| iOS       | N/A     | N/A     | N/A     | N/A     | Yes ¹   | **¹** PWA support only. |
| Android   | Yes     | Yes     | Yes ¹   | Yes ²   | N/A     | **¹** may require additional manual steps to grant permission. <br />**²** may display non-secure page due to self-signed certificate. |

#### Send Notifications

> Creating a new Notification instance using `new Notification(title, options);`

| Platform  | Brave   | Chrome  | Edge    | Firefox | Safari  | Observations |
| :-        | :-      | :-      | :-      | :-      | :-      | :-           |
| macOS     | Yes     | Yes     | Yes     | Yes     | Yes     | - -          |
| iOS       | N/A     | N/A     | N/A     | N/A     | No ¹    | **¹** not even from PWA. |
| Android   | No      | No      | No      | Yes     | N/A     | - -          |

### Service Workers (HTTPS required, except localhost)

Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). You can read more about the Service Worker API in [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

| Platform  | Brave   | Chrome  | Edge    | Firefox | Safari  | Observations |
| :-        | :-      | :-      | :-      | :-      | :-      | :-           |
| macOS     | Yes     | Yes     | Yes     | Yes     | Yes     | - -          |
| iOS       | Yes     | Yes     | Yes     | Yes     | Yes     | - -          |
| Android   | Yes     | Yes     | Yes     | Yes     | N/A     | - -          |

### Progressive Web Application (HTTPS required, except localhost)

A progressive web app (PWA) is an app that's built using web platform technologies, but that provides a user experience like that of a platform-specific app. You can read more about Progressive Web Apps in [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).

| Platform  | Brave   | Chrome  | Edge    | Firefox | Safari  | Observations |
| :-        | :-      | :-      | :-      | :-      | :-      | :-           |
| macOS     | Yes ¹   | Yes ¹   | Yes ¹   | No      | No      | **¹** can be installed from `Install PWA` button at right of address bar or `Options > Install app` button. |
| iOS       | No      | No      | No      | No      | Yes ¹   | **¹** can be installed from `Share > Add to Home Screen` button. |
| Android   | Yes ¹   | Yes ¹   | Yes ¹   | Yes ²   | N/A     | **¹** can be installed from `Add to Home Screen` popup or `Options > Install app` button. <br />**²** can be installed from `Options > Add to Home screen` button. |

## Credits

- Thanks to [EA](https://www.ea.com/) and the [Respawn](https://www.respawn.com/) team for having developed the Apex Legends.
- Thanks to the team behind the [Unofficial Apex Legends Status API](https://apexlegendsapi.com/) for creating such a great API.
- Thanks to the [Apex Legends Status](https://apexlegendsstatus.com/) website for their map assets.

## Disclaimer

All images, icons, and trademarks belong to their respective owner. Apex Legends is a registered trademark of EA. Game assets, materials, and icons belong to Electronic Arts. Be aware that EA and Respawn do not endorse the content of this website or are responsible for this website's content.
