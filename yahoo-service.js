import puppeteer from "puppeteer"


const firstPostSelector = "#canvass-0-CanvassApplet > div > ul > li:nth-child(1)"

async function yahoo() {
    let browser = await puppeteer.launch({
        // headless: false,
        // args: ['--proxy-server=socks5://127.0.0.1:9050'],
        // args: [`--proxy-server=socks5://${chooseProxy()}`],
    });
    let page = await browser.newPage();
    await page.goto("https://finance.yahoo.com/quote/NFLX/community?p=NFLX");
    await page.waitForSelector(firstPostSelector);
    let content = await page.evaluate(() => Array.from(document.querySelectorAll('#canvass-0-CanvassApplet > div > ul > li'), element => {
        let time = element.querySelector("div > div.Fz\\(12px\\).Mend\\(20px\\).Mb\\(5px\\) > span > span");
        let message = element.querySelector("div > div:nth-child(2) > div");
        let username = element.querySelector("div > div > button");
        return {
            message: message && message.innerText,
            time: time && time.innerText,
            username: username && username.innerText,
            avatarUrl: element.querySelector("div > div > div > div > img").src,
            sentiment: null
        }
    }));
    // let fucking = await page.evaluate(() => Array.from(document.querySelectorAll('#canvass-0-CanvassApplet > div > ul > li:nth-child(7) > div > div.Fz\\(12px\\).Mend\\(20px\\).Mb\\(5px\\) > span > span'), element => element.textContent));
    return content
}
//
// main();

export {yahoo}