import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminauthTsService } from 'src/app/service/adminauth.ts.service';
import { Router } from '@angular/router';
import { AttendanceTsService } from 'src/app/admin/service/attendance.ts.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { formatDate } from '@angular/common'; // Import formatDate

import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { Attendance } from 'src/app/models/attendance';
@Component({
  selector: 'app-teach',
  templateUrl: './teach.component.html',
  styleUrls: ['./teach.component.css']
})
export class TeachComponent implements OnInit  {
  username: string = '';
  allClasses: Class[] = [];
  selectedClass: string = '';
  students: Student[] = [];
  attendanceRecords: {student_id:number, student: string,classe: string , date: string, subject:string, status: string }[] = [];
  teacherid!: number;
  subject: string = '';
  
 
  constructor(
    private fb: FormBuilder,
    private router:Router,
    private authService1:AdminauthTsService,
    private attendanceService: AttendanceTsService
  ) {}

  ngOnInit(): void {
    this.authService1.username$.subscribe((username) => {
      this.username = username;
      this.getAllClasses();
      this.fetchsubjectbyteacherid(this.teacherid);
    });
  }


  fetchsubjectbyteacherid(teacherid: number): void {
    this.attendanceService.getSubjectByteacherId(teacherid).subscribe(
      subject => {
        this.subject = subject; // Assign the retrieved subject to the component property
        console.log('Selected subject:', this.subject);
      },
      error => {
        console.error('Error fetching subject:', error);
      }
    );
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
      this.attendanceService.getStudentsByClass(this.selectedClass).subscribe(
        (students: Student[]) => {
          this.students = students;
          this.attendanceRecords = students.map(student => ({
            student_id:student.student_id,
            student: student.lastname + ' ' + student.firstname,
            classe: this.selectedClass,
            date: new Date().toISOString(), 
            subject: this.subject,
            status: 'absent' // Default status as 'absent'
          }));
        },
        (error: any) => {
          console.log('Error fetching students by class:', error);
        }
      );
    } else {
      this.students = [];
      this.attendanceRecords = [];
    }
  }

  onAttendanceChange(student: Student, status: string) {
    const studentName = student.lastname + ' ' + student.firstname;
    const attendanceRecord = this.attendanceRecords.find(record => record.student === studentName);
  
    console.log('attendanceRecord:', attendanceRecord);
  
    if (attendanceRecord) {
      attendanceRecord.status = status;
    } else {
      console.log('Attendance record not found for student:', studentName);
    }
  }
  
  
  submitAttendance() {
    console.log('attendanceRecords:', this.attendanceRecords);
   
    // Check if any of the attendance records have missing data

    const invalidRecords = this.attendanceRecords.filter(record =>
      !record.date || !record.student || !record.status
    );
  
    if (invalidRecords.length > 0) {
      console.log('Invalid attendance records:', invalidRecords);
      return; // Stop submission if there are invalid records
    }
  
  // Send records one by one
  this.sendAttendanceRecordsToBackend();
}

sendAttendanceRecordsToBackend() {
  const totalRecords = this.attendanceRecords.length;
  let counter = 0;

  const sendNextRecord = () => {
    if (counter < totalRecords) {
      const recordToSend = this.attendanceRecords[counter];
      if (recordToSend && recordToSend.status) { // Check if record and status exist
        this.attendanceService.submitSingleAttendance(recordToSend).subscribe(
          () => {
            console.log(`Record ${counter + 1} submitted successfully`);
            counter++;
            sendNextRecord(); // Send the next record recursively
          },
          (error: any) => {
            console.log(`Error submitting record ${counter + 1}:`, error);
            counter++;
            sendNextRecord(); // Send the next record recursively
          }
        );
      } else {
        console.log(`Skipping record ${counter + 1} due to missing data`);
        counter++;
        sendNextRecord(); // Move to the next record
      }
    } else {
      console.log('All records submitted successfully');
      this.attendanceRecords = []; // Clear the attendanceRecords array after successful submission
    }
  };

  // Start sending records recursively
  sendNextRecord();
}

  
getAttendanceButtonClass(status: string, index: number): string {
  if (this.attendanceRecords[index]?.status === status) {
    return status === 'present' ? 'btn btn-success' : 'btn btn-danger';
  } else {
    return status === 'present' ? 'btn btn-outline-success' : 'btn btn-outline-danger';
  }
}


  signOut(): void {
    localStorage.removeItem("token");
    this.router.navigate(['login1']);
  }
}
