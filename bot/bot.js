const puppeteer = require('puppeteer');
const solver = require('./solver');
const twirerBot = require('./tweet');
const helper = require('./puppeteerHelpers');
const date = require('date-and-time');
const fs = require('fs')
const now  =  new Date();

(async () => {
    const browser = await puppeteer.launch({ 
      headless: true,
    });
    
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://term.ooo/');
        await Promise.all(promises);
        const element = await helper.waitForSelectors([["#helpclose"]], targetPage, timeout);
        await element.click({ offset: { x: 8.390625, y: 26.65625} });
    }
    {
        const targetPage = page;
        let word = "torci";
        await targetPage.keyboard.type("torci");
        await targetPage.keyboard.press("Enter");
        await targetPage.waitForTimeout(2000);
        for (let index = 0; index < 5; index++) {
          const guess = await page.evaluate((index) => {
            const row = Array.from(document.querySelectorAll(".row")[index].querySelectorAll('div'));
            return  row.map(x=> {
              if (x.className==='letter wrong') return 0;
              else return x.className==='letter place'? 1:2;
            });
          },index);
          word = solver.nextWord(guess, word);
          if (word===null) break;
          await targetPage.keyboard.type(word);
          await targetPage.keyboard.press("Enter");
          await targetPage.waitForTimeout(2000);
        }
    }
    {
        const targetPage = page;
        await targetPage.keyboard.press("Enter");
        await targetPage.screenshot({path: __dirname+'/screenshots/'+date.format(now,'DDMMYYYY')+'.png'});
        await targetPage.waitForTimeout(2000);
    }

    {
      const element = await helper.waitForSelectors([["#stats_share"]], page, timeout);
      await element.click();
      await page.waitForTimeout(5000);
    }

    const stats = await page.evaluate(() => window._shared);
    console.log(stats);
    //TWEET
    twirerBot.tweet(stats);
    //UPDATE README
    fs.appendFileSync(__dirname+'/../README.md', '\n## '+date.format(now,'DD/MM/YYYY')+'\n![image](bot/screenshots/'+date.format(now,'DDMMYYYY')+'.png)');
    const { execSync } = require('child_process');
    execSync('cd '+__dirname+ ' && git add ../README.md && git add ./screenshots/* && git commit -m "Update Progress" && git push');
    await browser.close();
})();
