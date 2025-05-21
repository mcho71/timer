import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Time } from 'src/app/classes';
import { secUnit, dayUnit, hourUnit, minUnit } from 'src/app/constants';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Output() finish = new EventEmitter();
  @Input() mode: 'main' | 'sidebar' = 'main';
  private _time: Time;
  @Input() set time(time: Time) {
    this._time = time;
    const newMsec = this._time?.toMillisecond() || 0;
    this._msec = newMsec; // Keep _msec in sync for display purposes
    if (this.worker) {
      this.worker.postMessage({ command: 'setTime', msec: newMsec });
    } else {
      // If worker isn't initialized yet (e.g. during component init before ngOnInit),
      // this will be handled by ngOnInit sending initial time.
      // Or, if workers are not supported, this ensures _msec is set for a potential fallback (not implemented here).
    }
  }
  private _msec = 0;
  private intervalId = null;
  private worker: Worker;

  get isPlaying() {
    return !!this.intervalId;
  }
  get isPlayable() {
    return this._msec > 0;
  }

  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./timer.worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        if (data.type === 'tick') {
          this._msec = data.msec;
          // Potentially trigger change detection if needed, though direct property updates usually do.
        } else if (data.type === 'finish') {
          this.onFinish(); // Call the existing onFinish method
        }
      };
      // Send initial time to worker after it's set
      if (this._time) { // Ensure _time is available
         this.worker.postMessage({ command: 'setTime', msec: this._time.toMillisecond() });
      }
    } else {
      // Fallback or error message if Web Workers are not supported.
      console.error('Web Workers are not supported in this environment.');
      // Consider if a fallback to the old setInterval method is desired or if an error state is sufficient.
      // For now, just log an error.
    }
  }

  ngOnDestroy() {
    if (this.worker) {
      this.worker.terminate();
    }
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
    if (this.isPlaying) { // isPlaying getter will need adjustment or can be based on worker state if desired
      return;
    }
    if (this.worker) {
      this.worker.postMessage({ command: 'start' });
      // Update isPlaying based on the assumption that the command will succeed.
      // Consider having the worker send back a 'started' confirmation if strict state management is needed.
      this.intervalId = -1; // Use intervalId to signify it's playing, -1 for worker, null for not playing.
                            // This is a temporary solution for isPlaying. A better way would be to get state from worker.
    } else {
      // Fallback or error (if workers not supported)
    }
  }

  pause() {
    if (this.worker) {
      this.worker.postMessage({ command: 'pause' });
      this.intervalId = null; // Signify paused state for isPlaying getter
    } else {
      // Fallback or error
    }
  }

  private setMSec() {
    this._msec = this._time?.toMillisecond() || 0;
  }

  reset() {
    const resetMsec = this._time?.toMillisecond() || 0;
    if (this.worker) {
      this.worker.postMessage({ command: 'reset', msec: resetMsec });
      // _msec will be updated via 'tick' message from worker.
      // If pause() was not called before reset, ensure isPlaying is also reset.
      this.intervalId = null; // Or handle based on worker state
    } else {
       this._msec = resetMsec; // Fallback if no worker
    }
  }

  private onFinish() {
    this._msec = 0; // Ensure msec is set to 0 locally
    this.intervalId = null; // Update playing state
    this.finish.emit();
  }
}
