import { ChartExportService } from "../chart-export-service/chart-export-service";
import { getServiceLocator } from "./helpers/service-locator-helper";
import { fork, execFileSync } from "child_process";
import { unlinkFile } from "./helpers/until";
import { join } from "path";
import { getTestChart } from "./helpers/test-charts";
import { readFileSync, existsSync } from "fs";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 15;
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
    for (let i = 0; i < 1500; i++) charts.push(chart);

    await chartExportService.getSVG(charts, {
      pathToWorker: join(__dirname, "helpers", "convert-worker.ts")
    });

    let output = readFileSync(join(__dirname, "helpers/output.txt"), { encoding: "utf-8" })
      .trim()
      .split("\n");
    expect(output.length).toBe(8);
  });

  it("Should be able to terminate all ongoing export process", async done => {

    let chart = getTestChart();
    let charts = [];
    for (let i = 0; i < 1500; i++) charts.push(chart);

    await chartExportService.getSVG(charts, {
      pathToWorker: join(__dirname, "helpers", "convert-worker.ts"),
      terminate: new Promise(res =>
        setTimeout(() => {
          res();
        }, 900)
      )
    });

    let output = existsSync(join(__dirname, "helpers/output.txt"));
    expect(output).toBe(false);
    done();
  });
});
