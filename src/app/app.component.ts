import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificationService, Notification } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'employee-management';
  notification: Notification | null = null;

  constructor(private notificationService: NotificationService) {
    this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
    });
  }

  getNotificationStyle(): string {
    if (!this.notification) return '';
    
    const baseStyle = 'position: fixed; top: 1rem; right: 1rem; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); color: white; z-index: 50; font-weight: 500;';
    
    switch (this.notification.type) {
      case 'success':
        return `${baseStyle} background: #10b981;`;
      case 'error':
        return `${baseStyle} background: #ef4444;`;
      case 'warning':
        return `${baseStyle} background: #eab308;`;
      case 'info':
        return `${baseStyle} background: #3b82f6;`;
      default:
        return `${baseStyle} background: #6b7280;`;
    }
  }
}