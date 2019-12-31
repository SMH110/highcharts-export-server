import { ServiceLocator, dependenciesName } from "./service-locator/service-locator";

export function flags(serviceLocator: ServiceLocator) {
  let arg = process.argv.slice(2);
  
  if (arg.includes("--insecure")) {
    serviceLocator.register(dependenciesName.secure, 'false');
}
}
