import * as highcharts from 'highcharts'

export class BrowserAbstract {

    public async getSVG(chartOptions:ChartOptions[], options:BrowserOptions): Promise<string[]> {
        return []
    }
}


export interface BrowserOptions {
    containerWidth?: string;
    containerHeight?: string;
    JsScriptsPaths: string[];
    viewPortWidth?: number;
    viewPortHeight?: number
   
}

export type ChartOptions  = highcharts.Options;