import React from 'react';
import { RequestApiType, RequestDecorator } from './RequestDecorator';

export default function RequestDemo() {
  React.useEffect(
    () => {
      // 一个callback类型的请求api
      const delay: RequestApiType = (num: number, time: number, cb: (nullParam: null, numtType: number) => void) => {
        setTimeout(() => {
          cb(null, num);
        }, time);
      }
      // 通过maxLimit设置并发量限制，needChange2Promise将callback类型的请求api转化为promise类型的。
      const requestInstance = new RequestDecorator({
        maxLimit: 5,
        requestApi: delay,
        needChange2Promise: true
      });
      
      let promises: any = [];
      for (let i = 0; i < 30; i++) {
        const singlePromise = requestInstance.request(i, Math.random() * 3000);
        const promiseCall = promises.push(singlePromise);
        if (promiseCall instanceof Promise) {
          promiseCall.then(
            (result: any) => console.log('result: ', result),
            (error: any) => console.log('error: ', error)
          );
        }
      }
      
      async function test() {
        await Promise.all(promises);
      }
      
      test();
    },[]
  );
  return null;
}