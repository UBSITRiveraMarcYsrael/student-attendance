import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms/types/forms';
import { Attendance } from '../attendance';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './attendance-form.html',
  styleUrl: './attendance-form.css',
})
export class AttendanceForm {
  private formBuilder = inject(FormBuilder);
  attendanceService = inject(Attendance);

  attendanceForm = this.formBuilder.nonNullable.group({
    employeeId: ['', Validators.required],
    status: ['Present', Validators.required] // Options: Present, Absent, Late, Tardy
  });

  onSubmit() {
    if (this.attendanceForm.valid) {
      this.attendanceService.saveAttendance(this.attendanceForm.getRawValue()).subscribe(() => {
        this.attendanceService.fetchAttendance(); // Refresh list after saving
        this.attendanceForm.reset({ status: 'Present', employeeId: '' }); // Clear form
        console.log("Attendance record saved successfully!");
      });
    }
  }
}
