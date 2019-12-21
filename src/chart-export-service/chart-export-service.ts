import { ChartOptions, chart } from "highcharts";
import { cpus } from "os";
import { ServiceLocator, dependenciesName } from "../service-locator/service-locator";
import { ChartDataConverter } from "../charts-data-parser-service/charts-data-parser-service";
import { fork } from "child_process";

abstract class ChartExportServiceAbstract {
  public async getSVG(charts: ChartOptions[], options: getSVGOptions) {}
}

export class ChartExportService implements ChartExportServiceAbstract {
  private dataConverter: ChartDataConverter;
  constructor(private serviceLocator: ServiceLocator) {
    this.dataConverter = this.serviceLocator.getItem(dependenciesName.chartDataConverter);
  }

  public async getSVG(charts: ChartOptions[], options: getSVGOptions) {
    
    let terminateResolve;

    if (options.terminate == null) options.terminate = new Promise(resolve => (terminateResolve = resolve));

    return Promise.race([
      options.terminate,
      new Promise((mainResolve, mainReject) => {
        let cpusLength = cpus().length;
        console.log('cpusLength',cpusLength);
        
        let itemPerCpu = Math.ceil(charts.length / cpusLength);
        console.log('itemPerCpu',itemPerCpu);
        
        
        
        let chunks = [];
      
        
     for (let i =0; i < charts.length; i += itemPerCpu){
       chunks.push(charts.slice(i, i + itemPerCpu))
     }

        let operations = chunks.map(
          chunk =>
            new Promise((res, rej) => {
              let child = fork(options.pathToWorker, []);
              child.send(this.dataConverter.serialise(chunk, { secure: false }));
              child.on("message", svg => {
                res(svg);
                child.disconnect();
              });

              child.on("error", rej);
            })
        );

        return Promise.all(operations).then(data => {
          console.log('finished');
          
          mainResolve(data);
          if (terminateResolve) terminateResolve();
        });
      })
    ]);
  }
}

export interface getSVGOptions {
  pathToWorker: string;
  terminate?: Promise<any>;
}
