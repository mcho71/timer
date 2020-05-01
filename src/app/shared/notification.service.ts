import { Injectable } from '@angular/core';

const isEnable = 'Notification' in window;
const audio = new Audio('assets/sounds/notification.mp3');

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private permitted = false;
  constructor() {
    if (isEnable) {
      Notification.requestPermission().then(onfulfilled => this.permitted = onfulfilled == 'granted');
    }
  }

  spawnNotification(title, body) {
    if (!this.permitted) {
      return;
    }
    if (isEnable) {
      var n = new Notification(title, {
        body,
        icon: 'assets/icons/icon-128x128.png'
      });
      setTimeout(n.close.bind(n), 5000);
    }
    audio.play().then(() => audio.currentTime = 0);
  }
}
