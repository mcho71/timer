import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TimerOption, Time } from './classes';
import { TimerComponent } from './shared/timer/timer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'timer';
  mode: 'over' | 'side' = 'side';
  isOpened = true;
  isSideBySide = true;
  @ViewChild(MatSidenav, { static: true })
  sideNav: MatSidenav;
  private sideBySideWidth = 992;
  isTransitioning = false;

  loop = true;
  timerOptions: TimerOption[] = [
    new TimerOption(new Time(0, 0, 5)),
    new TimerOption(new Time(0, 0, 8)),
    new TimerOption(new Time(0, 0, 7)),
  ];
  currentTimerOptionIndex = 0;
  get currentTimerOption() {
    return this.timerOptions[this.currentTimerOptionIndex];
  }

  ngOnInit() {
    // Do not initialize the search on browsers that lack web worker support
    if ('Worker' in window) {
      // Delay initialization by up to 2 seconds
      console.log(window.Worker);
    }

    this.onResize(window.innerWidth);
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
  }

  onFinish() {
    if (this.currentTimerOptionIndex < this.timerOptions.length - 1) {
      this.currentTimerOptionIndex += 1;
    } else if (this.loop) {
      this.currentTimerOptionIndex = 0;
    }
  }
}
