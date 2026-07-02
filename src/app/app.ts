import { Component, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
//import { Navbar } from './navbar/navbar';
import { AttendanceForm } from './attendance-form/attendance-form';
import { Home } from './home/home';
import { Registration } from './registration/registration';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AttendanceForm, Home, Registration],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('attendance');
}
