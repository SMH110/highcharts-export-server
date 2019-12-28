import { writeFile } from "fs";
import { ChartConvertWorkerDataMessage } from "../../data";

console.log("worker is called");

let isTerminated = false;
process.on("message", data => {
  
  isTerminated = false;
  if (data == "terminate") {
    isTerminated = true;
    process.send("worker done");
    return;
  }
  let parsed: ChartConvertWorkerDataMessage = JSON.parse(data);
  
  

  let charts = Function('"use strict";return (' + parsed.charts + ")")();
  setTimeout(() => {
    if (isTerminated == false) {
      writeFile(`./src/spec/helpers/output.txt`, charts.length + "\n", { flag: "a" }, error => {
        if (error) return;

        process.send("worker done");
      });
    }
  }, 250);
});

process.on("disconnect", () => {
  process.kill(0);
});
