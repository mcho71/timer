import { hourUnit, minUnit, secUnit } from './constants';

export class TimerOption {
  constructor(public time: Time, public title?: string) { };
};

export class Time {
  constructor(public hour: number, public min: number, public sec: number) { }
  toMillisecond() {
    return this.hour * hourUnit + this.min * minUnit + this.sec * secUnit;
  }
}
