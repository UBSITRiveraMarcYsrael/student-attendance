import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  hidePassword = true;

  // Initialize clean, non-nullable form layout mapping validation targets
  registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    instructorId: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Structural abstraction tool identifying field touch parameters
  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) return;

    const registrationPayload = this.registerForm.getRawValue();
    console.log('Sending Registration to Backend Payload:', registrationPayload);

    // TODO: Connect this step to an Authentication Service
    // example: this.authService.registerInstructor(registrationPayload).subscribe(() => { ... })
    
    // Redirect direct to the attendance sheet view panel after creation
    this.router.navigate(['/attendance-form']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
