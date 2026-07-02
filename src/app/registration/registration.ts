import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';

@Component({
  selector: 'app-instructor-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Registration {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  hidePassword = true;

  registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    instructorId: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registrationPayload = this.registerForm.getRawValue();

    // Fire HTTP Post directly to Node.js backend
    this.authService.register(registrationPayload).subscribe({
      next: (response) => {
        console.log('Registration successful:', response.message);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Registration failed:', err.error?.message || err.message);
        alert(err.error?.message || 'Failed to complete registration.');
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
