import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attendance } from '../attendance';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './attendance-form.html',
  styleUrl: './attendance-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceForm {
  private formBuilder = inject(FormBuilder);
  attendanceService = inject(Attendance);

  attendanceForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    section: ['', Validators.required],
    status: ['', Validators.required] // Options: Present, Absent, Late, Tardy
  });

  ngOnInit() {
    this.attendanceService.fetchAttendance();
  }

  onSubmit() {
    if (this.attendanceForm.valid) {
      this.attendanceService.saveAttendance(this.attendanceForm.getRawValue()).subscribe(() => {
        this.attendanceService.fetchAttendance(); // Refresh list after saving
        this.attendanceForm.reset(); // Clear form
        console.log("Attendance record saved successfully!");
      });
    }
  }
}
