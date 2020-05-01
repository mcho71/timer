import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TimerOption, Time } from './classes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimePicker } from './shared/time-picker';
import { take } from 'rxjs/operators';
import { NotificationService } from './shared/notification.service';
import { Location } from '@angular/common';

const parameters = new URLSearchParams(window.location.search);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  name = 'Timer';
  mode: 'over' | 'side' = 'side';
  isOpened = true;
  isSideBySide = true;
  @ViewChild(MatSidenav, { static: true })
  sideNav: MatSidenav;
  private sideBySideWidth = 992;
  isTransitioning = false;

  private repeatMode: 'repeat' | 'repeatOne' | 'noRepeat' = 'repeat';
  get isRepeat() {
    return this.repeatMode == 'repeat';
  }
  timerOptions: TimerOption[] = [
    new TimerOption(new Time(0, 0, 1), 'One'),
    new TimerOption(new Time(0, 0, 2), 'Two'),
    new TimerOption(new Time(0, 0, 3)),
  ];
  currentTimerOptionIndex = 0;
  get currentTimerOption() {
    return this.timerOptions[this.currentTimerOptionIndex];
  }

  newTimerOption = new TimerOption(new Time(0, 0, 0));

  constructor(
    private _snackBar: MatSnackBar,
    private _timePicker: TimePicker,
    private _notificationService: NotificationService,
    private location: Location) { }

  ngOnInit() {
    this.onResize(window.innerWidth);
    const name = parameters.get('name');
    if (name) {
      this.name = name;
      document.title = `${name} - Timer`;
    }
    this.getTimerOptionFromGetQuery();
    this.changeUrl();
  }

  private getTimerOptionFromGetQuery() {
    const timerOptions = [];
    while (true) {
      const time = parameters.get(`time${timerOptions.length}`);
      if (!time) {
        break;
      }
      const splitValue = time.split(':').map(str => Number.parseInt(str));
      timerOptions.push(
        new TimerOption(
          new Time(splitValue[0], splitValue[1], splitValue[2]),
          parameters.get(`title${timerOptions.length}`)
        )
      );
    }
    if (timerOptions.length > 0) {
      this.timerOptions = timerOptions;
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.isSideBySide = width >= this.sideBySideWidth;
    if (this.isSideBySide) {
      this.sideNav.toggle(true);
    }
    this.mode = this.isSideBySide ? 'side' : 'over';
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.currentTimerOptionIndex == event.previousIndex) {
      this.currentTimerOptionIndex = event.currentIndex;
    }
    moveItemInArray(this.timerOptions, event.previousIndex, event.currentIndex);
    this.changeUrl();
  }

  onFinish() {
    const finished = this.currentTimerOption;
    if (this.currentTimerOptionIndex < this.timerOptions.length - 1) {
      this.currentTimerOptionIndex += 1;
    } else if (this.isRepeat) {
      this.currentTimerOptionIndex = 0;
    }
    this._notificationService.spawnNotification(
      `${finished.title} Finished!`,
      `Next: ${this.currentTimerOption.title} (${this.currentTimerOption.time.format()})`
    );
  }

  addTimerOption() {
    this.timerOptions.push(new TimerOption(new Time(0, 0, 0)));
    this._snackBar.open('New Timer Added.', null, {
      duration: 2000
    });
    this.changeUrl();
  }

  copyTimerOption(timerOption: TimerOption, index: number) {
    this.timerOptions = [
      ...this.timerOptions.slice(0, index),
      timerOption.clone(),
      ...this.timerOptions.slice(index)
    ];
    this.changeUrl();
  }

  pickTime(timerOption: TimerOption) {
    this._timePicker.setDate(this._timePicker.parseDate(`${timerOption.time.hour}:${timerOption.time.min}:${timerOption.time.sec}`));
    this._timePicker.show();
    this._timePicker.valueChanges().pipe(take(1))
      .subscribe(time => {
        timerOption.time = time;
        this.changeUrl();
      });
  }

  deleteTimerOption(index: number) {
    const option = this.timerOptions.splice(index, 1)[0];
    const snackBarRef = this._snackBar.open(`Timer ${option.title} has deleted.`, 'Undo', {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(() => {
      this.copyTimerOption(option, index);
    });
    this.changeUrl();
  }

  private changeUrl() {
    this.location.replaceState('', this.generateQuery());
  }

  private generateQuery() {
    let query = `name=${this.name}`;
    for (let i = 0; i < this.timerOptions.length; i++) {
      query += `&time${i}=${this.timerOptions[i].time.format()}`;
      if (this.timerOptions[i].title) {
        query += `&title${i}=${this.timerOptions[i].title}`;
      }
    }
    return query;
  }
}
