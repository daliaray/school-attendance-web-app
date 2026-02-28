import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable , BehaviorSubject} from "rxjs";
import { first, catchError, tap } from "rxjs/operators";
import { ErrorHandlerTsService } from './error-handler.ts.service';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AdminauthTsService {
  private url="http://localhost:3000/login";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
    userId!: Pick<User, "id">;
   // Use BehaviorSubject for username and initialize it with an empty string
    username$ = new BehaviorSubject<string>('');
  
    httpOptions: { headers: HttpHeaders } = { 
    headers: new HttpHeaders({ "Content-Type": "application/json" }), 
  };
  

  constructor(private http: HttpClient, 
    private errorHandlerService:ErrorHandlerTsService,
    private router: Router) { }
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
       

        //this.isUserLoggedIn$.next(true);
        //this.router.navigate(["admin/admin-dashboard"]);
        this.isUserLoggedIn$.next(true);

        const role = tokenObject.role; // Extract the role from the response
        if (role === 'admin') {
          this.router.navigate(["admin/admin-dashboard"]);
        } else if (role === 'teacheruser') {
          this.router.navigate(["teacher/teach"]); // Replace with actual teacher component route
        } else if (role === 'parentuser') {
          this.router.navigate(['/parente/parentdashboard']); // Replace with actual parent component route
        }else {
          // Handle unknown roles or default redirection
          this.router.navigate(["default-route"]); // Replace with a default route
        }
      

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

        isUserLoggedIn(): boolean {
          const token = localStorage.getItem("token");
          return !!token; // Double exclamation converts the value to a boolean
        }
        

         
     
       

}

