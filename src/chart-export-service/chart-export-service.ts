import { ChartOptions, chart } from "highcharts";
import { cpus } from "os";

abstract class ChartExportServiceAbstract {
  public async getSVG(charts: string | ChartOptions[], options: getSVGOptions) {}
}

export class ChartExportService implements ChartExportServiceAbstract {
  private isSecure = false;
  constructor(private options: ChartExportServiceOptions) {
    this.isSecure = this.options.secure;
  }

  public async getSVG(charts, options) {
    let validateCharts = this.getValidatedCharts(charts);
    let pages = this.paginateCharts(validateCharts);
    

  }

  private getValidatedCharts(charts: ChartOptions[] | string) {
    let results: ChartOptions[];

    try {
      if (this.isSecure) {
        results = this.getSecuredCharts(charts);
      } else {
        results = this.getInSecuredCharts(charts);
      }
    } catch (error) {
      console.error(error);
      results = [];
    }

    return results;
  }

  private getSecuredCharts(charts: ChartOptions[] | string): ChartOptions[] {
    let results: ChartOptions[];

    if (typeof charts == "string") {
      let temp = JSON.parse(charts);
      results = Array.isArray(temp) ? temp : [temp];
    } else {
      results = JSON.parse(JSON.stringify(charts));
    }
    return results;
  }

  private getInSecuredCharts(charts: ChartOptions[] | string): ChartOptions[] {
    if (typeof charts === "string") {
      let temp = Function('"use strict";return (' + charts + ")")();
      let results = Array.isArray(temp) ? temp : [temp];
      return results;
    }

    return charts;
  }

  private paginateCharts(charts: any[]) {
    let cpusLength = cpus().length;
    let chartsLength = charts.length;

    let chartPerCpu = Math.ceil(chartsLength / cpusLength);

    let pages = [];
    for (let i = 0; i < chartPerCpu; i++) {
      pages.push(charts.slice(i, i * chartPerCpu));
    }

    return pages;
  }
}

export interface ChartExportServiceOptions {
  secure: boolean; // get rid of chart options function i.e. formatters ?
}

export interface getSVGOptions {
  pathToWorker: string;
}
