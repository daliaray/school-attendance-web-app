import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Parent } from 'src/app/models/parent';

import { Observable , BehaviorSubject} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ParentTsService {
  apiURL="http://localhost:3000/parent";
  

  constructor(private http : HttpClient) { }
  getallparents(){
    return this.http.get<Parent[]>(this.apiURL);}
  
}
