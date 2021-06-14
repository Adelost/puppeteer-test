export class Page {
  async init(browser) {
    this.page = await browser.newPage();
    return this;
  }

  /** Finds element by text and applies onFound-callback if given */
  async findByText(tagName, containsText, onFound = null) {
    return this.find(`//${tagName}[contains(.,"${containsText}")]`, onFound);
  }

  /** Finds element by XPath and applies onFound-callback if given */
  async find(xpath, onFound = null) {
    // Find by XPath, same as typing this in browser:
    // document.evaluate(xpath, document).iterateNext()
    const [element] = await this.page.$x(xpath);
    // Applies onFound-callback if given
    if (onFound && element) await onFound(element);
    return element;
  }

  async waitNetworkIdle() {
    await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
  }
}
