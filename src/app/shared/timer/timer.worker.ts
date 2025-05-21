/// <reference lib="webworker" />

const fps = 30;
const interval = Math.round(1000 / fps);

let msec: number = 0;
let intervalId: any = null;

addEventListener('message', (event) => {
  const { command, msec: newMsec } = event.data;

  switch (command) {
    case 'start':
      if (msec > 0 && !intervalId) {
        intervalId = setInterval(() => {
          msec -= interval;
          if (msec <= 0) {
            msec = 0;
            postMessage({ type: 'tick', msec: msec });
            postMessage({ type: 'finish' });
            clearInterval(intervalId);
            intervalId = null;
          } else {
            postMessage({ type: 'tick', msec: msec });
          }
        }, interval);
      }
      break;
    case 'pause':
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      break;
    case 'reset':
      msec = newMsec;
      postMessage({ type: 'tick', msec: msec });
      break;
    case 'setTime':
      msec = newMsec;
      postMessage({ type: 'tick', msec: msec });
      break;
  }
});
