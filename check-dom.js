const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 3000));
  
  const cd = await page.$eval('.z-40.rounded-full', el => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height,
      transform: style.transform, opacity: style.opacity
    };
  }).catch(e => ({ error: e.message }));
  
  console.log('CD Info:', cd);
  
  await browser.close();
})();
