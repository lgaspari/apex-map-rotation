module.exports = {
  ci: {
    collect: {
      // Build with PWA; preview over HTTP so Lighthouse URL matches (see README).
      startServerCommand:
        'VITE_PWA_ENABLED=true vite build && VITE_PWA_ENABLED=false vite preview --port 4173 --strictPort --host 127.0.0.1',
      startServerReadyPattern: 'Local:',
      url: ['http://127.0.0.1:4173/apex-map-rotation/'],
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
      outputDir: './lhci-reports',
    },
  },
};
