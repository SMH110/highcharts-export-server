import { ChartExportService } from "../chart-export-service/chart-export-service";
import { getServiceLocator } from "./helpers/service-locator-helper";
import { unlinkFile } from "./helpers/until";
import { join } from "path";
import { getTestChart } from "./helpers/test-charts";
import { readFileSync, existsSync } from "fs";


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;

describe("Chart Export Service", () => {
  let chartExportService: ChartExportService;
  beforeEach(() => {
    let serviceLocator = getServiceLocator();
    chartExportService = new ChartExportService(serviceLocator);

    unlinkFile(join(__dirname, "helpers", "output.txt"));
  });


  afterEach(()=>{
    unlinkFile(join(__dirname, "helpers", "output.txt"));
  })

  it("Should split the converting process between workers", async () => {
    let chart = getTestChart();
    let charts = [];
    let chartsAmount = 32;
    for (let i = 0; i < chartsAmount; i++) charts.push(chart);

    await chartExportService.getSVG(charts, {
      pathToWorker: join(__dirname, "helpers", "convert-worker.ts"),
      exportOptions: null,
      secure: false,
    });

    let output = readFileSync(join(__dirname,  "helpers", "output.txt"), { encoding: "utf-8" })
      .trim()
      .split("\n");      
    expect(output.reduce((acc, cur)=> acc+= parseInt(cur),0)).toBe(chartsAmount);
  });

  it("Should be able to terminate all ongoing export process", async done => {

    let chart = getTestChart();
    let charts = [];
    let chartsAmount = 32;
    for (let i = 0; i < chartsAmount; i++) charts.push(chart);

    await chartExportService.getSVG(charts, {
      pathToWorker: join(__dirname, "helpers", "convert-worker.ts"),
      secure: false,
      terminate: new Promise(res =>
        setTimeout(() => {
          res();
        }, 500)
      )
    });

    

   setTimeout(() => {
    let output = existsSync(join(__dirname, "helpers", "output.txt"));
    expect(output).toBe(false);
    done();
   }, 5000);
  });
});
