import { ServiceLocator, dependenciesName } from "../../service-locator/service-locator";
import { ChartDataConverter } from "../../charts-data-parser-service/charts-data-parser-service";
import { ObjectSerialise } from "../../serialiser/serilaiser";

export function getServiceLocator() {
  let srvLocator = new ServiceLocator();
  srvLocator.register(dependenciesName.objectSerialise, new ObjectSerialise());
  srvLocator.register(dependenciesName.chartDataParser, new ChartDataConverter(srvLocator));
  return srvLocator;
}
