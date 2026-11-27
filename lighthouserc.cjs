module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'npm run preview -- --host 127.0.0.1 --port 4185 --strictPort',
      startServerReadyPattern: 'Local:',
      url: [
        'http://127.0.0.1:4185/',
        'http://127.0.0.1:4185/academia',
        'http://127.0.0.1:4185/misturar-tintas',
      ],
      numberOfRuns: 1,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'seo'],
        chromeFlags: '--headless --no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'lighthouse-reports' },
  },
};
