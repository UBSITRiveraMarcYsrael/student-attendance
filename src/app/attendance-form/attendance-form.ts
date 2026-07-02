import { Component, inject, ChangeDetectionStrategy, OnInit, signal} from '@angular/core';
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
export class AttendanceForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  attendanceService = inject(Attendance);

  weekLabels = {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: ''
  };

  attendanceForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    section: ['', Validators.required],
    status: ['', Validators.required], // Options: Present, Absent, Late, Tardy
    attendanceDate: ['', Validators.required]
  });

  ngOnInit() {
    this.attendanceService.fetchAttendance();

    const today = new Date().toISOString().split('T')[0];
    this.attendanceForm.patchValue({ attendanceDate: today });
    this.calculateWeekDays(today);

    this.attendanceForm.get('attendanceDate')?.valueChanges.subscribe((selectedDate) => {
      if (selectedDate) {
        this.calculateWeekDays(selectedDate);
      }
    });
  }

  calculateWeekDays(dateString: string) {
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) return;

    const dayOfWeek = targetDate.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(targetDate);
    monday.setDate(targetDate.getDate() + distanceToMonday);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };

    this.weekLabels = {
      monday: targetDate.toLocaleDateString('en-US', options),
      tuesday: '',
      wednesday: '',
      thursday: ''
    };
  }
  private getRelativeDateStr(baseMondayDate: Date, offsetDays: number, options: Intl.DateTimeFormatOptions): string {
    const computedDate = new Date(baseMondayDate);
    computedDate.setDate(baseMondayDate.getDate() + offsetDays);
    return computedDate.toLocaleDateString('en-US', options);
  }

  onSubmit() {
    if (this.attendanceForm.valid) {
      this.attendanceService.saveAttendance(this.attendanceForm.getRawValue()).subscribe(() => {
        this.attendanceService.fetchAttendance(); // Refresh list after saving     
        this.attendanceForm.reset();
        const formData = this.attendanceForm.value;
        console.log('User submitted attendance with date:', formData.attendanceDate);
      });
    }
  }
}
