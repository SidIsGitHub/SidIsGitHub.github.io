const puppeteer = require('puppeteer');

(async () => {
  // Launch using locally installed Google Chrome application
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    channel: 'chrome',
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000');
  console.log('Navigated to http://localhost:3000');

  // Keep browser open to allow interactive inspection
  console.log('Local Chrome browser is open on http://localhost:3000');
})();
