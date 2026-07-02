import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Attendance } from '../attendance';

interface ActivityLog {
  studentName: string;
  status: string;
  section: string;
  timestamp: string; // Plain string descriptor for visual display
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  public attendanceService = inject(Attendance); // Change to public to bind computed values safely

  instructorName = 'Professor';
  today = new Date();

  // 1. Core Analytics metrics computed dynamically from your database signal array
  public totalStudentsCount = computed(() => {
    return this.attendanceService.attendanceList()?.length || 0;
  });

  // 2. Generate recent logs stream dynamically by filtering database rows
  public recentLogs = computed<ActivityLog[]>(() => {
    const list = this.attendanceService.attendanceList() || [];
    const logs: ActivityLog[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Loop through each student record from MongoDB
    list.forEach(student => {
      days.forEach(day => {
        // Look up the lowercase property (e.g., student.monday)
        const status = student[day.toLowerCase() as keyof typeof student];
        
        // If a student has an un-blank irregular status, push it into the live feed logs
        if (status && status !== 'Present') {
          logs.push({
            studentName: student.name,
            status: status,
            section: student.section,
            timestamp: `Logged for ${day}`
          });
        }
      });
    });

    // Return the logs found in your database records
    return logs;
  });

  ngOnInit() {
    // Fire fresh HTTP request to Node backend to fetch latest data rows
    this.attendanceService.fetchAttendance();

    const storedUser = localStorage.getItem('instructor');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.instructorName = user.fullName || 'Professor';
      } catch (e) {
        console.error('Error reading instructor session data', e);
      }
    }
  }

  navigateToAttendance() {
    this.router.navigate(['/attendance-form']);
  }

  printReports() {
    window.print();
  }
}
