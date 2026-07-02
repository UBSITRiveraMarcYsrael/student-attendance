import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      tap((res: any) => this.setSession(res.instructor))
    );
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((res: any) => this.setSession(res.instructor))
    );
  }

  private setSession(instructor: any): void {
    if (instructor) {
      localStorage.setItem('instructor', JSON.stringify(instructor));
    }
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout(): void {
    localStorage.clear();
  }
}
