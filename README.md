# Apex Legends - Map Rotation

Progressive Web Application (PWA) that allows users to subscribe to map change notifications.

## Contributing

Welcome and thank you for contributing into Apex Legends - Map Rotation!

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

### Start application in Development mode

Now, most of the time you'll be using this command to start the application:

```bash
npm run start
```

### Start application in Production mode

Otherwise, if you're working with the Progressive Web Application or Service Workers, it won't work in development mode and you will need to run this command instead:

```bash
npm run start:production
```

## Linting & Code Formatting

TODO

## Tests

TODO

## Progressive Web Application

> This is an experimental feature and it might be disabled at any time.

We use [Vite](https://vitejs.dev/) to run and build the application. Therefore, for setting up the Progressive Web Application, we use the [Vite PWA](https://vite-pwa-org.netlify.app/) plugin, which makes it easier to configure.

### Generate assets

Further, for generating the minimal PWA assets needed, we use [Vite PWA Assets Generator](https://vite-pwa-org.netlify.app/assets-generator/). The command below will generate the assets based on the file `public/logo.svg`. Make sure it's been updated before running it:

```bash
npm run generate-pwa-assets
```

There are two alternatives for generating assets:
- https://realfavicongenerator.net/
- https://maskable.app/editor

> Unless requested, we shall only update the assets we have without adding new ones.

### Troubleshooting

#### Installation

In order to install the PWA is necessary to run the application in an HTTPS environment. The application has been configured already to do so.

However, if you're still facing issues, you can use Lighthouse from the Dev Tools in order to check what's missing for it to work. These are the steps for Chromium based browsers:

1. Open Dev Tools
2. Go to Lighthouse tab
3. Check Progressive Web App category
4. Press Analyze page load button
5. Review results

#### Update service worker

For development, you can turn on an option from Dev Tools to update service workers on reload:

1. Open Dev Tools
2. Go to Application tab
3. Check Update on reload option
4. Refresh the tab

If you're still facing issues you can update the service worker yourself by pressing the Update button.

#### Update assets

This is a known issue, please [see below](#updating-pwa-assets).

## Known issues

### Updating PWA assets

When updating PWA assets, you might not be able to see the new assets loaded. If that's the case, please me sure to re-install the application.
