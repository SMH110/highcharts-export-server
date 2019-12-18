import { ChartDataConverter } from "../charts-data-parser-service/charts-data-parser-service";
import { getServiceLocator } from "./helpers/service-locator-helper";
import { getTestChart } from "./helpers/test-charts";

describe("Chart Data Converter Service ", () => {
  let chartDataConverterService: ChartDataConverter;

  beforeEach(() => {
    let serviceLocator = getServiceLocator();
    chartDataConverterService = new ChartDataConverter(serviceLocator);
  });

  describe("DeSerialise", () => {
    it("Should de serialise string chart as expected - secure mode on", () => {
      let chart = getTestChart();
      let string = chartDataConverterService.serialise(chart, { secure: false });

      let safeChart = chartDataConverterService.deSerialise(string, { secure: true });
      expect(Array.isArray(safeChart)).toBe(true);
      expect(safeChart.length).toBe(0);
    });

    it("Should de serialise string chart as expected - secure mode false", () => {
      let chart = getTestChart();
      let string = chartDataConverterService.serialise(chart, { secure: false });

      let convertedChart = chartDataConverterService.deSerialise(string, { secure: false });
      expect(Array.isArray(convertedChart)).toBe(true);
      expect(convertedChart.length).toBe(1);
      expect(convertedChart[0]["xAxis"].labels.formatter).toBeTruthy();
    });
  });
});
