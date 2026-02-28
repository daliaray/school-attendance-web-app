import { Component } from '@angular/core';

import { AdminAuthService } from '../../service/admin-auth.service';

import { FormControl, FormGroup, Validators , FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-loginn',
  templateUrl: './loginn.component.html',
  styleUrls: ['./loginn.component.css']
})
export class LoginnComponent {
  loginForm!: FormGroup;

  constructor( private authService:AdminAuthService , private formBuilder: FormBuilder ){}
    ngOnInit(): void {
      this.loginForm! = this.createFormGroup();
      
      this.loginForm = this.formBuilder.group({
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


  login():void {
    this.authService.login(this.loginForm!.value.email, this.loginForm!.value.password).subscribe();
   
    }


   
}
