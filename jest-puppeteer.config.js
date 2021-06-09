// jest-puppeteer.config.js

module.exports = {
    launch: {
      headless: true,
      slowMo: 500,
      args: ["--no-sandbox", "disable-setuid-sandbox"]
    }
  }
