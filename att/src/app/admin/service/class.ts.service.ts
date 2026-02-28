
import { Class } from './../../models/class';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Student } from './../../models/student';




@Injectable({
  providedIn: 'root'
})
export class ClassTsService {
  apiURL="http://localhost:3000/class";
  apiURL1 = 'http://localhost:3000/student';
  apiURL2 = 'http://localhost:3000/classcount';
  constructor(private http : HttpClient) {}
    addClass(doc:Class){
      return this.http.post<Class[]>(this.apiURL,doc);
    }
    
   

   getallclasses(){
    return this.http.get<Class[]>(this.apiURL);}

    getStudentsByClass(classname: string): Observable<Student[]> {
      const url = `${this.apiURL1}/${classname}`;
      return this.http.get<Student[]>(url);
    }
    getCountOfclass(): Observable<{ totalClass: number }> {
      return this.http.get<{ totalClass: number }>(this.apiURL2);
    }
   }