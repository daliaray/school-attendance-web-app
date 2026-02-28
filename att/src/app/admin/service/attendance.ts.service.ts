import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { Attendance } from 'src/app/models/attendance';
import { Teacher } from 'src/app/models/teacher';
import { Attendancesch } from 'src/app/models/attendancesch';
@Injectable({
  providedIn: 'root'
})
export class AttendanceTsService {



  private apiURL = 'http://localhost:3000'; // Replace with your backend API URL


  constructor(private http: HttpClient) { }

  getAllClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiURL}/class`);
  }

  getStudentsByClass(classname: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiURL}/student/${classname}`);
  }

  submitSingleAttendance(attendanceRecord: Attendance): Observable<any> {
    const apiUrl = `${this.apiURL}/submitattendance`;
    return this.http.post<Attendance>(apiUrl, attendanceRecord);
  }

  getSubjectByteacherId(teacherid: number): Observable<string> {
    const url = `${this.apiURL}/subject/`;
    return this.http.get<string>(url);
  }
  getAttendanceByClass(classname: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiURL}/attendancebyclass/${classname}`);
  }

  getAttendanceByStudent(fullname: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiURL}/attendancebystudent/${fullname}`);
  }
  getAttendanceinschByStudent(fullname: string): Observable<Attendancesch[]> {
    return this.http.get<Attendancesch[]>(`${this.apiURL}/attendanceinsch/name?student=${fullname}`);

  }

  getAttendanceForCurrentDate(): Observable<Attendancesch[]> {
    return this.http.get<Attendancesch[]>(`${this.apiURL}/attendanceinsch`);
  }
 

  }


