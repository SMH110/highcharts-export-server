import { ChartOptions, chart } from "highcharts";
import { cpus } from "os";
import { ServiceLocator, dependenciesName } from "../service-locator/service-locator";
import { ChartDataConverter } from "../charts-data-parser-service/charts-data-parser-service";
import { fork, ChildProcess } from "child_process";
import { BrowserOptions, ExportOptions, ChartConvertWorkerDataMessage } from "../data";

abstract class ChartExportServiceAbstract {
  public async getSVG(charts: ChartOptions[], options: getSVGOptions) {
    return "";
  }
}

export class ChartExportService implements ChartExportServiceAbstract {
  private dataConverter: ChartDataConverter;
  constructor(private serviceLocator: ServiceLocator) {
    this.dataConverter = this.serviceLocator.getItem(dependenciesName.chartDataConverter);
  }

  public async getSVG(charts: ChartOptions[], options: getSVGOptions) {
    let terminateResolve;
    let secure = options.secure || true;
    if (options.terminate == null) options.terminate = new Promise(resolve => (terminateResolve = resolve));

    let segments = this.getSegments(charts);
    let workers: ChildProcess[] = [];
    let svgData = new Promise((mainResolve, mainReject) => {
      workers = segments.map(() => fork(options.pathToWorker, []));
      let operations = workers.map(
        (worker, index) =>
          new Promise<string>((res, rej) => {
            let workerData: ChartConvertWorkerDataMessage;
            try {
              workerData = {
                browserOptions: options.browserOptions,
                charts: this.dataConverter.serialise(segments[index], { secure }),
                exportOptions: options.exportOptions
              };
            } catch (error) {
              rej(error);
            }

            worker.send(JSON.stringify(workerData));
            worker.on("message", svg => {
              res(svg as string);
              worker.disconnect();
            });

            worker.on("error", rej);
          })
      );
      return Promise.all(operations).then(data => {
        console.log("finished");
        return mainResolve(data);
      }, mainReject);
    });

    return Promise.race([options.terminate, svgData]).then((data: string) => {
      workers.forEach(worker => worker.disconnect());
      if (terminateResolve) terminateResolve("");
      return data;
    });
  }

  private getSegments(charts: any[]) {
    let cpuLength = cpus().length;
    let processors = charts.length / (cpuLength * 4) > cpuLength ? cpuLength : cpuLength > 1 ? 2 : 1;
    // let processors   =  4
    let itemPerCpu = Math.ceil(charts.length / processors);
    console.log("itemPerCpu", itemPerCpu);
    let segments = [];
    for (let i = 0; i < charts.length; i += itemPerCpu) {
      segments.push(charts.slice(i, i + itemPerCpu));
    }
    return segments;
  }
}

export interface getSVGOptions {
  pathToWorker: string;
  terminate?: Promise<any>;
  browserOptions?: BrowserOptions;
  exportOptions?: ExportOptions;
  secure?: boolean;
}
