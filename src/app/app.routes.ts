import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AttendanceForm } from './attendance-form/attendance-form';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'AttendanceForm', component: AttendanceForm }
];

