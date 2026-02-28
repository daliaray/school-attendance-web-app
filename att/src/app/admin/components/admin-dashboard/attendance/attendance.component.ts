import { AttendanceTsService } from 'src/app/admin/service/attendance.ts.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common'; // Import formatDate

import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { Attendance } from 'src/app/models/attendance';
import { Attendancesch } from 'src/app/models/attendancesch';
import { StudentTsService } from 'src/app/admin/service/student.ts.service';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  allClasses: Class[] = [];
  selectedClass: string = '';
  students: Student[] = [];
  
  
  searchQuery: string = '';
 
 
  selectedStudent: any = null;
 
  allattendancesch: Attendancesch[] = [];
  attendanceRecords: any[] = [];
  allattendance:Attendance[] = [];



  constructor(private fb: FormBuilder, private attendanceService: AttendanceTsService,private studentService: StudentTsService) { }
  
  ngOnInit(): void {
    this.getAllClasses();
  }

  getAllClasses() {
    this.attendanceService.getAllClasses().subscribe(
      (classes: Class[]) => {
        this.allClasses = classes;
      },
      (error: any) => {
        console.log('Error fetching classes:', error);
      }
    );
  }

  onClassChange() {
    if (this.selectedClass) {
      this.attendanceService.getAttendanceByClass(this.selectedClass).subscribe(
        (res: any[]) => {
          console.log(res);
          this.allattendance = res;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  searchByStudentName(studentName: string) {
    this.attendanceService.getAttendanceinschByStudent(studentName).subscribe(
      (data: any) => {
        // Handle the retrieved attendance data here
        console.log('Attendance records:', data);
        this.attendanceRecords = data;
      },
      (error) => {
        console.error('Error fetching attendance data:', error);
      }
    );
  }
}

