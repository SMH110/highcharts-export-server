import { ServiceLocator, dependenciesName } from "../../service-locator/service-locator";
import { ChartDataConverter } from "../../charts-data-parser-service/charts-data-parser-service";
import { ObjectSerialise } from "../../serialiser/serilaiser";
import { join } from "path";
import ProcessPool from "../../process-pool/process-pool";

export function getServiceLocator() {
  let srvLocator = new ServiceLocator();
  srvLocator.register(dependenciesName.maxWorkers, 4)
  srvLocator.register(dependenciesName.secure, 'false')

  srvLocator.register(dependenciesName.chartExportWorkerPath, join(__dirname, "convert-worker.ts"));
  srvLocator.register(dependenciesName.processPool, new ProcessPool(join(__dirname, "convert-worker.ts"), 4));
  srvLocator.register(dependenciesName.objectSerialise, new ObjectSerialise());
  srvLocator.register(dependenciesName.chartDataConverter, new ChartDataConverter(srvLocator));
  return srvLocator;
}
