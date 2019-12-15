import * as highcharts from 'highcharts'

export class BrowserAbstract {

    public async getSVG(chartOptions:ChartOptions[], options:BrowserOptions): Promise<string[]> {
        return []
    }
}


export interface BrowserOptions {
    JsScriptsPaths: string[];
    viewPortWidth?: number;
    viewPortHeight?: number;
    isDebug?: boolean
   
}

export type ChartOptions  = highcharts.Options;