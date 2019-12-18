import * as serialize from "serialize-javascript";

export class ObjectSerialise {
  public serialise(input):string {
    return serialize(input);
  }

  public safeSerialise(input){
      return JSON.stringify(input)
  }
}
