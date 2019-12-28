import { fork, ChildProcess } from "child_process";

class ProcessPool {
  private active = [];
  private waiting = [];
  private pool = [];

  constructor(private file, private poolMax) {}

  acquire(resolve) {
    let worker;
    if (this.pool.length > 0) {
      worker = this.pool.pop();
      this.active.push(worker);
      process.nextTick(resolve(worker));
      return;
    }
    if (this.active.length >= this.poolMax) {
      this.waiting.push(resolve);
      return;
    }
    worker = fork(this.file);
    this.active.push(worker);
    process.nextTick(resolve(worker));
  }

  release(worker: ChildProcess) {
    console.log("releasing worker");

    if (this.waiting.length > 0) {
      const waitingPromise = this.waiting.shift();

      waitingPromise(worker);
      return;
    }
    this.active = this.active.filter(w => worker !== w);
    this.pool.push(worker);
  }
}

export default ProcessPool;
