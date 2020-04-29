import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Time } from 'src/app/classes';
import { secUnit, dayUnit, hourUnit, minUnit } from 'src/app/constants';

const fps = 30;
const interval = Math.round(secUnit / fps);

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  @Input() mode: 'main' | 'sidebar' = 'main';
  private _time: Time;
  @Input() set time(time: Time) {
    this._time = time;
    this.setMSec();
  }
  private _msec = 0;
  private intervalId = null;
  @Output('finish') finishEmitter = new EventEmitter();
  get isPlaying() {
    return !!this.intervalId;
  }
  get isPlayable() {
    return this._msec > 0;
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
    return Math.floor((this._msec % secUnit) / 100);
  }

  start() {
    if (this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => {
      this._msec -= interval;
      if (this._msec <= 0) {
        this.finish();
      }
    }, interval);
  }

  pause() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private setMSec() {
    this._msec = this._time?.toMillisecond() || 0;
  }

  reset() {
    this.setMSec();
  }

  private finish() {
    this._msec = 0;
    this.pause();
    this.finishEmitter.emit();
  }
}
