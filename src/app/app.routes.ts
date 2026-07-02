import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AttendanceForm } from './attendance-form/attendance-form';
import { Registration } from './registration/registration';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';


export const routes: Routes = [
    {path: 'home', component: Home},
    {path: 'registration', component: Registration},
    {path: 'attendance', component: AttendanceForm},
    {path: 'login', component: Login},
    {path: 'dashboard', component: Dashboard},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
