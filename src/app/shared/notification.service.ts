import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    Notification.requestPermission();
  }

  spawnNotification(title, body) {
    var n = new Notification(title, {
      body,
      icon: 'assets/icons/icon-128x128.png'
    });
    setTimeout(n.close.bind(n), 5000);
  }
}
