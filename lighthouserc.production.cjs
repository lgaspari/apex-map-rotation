const { homepage } = require('./package.json');

module.exports = {
  ci: {
    collect: {
      url: [process.env.PRODUCTION_URL || homepage],
      numberOfRuns: 3,
      settings: {
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-extensions',
        ],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-reports-production',
    },
  },
};
