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

### Clone repository

First off, clone the repository from GitHub:

```bash
# HTTPS
git clone https://github.com/lgaspari/apex-map-rotation.git && cd apex-map-rotation

# SSH
git clone git@github.com:lgaspari/apex-map-rotation.git && cd apex-map-rotation
```

### Install packages

Then, use `npm` to install the dependencies:

```bash
npm install
```

### Configure environment variables

Make a copy of the `.env` file into `.env.local`. Fill empty environment variables with their proper value as the following:

- `VITE_APEX_LEGENDS_API_SECRET_TOKEN`: [Unofficial Apex Legends API](https://apexlegendsapi.com/) secret token for authentication

### Start application in Development mode

Now, for the most part, you will be using this command to run the application:

```bash
npm run start
```

### Start application in Production mode

Otherwise, if you would like to run the application using production code, use this instead:

```bash
npm run start:production
```

### Linting & Code Formatting

We use [ESLint](https://eslint.org/) for finding and fixing problems in our code. Check your local code by running the following command:

```bash
npm run lint
```

In addition, you may install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions for Visual Studio Code to help you detect errors and correct code format.

### Tests

We use [Jest](https://jestjs.io/) as the testing framework for our application. Check your local tests by running the following command:

```bash
npm run test
```

In addition, you may install [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) extension for Visual Studio Code to run tests quickly.

### Continuous Integration

A continuous integration workflow runs on every push to the `main` branch. When your changes do not pass the `Lint` and `Test` steps, then the workflow fails. Please, make sure to correct those issues in a separate commit.

### Deployments

Currently, there is no continuous deployment configured; you will have to run this command manually:

```bash
npm run deploy
```

> Please, refrain from deploying into production without notice.

## Progressive Web Application

> This is an experimental feature and it might be disabled at any time.

We use [Vite](https://vitejs.dev/) to run and build the application. Therefore, for setting up the Progressive Web Application, we use the [Vite PWA](https://vite-pwa-org.netlify.app/) plugin, which makes the configuration seamlessly.

### PWA Assets generation

For generating the minimal PWA assets needed, we use [Vite PWA Assets Generator](https://vite-pwa-org.netlify.app/assets-generator/). The command below will generate the assets based on the file `public/logo.svg` using the configuration from [pwa-assets.config.ts](pwa-assets.config.ts). Make sure it's been updated before running it:

```bash
npm run generate-pwa-assets
```

### PWA Troubleshooting

#### Installation

If you're having issues with the PWA installation, you can use Lighthouse from
the Dev Tools in order to check what's missing for it to work.

These are the steps for Chromium based browsers:

1. Open Dev Tools
2. Go to Lighthouse tab
3. Check Progressive Web App category
4. Press Analyze page load button
5. Review results

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
