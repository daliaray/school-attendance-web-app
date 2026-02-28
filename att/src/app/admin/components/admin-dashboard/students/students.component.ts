import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentTsService } from 'src/app/admin/service/student.ts.service';
import { Student } from 'src/app/models/student';
import { ClassTsService } from 'src/app/admin/service/class.ts.service';
import { Class } from 'src/app/models/class';
import { Parent } from 'src/app/models/parent';
import { ParentTsService } from 'src/app/admin/service/parent.ts.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements  OnInit {
  isButtonClicked = false;
  buttonBackgroundColor = 'transparent';

  studentDetailsForm = new FormGroup({
    student_id: new FormControl(),
    id_parent:new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    id_empreinte: new FormControl(),
    password: new FormControl(),
    email: new FormControl(),
    contact: new FormControl(),
    class: new FormControl(),
    sem: new FormControl()
  })

  studentObj: Student = {
    student_id: 0,
    id_parent:0,
    lastname: '',
    firstname: '',
    id_empreinte: 0,
    password: '',
    email: '',
    contact: 0,
    class: '',
    sem: ''
  }

  allStudents: Student[] = [];
  allClasses: Class[] = []; // Array to store all classes
  parentList: { id: number; fullName: string }[] = [];
  selectedParentId: number | null = null;
  constructor(private fb: FormBuilder, private studentService: StudentTsService,private classService: ClassTsService,private parentService: ParentTsService) {}

  ngOnInit(): void {
    this.studentDetailsForm = this.fb.group({
      student_id: ['', [Validators.required]],
      id_parent: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      id_empreinte: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      class: ['', [Validators.required]],
      sem: ['', [Validators.required]]
    });
    
    this.getAllStudents();
    this.getAllClasses(); // Fetch all classes during initialization
    this.getAllParents(); 
  }

  getAllParents() {
    this.parentService.getallparents().subscribe(
      (res: { id: number; lastname: string; firstname: string }[]) => {
        // Map the list of parents to the parentList array with concatenated names
        this.parentList = res.map(parent => ({
          id: parent.id,
          fullName: parent.lastname + ' ' + parent.firstname
        }));
      },
      err => {
        console.log(err);
      }
    );
  }

  addNewStudent() {
    console.log(this.studentDetailsForm.value);
    this.studentObj.id_parent = this.selectedParentId || this.studentDetailsForm.value.id_parent;
    this.studentObj.lastname = this.studentDetailsForm.value.lastname;
    this.studentObj.firstname = this.studentDetailsForm.value.firstname;
    this.studentObj.id_empreinte = this.studentDetailsForm.value.id_empreinte;
    this.studentObj.password = this.studentDetailsForm.value.password;
    this.studentObj.email = this.studentDetailsForm.value.email;
    this.studentObj.contact = this.studentDetailsForm.value.contact;
   // this.studentObj.class = this.studentDetailsForm.value.class;
   this.studentObj.class = this.studentDetailsForm.value.class; 
    this.studentObj.sem = this.studentDetailsForm.value.sem;

    this.studentObj.student_id = this.getStudentId();
    
    this.studentService.addStudent(this.studentObj).subscribe(
      res => {
        console.log('Student added successfully');
        this.ngOnInit();
      },
      err => {
        console.log('Error occurred', err);
      }
    );
  }

  getParentFullName(parentId: number): string {
    const parent = this.parentList.find(item => item.id === parentId);
    return parent ? parent.fullName : '';
  }
  


  getAllClasses() {
    this.classService.getallclasses().subscribe(
      (res: Class[]) => {
        this.allClasses = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getStudentId(): number {
    if (this.allStudents.length === 0) {
      return 1;
    }
    return this.allStudents[this.allStudents.length - 1].student_id + 1;
  }

  getAllStudents() {
    this.studentService.getallstudents().subscribe(
      res => {
        console.log(res);
        this.allStudents = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  getStudent(student : Student) {
    this.studentDetailsForm = this.fb.group({
      student_id: student.student_id,
      id_parent: student.id_parent,
      lastname: student.lastname,
      firstname: student.firstname,
      id_empreinte: student.id_empreinte,
      password: student.password,
      email: student.email,
      contact: student.contact,
      class: student.class,
      sem: student.sem
    });
  }

  updateStudent() {
    this.studentObj.student_id = this.studentDetailsForm.value.student_id;
    this.studentObj.id_parent = this.studentDetailsForm.value.id_parent;
    this.studentObj.lastname = this.studentDetailsForm.value.lastname;
    this.studentObj.firstname = this.studentDetailsForm.value.firstname;
    this.studentObj.id_empreinte = this.studentDetailsForm.value.id_empreinte;
    this.studentObj.password = this.studentDetailsForm.value.password;
    this.studentObj.email = this.studentDetailsForm.value.email;
    this.studentObj.contact = this.studentDetailsForm.value.contact;
    this.studentObj.class = this.studentDetailsForm.value.class;
    this.studentObj.sem = this.studentDetailsForm.value.sem;

    this.studentService.updateStudent(this.studentObj).subscribe(
      res => {
        console.log('Student updating successful');
        this.ngOnInit();
      },
      err => {
        console.log('Error occurred while updating student.', err);
      }
    );

  }
  deleteStudent(student:Student){
    if (window.confirm('Are you sure you want to delete '+student.lastname+' '+student.firstname+' ?')){
      this.studentService.deleteStudent(student.student_id).subscribe(res =>{
        console.log("Student deleted successfully.");
        this.ngOnInit();
      }, err => {
        console.log('Error occured while deleting student')
      }
        )
    }

  }

  FP1(){
    this.studentObj.student_id = this.studentDetailsForm.value.student_id;
    this.studentService.fingerprint1(this.studentObj).subscribe(res =>{

      console.log('fingerprint updated');
      this.ngOnInit();
    },
    err => {
      console.log('Error occurred while updating fingerprint.', err);
    }
  );
  this.isButtonClicked = true;
  this.buttonBackgroundColor = 'green';

  }

}


