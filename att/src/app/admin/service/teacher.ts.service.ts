import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable , BehaviorSubject} from "rxjs";
import { first, catchError, tap } from "rxjs/operators";
import {Teacher} from 'src/app/models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherTsService {

  apiURL="http://localhost:3000/teacher";
  apiURL1="http://localhost:3000/teachercount";
  apiURL2="http://localhost:3000/teacher1";

  constructor(private http : HttpClient) { }

  addTeacher(doc:Teacher){
    return this.http.post<Teacher[]>(this.apiURL,doc);
  }

  getallteachers(){
  return this.http.get<Teacher[]>(this.apiURL);}

 
  updateTeacher(teacher: Teacher): Observable<any> {
    const url = `http://localhost:3000/teacher/${teacher.teacher_id}`;
    return this.http.put(url, teacher);
  }

  
  deleteTeacher(id: any) {
    const url = `${this.apiURL}/${id}`; // Use backticks for string interpolation
    return this.http.delete(url);
  }
  getCountOfteacher(): Observable<{ totalTeacher: number }> {
    return this.http.get<{ totalTeacher: number }>(this.apiURL1);
  }


  getallteacher(){
    return this.http.get<Teacher[]>(this.apiURL2);}
}
