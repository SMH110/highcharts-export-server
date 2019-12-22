import { defaultPageWidth, defaultPageHeight } from "../settings";
import { BrowserOptions } from "../data";

export class BrowserBase {
  protected pageWidth;
  protected pageHeight;
  protected debug;

  constructor(private options: BrowserOptions) {
    this.pageWidth = this.options.pageWidth || defaultPageWidth;
    this.pageHeight = this.options.pageWidth || defaultPageHeight;
    this.debug = this.options.debug || false;
  }
}

 



