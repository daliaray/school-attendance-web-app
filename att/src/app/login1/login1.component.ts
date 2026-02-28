import { Component } from '@angular/core';
import { AdminauthTsService } from '../service/adminauth.ts.service';
import { FormControl, FormGroup, Validators , FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-login1',
  templateUrl: './login1.component.html',
  styleUrls: ['./login1.component.css']
})
export class Login1Component {
  loginForm1!: FormGroup;

  constructor( private authService1:AdminauthTsService , private formBuilder: FormBuilder ){}
    ngOnInit(): void {
      this.loginForm1! = this.createFormGroup();
      
      this.loginForm1 = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9+_.-]+@gmail.com')]],
        password: ['', Validators.required]
      });
    
      
    }
    createFormGroup(): FormGroup {
      return new FormGroup({
      email: new FormControl ("", [Validators.required, Validators.email]), 
      password: new FormControl("", [Validators.required, Validators.minLength(3)]),
    });
  }


  login1():void {
    this.authService1.login(this.loginForm1!.value.email, this.loginForm1!.value.password).subscribe();
   

    }

}

