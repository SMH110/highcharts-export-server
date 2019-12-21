import { writeFile } from "fs";

console.log('worker is called');

process.on("message", () => {
    
  writeFile(`./src/spec/helpers/output.txt`, `done\n`,  {flag : 'a'},  error => {
    if (error) return;

    process.send("worker done");
  });
});




process.on('disconnect', ()=>{
  process.kill(0)
})