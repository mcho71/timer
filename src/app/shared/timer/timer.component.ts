import { Component, OnInit, Input } from '@angular/core';

const secUnit = 1000;
const minUnit = 60 * secUnit;
const hourUnit = 60 * minUnit;
const dayUnit = 24 * hourUnit;
const fps = 30;
const interval = Math.round(secUnit / fps);
class TimerOption {
  constructor(public msec: number) { };
};

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() option: TimerOption = new TimerOption(10 * secUnit);
  private _msec = this.option.msec;
  private intervalId = null;
  get isPlaying() {
    return !!this.intervalId;
  }
  get day() {
    return Math.floor(this._msec / dayUnit);
  }
  get hour() {
    return Math.floor(this._msec / hourUnit) % 24;
  }
  get min() {
    return Math.floor(this._msec / minUnit) % 60
  }
  get sec() {
    return Math.floor(this._msec / secUnit) % 60;
  }
  get splitSec() {
    return Math.floor((this._msec % secUnit) / 10);
  }

  ngOnInit(): void {
    this.start();
  }

  start() {
    if (this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => {
      this._msec -= interval;
      if (this._msec <= 0) {
        this._msec = 0;
        this.pause();
      }
    }, interval);
  }

  pause() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this._msec = this.option.msec;
  }
}
