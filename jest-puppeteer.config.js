// jest-puppeteer.config.js

module.exports = {
    launch: {
      headless: true,
      slowMo: 100,
      args: ["--no-sandbox", "disable-setuid-sandbox"]
    },

  }
