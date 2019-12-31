import * as express from "express";
import { ServiceLocator, dependenciesName } from "./src/service-locator/service-locator";
import { ObjectSerialise } from "./src/serialiser/serilaiser";
import { ChartDataConverter } from "./src/charts-data-parser-service/charts-data-parser-service";
import { ChartExportService } from "./src/chart-export-service/chart-export-service";
import chartExportPluginFactory from "./src/export-chart-plugin/export-chart-plugin";
import { json } from "body-parser";
import ProcessPool from "./src/process-pool/process-pool";
import { flags } from "./src/flags";
import * as chalk from "chalk";

const serviceLocator = new ServiceLocator();
serviceLocator.register(dependenciesName.secure, "true");
flags(serviceLocator);

serviceLocator.register(dependenciesName.maxWorkers, 4);
serviceLocator.register(
  dependenciesName.chartExportWorkerPath,
  "./src/chart-export-service/puppeteer-browser-worker.ts"
);
serviceLocator.register(
  dependenciesName.processPool,
  new ProcessPool(serviceLocator.getItem(dependenciesName.chartExportWorkerPath), 4)
);

serviceLocator.register(dependenciesName.objectSerialise, new ObjectSerialise());
serviceLocator.register(dependenciesName.chartDataConverter, new ChartDataConverter(serviceLocator));
serviceLocator.register(dependenciesName.chartExportService, new ChartExportService(serviceLocator));
serviceLocator.register(dependenciesName.jsScriptsPaths, [
  "./node_modules/highcharts/highcharts.js",
  "./node_modules/highcharts/modules/exporting.js"
]);

if (serviceLocator.getItem(dependenciesName.secure) == "false") {
  console.warn(
    chalk.yellow(
      `App is running in insecure mode, this allows for converting highchart options contain functions i.e. formatters and tick positioners `
    )
  );
}

const app = express();
const expressExportChartPlugin = chartExportPluginFactory(serviceLocator);

app.use(json({ limit: "50mb" }));

app[expressExportChartPlugin.method](
  expressExportChartPlugin.endpoint,
  expressExportChartPlugin.requestHandler.bind(expressExportChartPlugin)
);

const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log( chalk.cyan(
    `listening on  http://localhost:${port}/`
  ));

 
});
