import { BrowserAbstract, ChartOptions } from "../shared/browser-abstract";
import { BrowserBase } from "../shared/browser-base";
import * as puppeteer from "puppeteer";
import * as serialize from "serialize-javascript";

import { readFileSync } from "fs";
import { ExportOptions, BrowserOptions } from "../data";

declare var Highcharts;

class PuppeteerBrowser extends BrowserBase implements BrowserAbstract {
  constructor(private _options: BrowserOptions) {
    super(_options);
  }
  private browser: puppeteer.Browser;

  public async getSVG(chartOptions: ChartOptions[], options: ExportOptions) {
    try {
      let page = await this.getPage();
      await this.setPageSize(page);
      await this.setPageContent(page, chartOptions);
      await this.injectJS(page, options.JsScriptsPaths);

      let container = await page.$("#main-container");
      let instances = (await page.evaluate(this.evaluate, container, serialize(chartOptions))) as string[];

      if (this.debug == false) {
        this.close();
      }
      return instances;
    } catch (error) {
      // console.error("Error in puppeteer", error);
      !this.debug && this.close();
    }
  }

  public close() {
    this.browser && this.browser.close();
  }

  private async getPage() {
    try {
      this.browser = await puppeteer.launch({ headless: !this.debug });
      let page = await this.browser.newPage();
      return page;
    } catch (error) {
      console.error(`Error in creating page`, error);
      !this.debug && this.close();
    }
  }

  private async setPageSize(page: puppeteer.Page) {
    await page.setViewport({ height: this.pageHeight, width: this.pageHeight });
  }

  private async setPageContent(page: puppeteer.Page, charts: any[]) {
    try {
      await page.setContent(this.getHTMLContent(charts));
    } catch (error) {
      console.error(error);
      !this.debug && this.close();
    }
  }

  private getHTMLContent(charts: any[]) {
    let containers = charts.map((_, index) => `<div id="container-${index}"></div>`);

    return `<div id="main-container">${containers.join("")}</div>`;
  }

  private async injectJS(page: puppeteer.Page, paths: string[]) {
    try {
      let content = "";
      paths.forEach(path => {
        content += readFileSync(path);
        content += "\n";
      });

      await page.addScriptTag({ content });
    } catch (error) {
      console.error(error);
      !this.debug && this.close();
    }
  }

  private evaluate(container: HTMLElement, chartOptions: string) {
    let instances = [];

    return new Promise<string[]>((res, rej) => {
      // loose parse
      let charts = Function('"use strict";return (' + chartOptions + ")")() as ChartOptions[];
      charts.forEach((chart, index) => {
        let chartContainer = container.querySelector(`#container-${index}`);
        try {
          // chart.chart = chart.chart || {};
          chart.chart.renderTo = chartContainer as HTMLElement;

          instances.push(new Highcharts.Chart(chart));
        } catch (error) {
          rej(error);
        }
      });

      res(instances.map(chartInstance => chartInstance.getSVGForExport()));
      return;
    });
  }
}
export default PuppeteerBrowser;
