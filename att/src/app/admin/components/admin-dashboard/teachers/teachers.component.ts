import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeacherTsService } from 'src/app/admin/service/teacher.ts.service';
import { Teacher } from 'src/app/models/teacher';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teacherDetailsForm = new FormGroup({
    teacher_id: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    password: new FormControl(),
    email: new FormControl(),
    subject: new FormControl(),
    contact: new FormControl(),
    adresse: new FormControl()
  })

  teacherObj: Teacher = {
    teacher_id: 0,
    lastname: '',
    firstname: '',
    password: '',
    email: '',
    subject: '',
    contact: 0,
    adresse: ''
  }

  allTeachers: Teacher[] = [];

  constructor(private fb: FormBuilder, private teacherService: TeacherTsService) {}

  ngOnInit(): void {
    this.teacherDetailsForm = this.fb.group({
      teacher_id: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      adresse: ['', [Validators.required]]
    });

    this.getAllTeachers();
  }

  addNewTeacher() {
    console.log(this.teacherDetailsForm.value);
    
    this.teacherObj.lastname = this.teacherDetailsForm.value.lastname;
    this.teacherObj.firstname = this.teacherDetailsForm.value.firstname;
    this.teacherObj.password = this.teacherDetailsForm.value.password;
    this.teacherObj.email = this.teacherDetailsForm.value.email;
    this.teacherObj.subject = this.teacherDetailsForm.value.subject;
    this.teacherObj.contact = this.teacherDetailsForm.value.contact;
    this.teacherObj.adresse = this.teacherDetailsForm.value.adresse;

    this.teacherObj.teacher_id = this.getTeacherId();
    
    this.teacherService.addTeacher(this.teacherObj).subscribe(
      res => {
        console.log('Teacher added successfully');
        this.ngOnInit();
      },
      err => {
        console.log('Error occurred', err);
      }
    );
  }

  getTeacherId(): number {
    if (this.allTeachers.length === 0) {
      return 1;
    }
    return this.allTeachers[this.allTeachers.length - 1].teacher_id + 1;
  }

  getAllTeachers() {
    this.teacherService.getallteachers().subscribe(
      res => {
        console.log(res);
        this.allTeachers = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getTeacher(teacher: Teacher) {
    this.teacherDetailsForm = this.fb.group({
      teacher_id: teacher.teacher_id,
      lastname: teacher.lastname,
      firstname: teacher.firstname,
      password: teacher.password,
      email: teacher.email,
      subject: teacher.subject,
      contact: teacher.contact,
      adresse: teacher.adresse
    });
  }

  updateTeacher() {
    this.teacherObj.teacher_id = this.teacherDetailsForm.value.teacher_id;
    this.teacherObj.lastname = this.teacherDetailsForm.value.lastname;
    this.teacherObj.firstname = this.teacherDetailsForm.value.firstname;
    this.teacherObj.password = this.teacherDetailsForm.value.password;
    this.teacherObj.email = this.teacherDetailsForm.value.email;
    this.teacherObj.subject = this.teacherDetailsForm.value.subject;
    this.teacherObj.contact = this.teacherDetailsForm.value.contact;
    this.teacherObj.adresse = this.teacherDetailsForm.value.adresse;

    this.teacherService.updateTeacher(this.teacherObj).subscribe(
      res => {
        console.log('Teacher updating successful');
        this.ngOnInit();
      },
      err => {
        console.log('Error occurred while updating teacher.', err);
      }
    );

  }
  deleteTeacher(teacher:Teacher){
    if (window.confirm('Are you sure you want to delete '+teacher.lastname+' '+teacher.firstname+' ?')){
      this.teacherService.deleteTeacher(teacher.teacher_id).subscribe(res =>{
        console.log("Teacher deleted successfully.");
        this.ngOnInit();
      }, err => {
        console.log('Error occured while deleting teacher')
      }
        )
    }

  }

}
