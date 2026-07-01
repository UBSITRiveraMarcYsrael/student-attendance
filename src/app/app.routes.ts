import { Routes } from '@angular/router';
import { AttendanceForm } from './attendance-form/attendance-form';
import { Home } from './home/home';

export const routes: Routes = [
    {path: 'Home', component: Home},

    {path: 'Attendance', component: AttendanceForm},

    {path: '', redirectTo: 'Home', pathMatch: 'full'}
];
