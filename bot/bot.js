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
        targetPage.keyboard.press("Escape");
    }
    {
        const targetPage = page;
        let word = "torci";
        await targetPage.keyboard.type("torci");
        await targetPage.keyboard.press("Enter");
        await targetPage.waitForTimeout(2000);
        for (let index = 0; index < 5; index++) {
          const guess = await page.evaluate((index) => {
            //Versão pré 20/02
            //const row = Array.from(document.querySelectorAll(".row")[index].querySelectorAll('div'));
            
            //Versão pós 20/02
            const row = Array.from(document.querySelector('wc-board').shadowRoot.children[1].children[index].shadowRoot.children);
            row.shift();
            
            return  row.map(x=> {
              if (x.className==='letter wrong') return 0;
              else if(x.className==='letter place') return 1
              else return x.className==='letter empty' ? null : 2;
            });
          },index);
          if(guess[0]===null){
            //Palavra fora do dicionario
            index--;
            for(let i=0;i<5;i++) targetPage.keyboard.press("Backspace");
          } 
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
      const element = await helper.waitForSelectors([["aria/compartilhe"],["#stats","#stats_share"]], page, timeout);
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
