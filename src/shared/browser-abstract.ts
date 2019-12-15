import * as highcharts from "highcharts";

export class BrowserAbstract {
  public async getSVG(chartOptions: ChartOptions[], options: ExportOptions): Promise<string[]> {
    return [];
  }

  public close(): void {}
}

export interface ExportOptions {
  JsScriptsPaths: string[];
}

export type ChartOptions = highcharts.Options;
