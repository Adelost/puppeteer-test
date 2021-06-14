import puppeteer from 'puppeteer';
import to from 'await-to';
import { Page } from "./utils.mjs";

const HEADLESS = false;

// Puppeteer API DOC
// https://devdocs.io/puppeteer/

(async () => main())(); // Run main async

async function main() {
  const browser = await puppeteer.launch({ headless: HEADLESS });

  const [err] = await to(tryBuyPs5(browser));
  if (err) {
    console.error(err.message);
  } else {
    console.log('PS5 is available! What are you waiting for?');
  }
}

async function tryBuyPs5(browser) {
  const page = await new Webhallen().init(browser);

  await page.search('Playstation 5');
  await page.waitNetworkIdle();

  const searchLink = await page.findByText('a', 'Playstation 5 Konsol');
  if (!searchLink) throw Error("No PS5 article found");
  await searchLink.click();

  const fullyBookedButton = await page.findByText('a', 'Tillfälligt fullbokad');
  if (fullyBookedButton) throw Error("PS5 is fully booked");

  // If we reach here PS5 should be available to buy
  // TODO: Buy PS5
}

class Webhallen extends Page {
  async init(browser) {
    await super.init(browser);
    await this.page.goto('https://www.webhallen.com/');
    await this.closeCookiePopup();
    return this;
  }

  async closeCookiePopup() {
    await this.findByText('a', `Okej, jag förstår`, x => x.click());
  }

  async search(text) {
    await this.find(`//input[contains(@placeholder, "Sök")]`, async x => {
      await x.type(text);
      await x.press('Enter');
    });
  }
}


