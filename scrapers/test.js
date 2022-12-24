import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();
await page.goto("https://shop.aldi.us/store/aldi/storefront/?current_zip_code=10035");
await page.waitForSelector('span[class*="AddressButton"]');
await page.goto(`https://shop.aldi.us/store/aldi/search/egg`, {
  waitUntil: "domcontentloaded",
});
await page.waitForSelector('div[aria-controls="expanded-search-results"]');
await page.waitForSelector('li img[srcset]');
const results = await page.evaluate(() => {
  const results = [];
  const name = document.querySelectorAll("li h2");
  const price = document.querySelectorAll(
    'span[aria-label*="Original price:"]'
  );
  const img = document.querySelectorAll("li img[srcset]");
  //finds a maximum of 3 of each item
  const totalIters = name.length > 3 ? 3 : name.length;
  for (let i = 0; i < totalIters; i++) {

    results.push({
      name: (name[i]).innerText,
      price: (price[i]).innerText.slice(1),
      imgUrl: (img[i]).srcset.split(", ")[0],
    });
  }

  return results;
});

console.log(results)