import * as highcharts from "highcharts";
import { ExportOptions } from "../data";

export abstract class BrowserAbstract {
  public async getSVG(chartOptions: ChartOptions[], options: ExportOptions): Promise<string[]> {
    return [];
  }

  public close(): void {}
}



export type ChartOptions = highcharts.Options;
