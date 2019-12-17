class ServiceLocator {
  private dependencies = {};
  private factories = {};

  public get(name: nameType) {
    if (!this.dependencies[name]) {
      const factory = this.factories[name];
      this.dependencies[name] = factory && factory(this);
      if (!this.dependencies[name]) {
        throw new Error("Cannot find module: " + name);
      }
    }
    return this.dependencies[name];
  }

  public factory(name, factory) {
    this.factories[name] = factory;
  }

  public register(name, instance) {
    this.dependencies[name] = instance;
  }
}

export const serviceLocator = new ServiceLocator();

export enum dependenciesName {
  chartExportWorkerPath = 0
}

type nameType = dependenciesName.chartExportWorkerPath;
