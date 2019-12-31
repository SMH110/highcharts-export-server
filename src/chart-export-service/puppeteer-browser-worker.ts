import PuppeteerBrowser from "../puppeteer-browser/puppeteer-browser";
import { ChartConvertWorkerDataMessage } from "../data";

console.log("puppeteer worker");

let browser;
process.on("message", async (data: string) => {
  try {
    if (browser && data == "terminate") {
      browser.close();
      process.send("");
      return;
    }
    let output = await main(data);
    browser = null;
    process.send(output);
  } catch (error) {
    process.send({ error: error });
  }
});

process.on("disconnect", () => {
  process.kill(0);
});

async function main(data: string) {
  let parsed: ChartConvertWorkerDataMessage = JSON.parse(data);
  let { charts, browserOptions, exportOptions } = parsed;
  let parsedCharts = Function('"use strict";return (' + charts + ")")();
  browser = new PuppeteerBrowser(browserOptions);
  return browser.getSVG(parsedCharts, exportOptions);
}
