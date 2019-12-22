import PuppeteerBrowser from "../puppeteer-browser/puppeteer-browser";
import { ChartConvertWorkerDataMessage } from "../data";

console.log("puppeteer worker");

process.on("message", async (data: string) => {
  let output = await main(data);
  process.send(output);
});

process.on("disconnect", () => {
  process.kill(0);
});

async function main(data: string) {
  let parsed: ChartConvertWorkerDataMessage = JSON.parse(data);
  let { charts, browserOptions, exportOptions } = parsed;
  let parsedCharts = Function('"use strict";return (' + charts + ")")();
  let browser = new PuppeteerBrowser(browserOptions);
  try {
    let svg = await browser.getSVG(parsedCharts, exportOptions);
    return svg;
  } catch (error) {}
}
