
 export interface BrowserOptions {
    pageWidth?: number;
    pageHeight?: number;
    debug?: boolean;
  }

 export interface ExportOptions {
    JsScriptsPaths: string[];
  }
export interface ChartConvertWorkerDataMessage {
    browserOptions: BrowserOptions,
    exportOptions : ExportOptions
    charts : string
}