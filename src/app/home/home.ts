import { Component, inject } from '@angular/core';
import { AttendanceForm } from '../attendance-form/attendance-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  attendance = inject(AttendanceForm);
}
