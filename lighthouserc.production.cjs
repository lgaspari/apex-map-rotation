module.exports = {
  ci: {
    collect: {
      url: ['https://lgaspari.github.io/apex-map-rotation/'],
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
