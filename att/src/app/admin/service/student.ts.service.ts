import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable , BehaviorSubject} from "rxjs";
import { first, catchError, tap } from "rxjs/operators";
import { Student } from 'src/app/models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentTsService {

  apiURL="http://localhost:3000/student";
  apiUrl="http://localhost:3000";
  private apiURL1 = 'http://localhost:3000/countStudents'; // Replace with your API endpoint


  constructor(private http : HttpClient) { }
  fingerprint1(student:Student){
    const url = `http://localhost:3000/idelev/${student.student_id}`;
    return this.http.get<any>(url);
    
  }

  addStudent(doc:Student){
    return this.http.post<Student[]>(this.apiURL,doc);
  }

  getallstudents(){
  return this.http.get<Student[]>(this.apiURL);}

 
  updateStudent(student: Student): Observable<any> {
    const url = `http://localhost:3000/student/${student.student_id}`;
    return this.http.put(url, student);
  }

  
  deleteStudent(id: any) {
    const url = `${this.apiURL}/${id}`; // Use backticks for string interpolation
    return this.http.delete(url);
  }

  getStudentsByClass(classname: string): Observable<Student[]> {
    const url = `${this.apiURL}?class=${classname}`;
    return this.http.get<Student[]>(url);
  }

 

  getStudentsByParentId(idParent: number): Observable<Student[]> {
    const url = `${this.apiUrl}/student1/`;
    return this.http.get<Student[]>(url);
  }

  getCountOfStudents(): Observable<{ totalStudents: number }> {
    return this.http.get<{ totalStudents: number }>(this.apiURL1);
  }
}
