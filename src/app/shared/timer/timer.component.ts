import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  get time() {
    return 1;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
