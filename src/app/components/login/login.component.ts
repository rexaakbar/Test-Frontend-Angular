import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      this.notificationService.show('Username / Password tidak boleh kosong!', 'error');
      return;
    }

    if (this.authService.login(this.username, this.password)) {
      this.notificationService.show('Login sukses!', 'success');
      this.router.navigate(['/employees']);
    } else {
      this.notificationService.show('Username / Password Salah', 'error');
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }
}