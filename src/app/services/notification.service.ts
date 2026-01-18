import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$: Observable<Notification | null> = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.notificationSubject.next({ message, type });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide(): void {
    this.notificationSubject.next(null);
  }
}