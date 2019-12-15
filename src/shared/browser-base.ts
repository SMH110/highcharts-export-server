import { defaultPageWidth, defaultPageHeight } from "../settings";

export class BrowserBase {
  protected pageWidth;
  protected pageHeight;
  protected debug;

  constructor(private options: Options) {
    this.pageWidth = this.options.pageWidth || defaultPageWidth;
    this.pageHeight = this.options.pageWidth || defaultPageHeight;
    this.debug = this.options.debug || false;
  }
}

export interface Options {
  pageWidth?: number;
  pageHeight?: number;
  debug?: boolean;
}



