/**
 * Playwright script configured for offline Windows environments
 * Uses locally installed Google Chrome application with channel: 'chrome' and headless: false
 */
let chromium;
try {
  chromium = require('playwright').chromium;
} catch {
  try {
    chromium = require('@playwright/test').chromium;
  } catch {
    // If Playwright package is not installed, fallback to Puppeteer with local Chrome
    const puppeteer = require('puppeteer');
    (async () => {
      const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        channel: 'chrome',
        headless: false,
        defaultViewport: null
      });
      const page = await browser.newPage();
      await page.goto('http://localhost:3000');
      console.log('Navigated to http://localhost:3000 in local Google Chrome.');
    })();
  }
}

if (chromium) {
  (async () => {
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: false
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    console.log('Navigated to http://localhost:3000 in local Google Chrome via Playwright.');
  })();
}
