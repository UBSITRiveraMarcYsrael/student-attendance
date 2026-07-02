import { Component, inject, ChangeDetectionStrategy, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attendance } from '../attendance';
import { CommonModule } from '@angular/common';

interface DayConfig {
  key: string;
  label: string;
  date: Date;
}

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
  private cdr = inject(ChangeDetectorRef);
  attendanceService = inject(Attendance);

  // Configuration housing names, lookup form keys, and computed calendar dates
  weekDaysConfig: DayConfig[] = [];

  attendanceForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    section: ['', Validators.required],
    studentsGrid: this.formBuilder.array<FormGroup>([])
  });

  constructor() {
    // Generate dates for current week on instantiation
    this.generateCurrentWeekDates();

    effect(() => {
      const records = this.attendanceService.attendanceList();
      this.rebuildFormArray(records);
    });
  }

  ngOnInit() {
    this.attendanceService.fetchAttendance();
    const currentRecords = this.attendanceService.attendanceList() || [];
    this.rebuildFormArray(currentRecords);
  }

  // Calculates Calendar positions for Monday through Friday relative to today
  private generateCurrentWeekDates() {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Distance math offset back to Monday
    const genericOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() + genericOffset);

    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const keys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    this.weekDaysConfig = keys.map((key, index) => {
      const computedDate = new Date(mondayDate);
      computedDate.setDate(mondayDate.getDate() + index);
      return {
        key,
        label: labels[index],
        date: computedDate
      };
    });
  }

  get studentsGrid(): FormArray<FormGroup> {
    return this.attendanceForm.get('studentsGrid') as FormArray<FormGroup>;
  }

  private rebuildFormArray(records: any[]) {
    this.studentsGrid.clear({ emitEvent: false });
    
    records.forEach(student => {
      const row = this.formBuilder.group({
        _id: [student._id],
        name: [student.name],
        section: [student.section],
        monday: [student.monday || ''],
        tuesday: [student.tuesday || ''],
        wednesday: [student.wednesday || ''],
        thursday: [student.thursday || ''],
        friday: [student.friday || '']
      });
      this.studentsGrid.push(row, { emitEvent: false });
    });
    this.cdr.markForCheck();
  }

  onSubmit() {
    const { name, section } = this.attendanceForm.getRawValue();
    if (name && section) {
      const payload = {
        name,
        section,
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: ''
      };

      this.attendanceService.saveAttendance(payload).subscribe(() => {
        this.attendanceService.fetchAttendance();
        this.attendanceForm.get('name')?.reset();
        this.attendanceForm.get('section')?.reset();
      });
    }
  }

  onStatusChange(rowIndex: number, dayKey: string) {
    const rowGroup = this.studentsGrid.at(rowIndex);
    const updatedData = rowGroup.getRawValue();

    if (this.attendanceService.saveAttendance) {
      this.attendanceService.saveAttendance(updatedData).subscribe(() => {
        console.log(`Saved update for day index: ${dayKey}`);
      });
    }
  }
}
