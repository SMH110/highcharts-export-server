import { writeFile } from "fs";
import { ChartConvertWorkerDataMessage } from "../../data";

console.log('worker is called');

process.on("message", (data) => {
  let parsed : ChartConvertWorkerDataMessage = JSON.parse(data); 
 
  let charts = Function('"use strict";return (' + parsed.charts + ")")();
  setTimeout(() => {
  writeFile(`./src/spec/helpers/output.txt`, charts.length + '\n',  {flag : 'a'},  error => {
    if (error) return;

   
    process.send("worker done");
  
  });
}, 250);
});




process.on('disconnect', ()=>{
  process.kill(0)
})