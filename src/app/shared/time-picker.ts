import { Injectable } from '@angular/core';
import Picker from 'pickerjs';
import { Subject } from 'rxjs';
import { Time } from '../classes';

const targetElement: HTMLInputElement = document.querySelector('#time-picker');

@Injectable({ providedIn: 'root' })
export class TimePicker extends Picker {
  _valueChanges: Subject<Time> = new Subject();

  valueChanges() {
    return this._valueChanges;
  }
  constructor() {
    super(targetElement, {
      format: 'HH:mm:ss',
      controls: true,
      inline: true,
      headers: true,
      text: {
        title: 'Pick a time'
      }
    });
    const emitValue = () => {
      const splitValue = (this.getDate(true) as string).split(':').map(str => Number.parseInt(str));
      this._valueChanges.next(new Time(splitValue[0], splitValue[1], splitValue[2]));
    };
    ['change', 'hide'].forEach(eventName => {
      targetElement.addEventListener(eventName, emitValue);
    });
  }
}
