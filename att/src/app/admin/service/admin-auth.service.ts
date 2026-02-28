import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable , BehaviorSubject} from "rxjs";
import { first, catchError, tap } from "rxjs/operators";
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private url="http://localhost:3000/login";


isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: Pick<User, "id">;
 // Use BehaviorSubject for username and initialize it with an empty string
  username$ = new BehaviorSubject<string>('');

  httpOptions: { headers: HttpHeaders } = { 
  headers: new HttpHeaders({ "Content-Type": "application/json" }), 
};

  constructor(
  
   private http: HttpClient, 
    private errorHandlerService:ErrorHandlerService,
    private router: Router
  ){}
  //check login
  login(email: Pick<User, "email">,
  password: Pick<User, "password">
  ): Observable<{ 
    token: string; 
    userId: Pick<User, "id">;
    username: string; 
    
   }> {
    return this.http.post(`${this.url}`,{ email,password },this.httpOptions).pipe(
      first(),
  
      tap((tokenObject: any) => {
        this.userId! = tokenObject.userId!;
        this.username$.next(tokenObject.username);

        localStorage.setItem("token", tokenObject.token);
       

        this.isUserLoggedIn$.next(true);
        this.router.navigate(["admin/admin-dashboard"]);
      

      }),
      catchError(
        this.errorHandlerService.handleError<{
          token: string;
          userId: Pick<User, "id">;
          username: string;
        }>("login")
        
      )
      );
  
        }

        //ifadmin login
         isAdminLoggedIn(): boolean {
          const token = localStorage.getItem("token");
          if(token){
            return true;
          }
          return false;}

         
     

       

}