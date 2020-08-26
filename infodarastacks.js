import puppeteer from "puppeteer"

async function getUpgrade() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://finviz.com/quote.ashx?t=googl');
    const data = await page.evaluate(() => {
        let rows = Array.from(document.querySelectorAll('.table-dark-row')).map(td => td.innerText)

        return rows;
    });

    await browser.close();
    let shtut = []
    data.map((row) => { shtut.push(row.split('\t')) });
    return shtut;
}

export {getUpgrade}
