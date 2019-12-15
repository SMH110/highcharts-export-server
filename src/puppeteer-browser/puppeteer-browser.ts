import {
  BrowserAbstract,
  BrowserOptions,
  ChartOptions
} from "../shared/browser-abstract";
import * as puppeteer from "puppeteer";
import * as serialize from "serialize-javascript";

import { readFileSync } from "fs";

declare var Highcharts;

class PuppeteerBrowser implements BrowserAbstract {
  private browser: puppeteer.Browser;
  public async getSVG(chartOptions: ChartOptions[], options: BrowserOptions) {
    try {
      let page = await this.getPage();
      await page.setViewport({
        width: options.viewPortWidth || 900,
        height: options.viewPortHeight || 1000
      });
      await this.setPageContent(page, chartOptions, options);
      await this.injectJS(page, options.JsScriptsPaths);
      let container = await page.$("#main-container");

      let instances = await page.evaluate(
        this.evaluate,
        container,
        serialize(chartOptions)
      );
      // this.browser.close();
      return instances;
    } catch (error) {
      console.error(error);
      this.browser.close();
    }
  }

  private async getPage() {
    try {
      this.browser = await puppeteer.launch({ headless: false });
      let page = await this.browser.newPage();
      return page;
    } catch (error) {
      console.error(`Error in creating page`, error);
      this.browser && this.browser.close();
    }
  }

  private async setPageContent(
    page: puppeteer.Page,
    charts: any[],
    options: BrowserOptions
  ) {
    try {
      await page.setContent(this.getHTMLContent(charts, options));
    } catch (error) {
      console.error(error);
      this.browser && this.browser.close();
    }
  }

  private getHTMLContent(charts: any[], options: BrowserOptions) {
    let containers = charts.map(
      (_, index) => `<div id="container-${index}"></div>`
    );

    return `<div id="main-container">${containers.join("")}</div>`;
  }

  private async injectJS(page: puppeteer.Page, paths: string[]) {
    try {
      let content = "";
      paths.forEach(path => {
        content += readFileSync(path);
        content += "\n";
      });

      // console.log('content',content);

      await page.addScriptTag({ content });
    } catch (error) {
      console.error(error);
      this.browser && this.browser.close();
    }
  }

  private evaluate(container: HTMLElement, chartOptions: ChartOptions[]) {
    let instances = [];
    var charts = [];

    return new Promise<string[]>(res => {
      setTimeout(() => {
        eval(`var charts  =( ${chartOptions})`);

        charts.forEach((chart, index) => {
          let chartContainer = container.querySelector(`#container-${index}`);
          chart.chart.renderTo = chartContainer as HTMLElement;
          instances.push(new Highcharts.Chart(chart));
        });

        res(instances.map(chartInstance => chartInstance.getSVGForExport()));
        return;
      }, 100);
    });
  }
}

export default PuppeteerBrowser;
