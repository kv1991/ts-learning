import Pify from 'pify';

interface PropsInterface {
  maxLimit: number | 5;
  requestApi: (num: number, time: number, cb: (nullType: null, numType: number) => void) => void;
  needChange2Promise: boolean;
}

export type RequestQueueType = () => void;

export type RequestApiType = (num: number, time: number, cb: (nullType: null, numType: number) => void) => void;

export class RequestDecorator {
  maxLimit: number;
  requestQueue: (RequestQueueType | undefined)[] = [];
  currentConcurrent: number;
  requestApi: RequestApiType;
  constructor(props: PropsInterface) {
    // 最大并发量
    this.maxLimit = props.maxLimit;
    this.currentConcurrent = 0;
    this.requestQueue = [];
    this.requestApi = props.needChange2Promise ? Pify(props.requestApi) : props.requestApi;
  }

  async request(...args: any) {
    if (this.currentConcurrent >= this.maxLimit) {
      await this.startBlocking()
    }
    try {
      this.currentConcurrent++;
      const _args: [num: number, time: number, cb: (nullType: null, numType: number) => void] = args;
      const result = await this.requestApi(..._args);
      return Promise.resolve(result);
    }
    catch (error) {
      return Promise.reject(error);
    }
    finally {
      console.log('当前并发数:', this.currentConcurrent);
      this.currentConcurrent--;
      this.next();
    }
  }

  startBlocking() {
    let _resolve;
    let promise2 = new Promise((resolve, reject) => {
      _resolve = resolve;
    });
    this.requestQueue.push(_resolve);
    return promise2;
  }

  next() {
    if (this.requestQueue.length <= 0) return;
    const _resolve = this.requestQueue.shift();
    if (typeof(_resolve) === 'function') {
      _resolve();
    }
  }
}