import { ServiceLocator, dependenciesName } from "../service-locator/service-locator";
import { ObjectSerialise } from "../serialiser/serilaiser";
import * as Highcharts from 'highcharts'

// TODO Find a better name
abstract class ChartsDataParserAbstract {
  public serialise(charts: Highcharts.ChartOptions[], options?: Options): string {
    return "";
  }

  public deSerialise(
    charts: string | Highcharts.ChartOptions[],
    options?: Options
  ): Highcharts.ChartOptions[] {
    return [];
  }
}

export class ChartDataConverter implements ChartsDataParserAbstract {
  private objectSerialise: ObjectSerialise;
  constructor(private serviceLocator: ServiceLocator) {
    this.objectSerialise = this.serviceLocator.getItem(dependenciesName.objectSerialise);
  }

  public serialise(charts: Highcharts.ChartOptions[], options: Options): string {
    if (options.secure) {
      return this.objectSerialise.safeSerialise(charts);
    }

    return this.objectSerialise.serialise(charts);
  }

  public deSerialise(
    charts: string | Highcharts.ChartOptions[],
    options?: Options
  ): Highcharts.ChartOptions[] {
    if (options.secure) {
      return this.deSerialiseInSecureMode(charts);
    }

    if (!options.secure) {
      return this.deSerialiseWithoutCheck(charts);
    }
  }

  private deSerialiseInSecureMode(charts: string | Highcharts.ChartOptions[]): Highcharts.ChartOptions[] {
    let output = [];
    try {
      if (typeof charts == "string") {
        let parsed = JSON.parse(charts);

        output = Array.isArray(parsed) ? parsed : [parsed];
      }

      let temp = JSON.parse(JSON.stringify(charts));
      output = Array.isArray(temp) ? temp : [temp];
    } catch (error) {
      return output;
    }

    return output;
  }

  private deSerialiseWithoutCheck(charts: string | Highcharts.ChartOptions[]): Highcharts.ChartOptions[] {
    let output = [];

    try {
      if (typeof charts == "string") {
        let temp = Function('"use strict";return (' + charts + ")")() as Highcharts.ChartOptions[];
        output = Array.isArray(temp) ? temp : [temp];
      } else {
        output = charts;
      }
    } catch (error) {
      console.error(error);
      return output;
    }

    return output;
  }
}

interface Options {
  secure?: boolean;
}
