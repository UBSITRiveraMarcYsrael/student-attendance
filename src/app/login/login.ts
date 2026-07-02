import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';

@Component({
  selector: 'app-instructor-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  hidePassword = true;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentialsPayload = this.loginForm.getRawValue();

    // Fire HTTP verification directly to Node.js backend
    this.authService.login(credentialsPayload).subscribe({
      next: (response) => {
        console.log('Login successful:', response.message);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err.error?.message || err.message);
        alert(err.error?.message || 'Invalid email or password.');
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
