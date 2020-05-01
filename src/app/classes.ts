import { hourUnit, minUnit, secUnit } from './constants';

export class TimerOption {
  constructor(public time: Time, public title?: string) { };
  clone() {
    return new TimerOption(this.time.clone(), this.title);
  }
};

const formatNumberDoubleDigit = (number: number) => `00${number}`.slice(-2);

export class Time {
  constructor(public hour: number, public min: number, public sec: number) { }
  toMillisecond() {
    return this.hour * hourUnit + this.min * minUnit + this.sec * secUnit;
  }
  clone() {
    return new Time(this.hour, this.min, this.sec);
  }
  format = () => `${formatNumberDoubleDigit(this.hour)}:${formatNumberDoubleDigit(this.min)}:${formatNumberDoubleDigit(this.sec)}`;
}
