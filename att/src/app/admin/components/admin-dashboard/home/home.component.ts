import { ClassTsService } from 'src/app/admin/service/class.ts.service';
import { Component, OnInit } from '@angular/core';
import { AttendanceTsService } from 'src/app/admin/service/attendance.ts.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Attendancesch } from 'src/app/models/attendancesch';
import { Student } from 'src/app/models/student';
import { StudentTsService } from 'src/app/admin/service/student.ts.service';
import { Class } from 'src/app/models/class';
import { Teacher } from 'src/app/models/teacher';
import { TeacherTsService } from 'src/app/admin/service/teacher.ts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  attendanceData: Attendancesch[] = [];
  teacherdata: Teacher[] = [];
 
  totalStudents: number = 0;
  totalClasses: number=0;
  percentagePresent: number = 0;
  totalTeachers: number = 0;

  countStudentPresent: number = 0;

  constructor(private fb: FormBuilder, private attendanceService: AttendanceTsService,
     private studentservice :StudentTsService,
     private classservice :ClassTsService ,
     private teacherservice :TeacherTsService) { }
  
  ngOnInit(): void {
    this.fetchAttendanceForCurrentDate();
    this.getCountOfStudents();
    this.getCountOfClass();
    this.getCountOfTeacher();
    this.getAllTeachers();
   
  }

  getCountOfStudents() {
    this.studentservice.getCountOfStudents().subscribe(
      (data) => {
        // Handle the count of students received from the service
        this.totalStudents = data.totalStudents;

        // Now, you can calculate the percentage
        this.calculatePercentage();

        console.log('Total students:', this.totalStudents);
      },
      (error) => {
        // Handle errors
        console.error('Error fetching total students count:', error);
      }
    );
  }

  getCountOfTeacher() {
    this.teacherservice.getCountOfteacher().subscribe(
      (data) => {
        // Handle the count of students received from the service
        this.totalTeachers = data.totalTeacher;


        console.log('Total teachers:', this.totalTeachers);
      },
      (error) => {
        // Handle errors
        console.error('Error fetching total teachers count:', error);
      }
    );
  }

  getCountOfClass() {
    this.classservice.getCountOfclass().subscribe(
      (data) => {
        // Handle the count of students received from the service
        this.totalClasses = data.totalClass;

    

        console.log('Total classes:', this.totalClasses);
      },
      (error) => {
        // Handle errors
        console.error('Error fetching total class count:', error);
      }
    );
  }

  fetchAttendanceForCurrentDate() {
    this.attendanceService.getAttendanceForCurrentDate().subscribe(
      (data) => {
        // Handle the data received from the service
        this.attendanceData = data;
        this.countStudentPresent = data.filter(entry => entry.status === 'present').length;

      // Calculate the percentage here if needed
      console.log('Attendance for current date:', data);
      console.log('Count of students present:', this.countStudentPresent);
        
      },
      (error) => {
        // Handle errors
        console.error('Error fetching attendance:', error);
      }
    );
  }



  

  calculatePercentage() {
    // Calculate the percentage based on the count
    this.percentagePresent = (this.countStudentPresent / this.totalStudents) * 100;

    console.log('Percentage of students present:', this.percentagePresent.toFixed(2) + '%');
  }



  getAllTeachers() {
    this.teacherservice.getallteacher().subscribe(
      res => {
        console.log(res);
        this.teacherdata = res;
      },
      err => {
        console.log(err);
      }
    );
  }
}
