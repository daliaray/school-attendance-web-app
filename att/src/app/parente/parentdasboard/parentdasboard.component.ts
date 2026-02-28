import { Component,OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/admin/service/admin-auth.service';
import { StudentTsService } from 'src/app/admin/service/student.ts.service';
import { ActivatedRoute } from '@angular/router';
import { AttendanceTsService } from 'src/app/admin/service/attendance.ts.service';
import { Attendance } from 'src/app/models/attendance';
import { Attendancesch } from 'src/app/models/attendancesch';
@Component({
  selector: 'app-parentdasboard',
  templateUrl: './parentdasboard.component.html',
  styleUrls: ['./parentdasboard.component.css']
})
export class ParentdasboardComponent implements OnInit{
  childrenList: any[] = [];
  idParent!: number; // Variable to store id_parent
  selectedChild: any = null;
  fullname: string = '';
  
  allattendance: Attendance[] = [];
  attendanceRecords: any[] = [];

  constructor(
    private authService: AdminAuthService,
    private studentService: StudentTsService,
    private attendanceService: AttendanceTsService,
  
    private activatedRoute: ActivatedRoute

  ) {}


  ngOnInit(): void {
    // Get the id_parent from the route parameters
    this.idParent = this.activatedRoute.snapshot.params['id_parent'];

    // Fetch the list of children (students) by parent ID
    this.fetchChildrenByParentId(this.idParent);
  }

  fetchChildrenByParentId(parentId: number): void {
    this.studentService.getStudentsByParentId(parentId).subscribe(
      (children: any[]) => {
        this.childrenList = children;
        console.log('Fetched children:', this.childrenList);
      },
      (error) => {
        console.error('Error fetching children:', error);
      }
    );
  }

  selectChild(child: any): void {
    // Concatenate lastname and firstname to create fullname
    this.fullname = `${child.lastname} ${child.firstname}`;
    console.log('Selected child:', this.fullname);
  
    // Update the selected child
    this.selectedChild = child;
    
    // Fetch attendance records for the selected child
    this.fetchAttendance();
    this.fetchAttendancesch();
  }
  
  fetchAttendance(): void {
    if (this.fullname) {
      this.attendanceService.getAttendanceByStudent(this.fullname).subscribe(
        (res: any[]) => {
          console.log('Attendance records:', res); // Add this line
          this.allattendance = res;
        },
        (err: any) => {
          console.error('Error fetching attendance records:', err);
        }
      );
    }

  }
  
  fetchAttendancesch():void{
    if (this.fullname) {
      this.attendanceService.getAttendanceinschByStudent(this.fullname).subscribe(
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
  
  
  
  
  
  
  

 
    
  

  navigateToChild(child: any) {
    // Implement your navigation logic here
    // You can use Angular Router or any other approach
    console.log('Navigating to child:', child);
  }

  showChildDetails(child: any): void {
    this.selectedChild = child;
  }
}

      