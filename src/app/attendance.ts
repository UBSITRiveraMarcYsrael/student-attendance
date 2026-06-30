import { Injectable, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Attendance {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/student';

  // Reactive state management using signals
  attendanceList = signal<any[]>([]);

  fetchAttendance() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      data => this.attendanceList.set(data)
    );
  }

  saveAttendance(data: any) {
    return this.http.post(this.apiUrl, data);
  }
}
