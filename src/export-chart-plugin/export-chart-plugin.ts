import { ServiceLocator, dependenciesName } from "../service-locator/service-locator";
import { ChartExportService } from "../chart-export-service/chart-export-service";
import { ChartDataConverter } from "../charts-data-parser-service/charts-data-parser-service";
import { Request, Response } from "express";

class ExpressExportChartPlugin {
  public method = "post";
  public endpoint = "/svg";
  private chartExportService: ChartExportService;
  public chartConverter: ChartDataConverter;
  private secure: boolean;
  constructor(private serviceLocator: ServiceLocator) {
    this.chartExportService = this.serviceLocator.getItem(dependenciesName.chartExportService);
    this.secure = this.serviceLocator.getItem(dependenciesName.secure) || true;
    this.chartConverter = this.serviceLocator.getItem(dependenciesName.chartDataConverter);
  }

  public async requestHandler(req: Request, res: Response) {
    let options = this.parseRequestOptions(req);
    if (options == null) return this.handleBadRequest(res);
    let terminate;
    let terminatePromise = new Promise(res => (terminate = res));

    req.on("close", terminate);

    try {
      let svg = await this.chartExportService.getSVG(options.chartOptions as Highcharts.ChartOptions[], {
        secure: this.secure,
        terminate: terminatePromise,
        browserOptions: {
          ...options.options
        },
        exportOptions: { JsScriptsPaths: this.serviceLocator.getItem(dependenciesName.jsScriptsPaths) }
      });
      // console.log('svg',svg);
      svg = svg || [""];
      res.status(200).send(svg.join(","));
    } catch (error) {
      console.error(error);
      this.handleError(res);
    } finally {
      terminate();
    }
  }

  private handleBadRequest(res: Response) {
    res.status(400).json({
      error: `
        An Error ocurred while parsing your data

        usage:
         {
             options : {
                pageWidth: 800, // optional
                pageHeight: 450, // optional 
             },

             chartOptions : "[...]" // string 
         }
        
        `
    });
  }

  private handleError(res: Response) {
    res.status(500).json({
      error: `An Error ocurred while converting your data`
    });
  }

  private parseRequestOptions(req: Request): RequestBody {
    let body = req.body;

    try {
      let parsedBody = JSON.parse(body.chartOptions);

      let charts = this.chartConverter.deSerialise(parsedBody, { secure: this.secure });

      body.chartOptions = charts;
      return body;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

function chartExportPluginFactory(serviceLocator: ServiceLocator) {
  return new ExpressExportChartPlugin(serviceLocator);
}

export default chartExportPluginFactory;

interface RequestBody {
  options: {
    pageWidth?: number;
    pageHeight?: number;
  };
  chartOptions: string | Highcharts.ChartOptions[];
}
