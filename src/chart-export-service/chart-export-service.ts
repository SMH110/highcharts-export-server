import { ChartOptions, chart } from "highcharts";
import { cpus } from "os";
import { ServiceLocator, dependenciesName } from "../service-locator/service-locator";
import { ChartDataConverter } from "../charts-data-parser-service/charts-data-parser-service";
import { fork, ChildProcess } from "child_process";
import { BrowserOptions, ExportOptions, ChartConvertWorkerDataMessage } from "../data";
import ProcessPool from "../process-pool/process-pool";

abstract class ChartExportServiceAbstract {
  public async getSVG(charts: ChartOptions[], options: getSVGOptions) {
    return [];
  }
}

export class ChartExportService implements ChartExportServiceAbstract {
  private dataConverter: ChartDataConverter;
  private processPool: ProcessPool;
  private maxWorkers: number;
  constructor(private serviceLocator: ServiceLocator) {
    this.dataConverter = this.serviceLocator.getItem(dependenciesName.chartDataConverter);
    this.processPool = this.serviceLocator.getItem(dependenciesName.processPool);
    this.maxWorkers = this.serviceLocator.getItem(dependenciesName.maxWorkers);
  }

  public async getSVG(charts: ChartOptions[], options: getSVGOptions) {
    let terminateResolve;
    let secure = options.secure || true;
    if (options.terminate == null) options.terminate = new Promise(resolve => (terminateResolve = resolve));

    let segments = this.getSegments(charts);
    let workers = (await Promise.all(this.getWorkers(segments))) as ChildProcess[];
    let svgData = new Promise((mainResolve, mainReject) => {
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

            const workerListener = message => {
              if (message.error) {
                rej(message);
                return
              }
            
              res(message as string);
               return
            };

            worker.send(JSON.stringify(workerData));
            worker.on("message", workerListener);
          })
      );
      return Promise.all(operations)
        .then(data => {
          console.log("finished", data.length);
          return mainResolve(data.reduce((acc, curr) => acc.concat(curr), []));
        })
        .catch(error => {
          mainReject(error);
        });
    });

    return Promise.race([options.terminate, svgData]).then((data: string[]) => {
      workers.forEach(worker => {
        worker.removeAllListeners('message')
        this.processPool.release(worker)
      });
      if (terminateResolve) terminateResolve([]);
      return data;
    }).catch(error => {
      workers.forEach(worker => {
        worker.removeAllListeners('message')
        this.processPool.release(worker)
      });
      if (terminateResolve) terminateResolve([]);
     throw new Error(error)
    })
  }

  private getSegments(charts: any[]) {
    let cpuLength = cpus().length;
    let processors = cpuLength > 1 ? this.maxWorkers : 1;
    // let processors   =  4
    let itemPerCpu = Math.ceil(charts.length / processors);

    let segments = [];
    for (let i = 0; i < charts.length; i += itemPerCpu) {
      segments.push(charts.slice(i, i + itemPerCpu));
    }

    console.log("itemPerCpu", itemPerCpu, " process for this request", segments.length);
    return segments;
  }

  private getWorkers(items: any[]) {
    return items.map(_ => {
      return new Promise(res => this.processPool.acquire(res));
    });
  }
}

export interface getSVGOptions {
  terminate?: Promise<any>;
  browserOptions?: BrowserOptions;
  exportOptions?: ExportOptions;
  secure?: boolean;
}
