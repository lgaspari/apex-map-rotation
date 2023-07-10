# Apex Legends - Map Rotation

**UNOFFICIAL** [Apex Legends](https://www.ea.com/games/apex-legends) Map Rotation application that allows users to see the current and next maps in addition to subscribing to map change notifications.

## Motivation

Even though [Apex Legends Status](https://apexlegendsstatus.com/) is a kick-ass website along its [map rotation](https://apexlegendsstatus.com/current-map/) feature, it lacks notifications. Therefore, you would have to check manually every time you need to know which is the current map.

Apex Legends Map Rotation was born from an effort to be able to know what map is coming up so you don't have to check by yourself ever again.

## Features

- Map rotation
- Foreground notifications — _background notifications are on the way!_
- Customizable maps notifications - _threshold configuration on the way!_

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

- `VITE_APEX_LEGENDS_API_SECRET_TOKEN`: Unofficial Apex Legends API secret token for authentication

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

## Credits

- Thanks to [EA](https://www.ea.com/) and the [Respawn](https://www.respawn.com/) team for having developed the Apex Legends.
- Thanks to the team behind the [Unofficial Apex Legends Status API](https://apexlegendsapi.com/) for creating such a great API.
- Thanks to the [Apex Legends Status](https://apexlegendsstatus.com/) website for their map assets.

## Disclaimer

All images, icons, and trademarks belong to their respective owner. Apex Legends is a registered trademark of EA. Game assets, materials, and icons belong to Electronic Arts. Be aware that EA and Respawn do not endorse the content of this website or are responsible for this website's content.
