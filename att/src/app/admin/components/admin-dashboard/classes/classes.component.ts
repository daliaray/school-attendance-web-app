import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassTsService } from 'src/app/admin/service/class.ts.service';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  classDetailsForm = new FormGroup({
    classname: new FormControl()
  });
  classObj: Class = {
    classname: ''
  };
  allClass: Class[] = [];
  searchQuery: string = '';
  filteredClasses: Class[] = [];
  allStudents: Student[] = [];
  researchedClass: string = '';
  studentCountByClass: number = 0;

  constructor(private fb: FormBuilder, private classService: ClassTsService) {}

  ngOnInit(): void {
    this.classDetailsForm = this.fb.group({
      classname: ['', [Validators.required]]
    });

    this.getAllClasses();
  }

  addNewClass() {
    console.log(this.classDetailsForm.value);

    this.classObj.classname = this.classDetailsForm.value.classname;
    this.classService.addClass(this.classObj).subscribe(
      res => {
        console.log('Class added successfully');
        this.ngOnInit();
      },
      err => {
        console.log('Error occurred', err);
      }
    );
  }

  getAllClasses() {
    this.classService.getallclasses().subscribe(
      (res: Class[]) => {
        this.allClass = res;
        this.onSearch(); // Apply search filter when classes are fetched
      },
      err => {
        console.log(err);
      }
    );
  }

  onSearch() {
    // Apply the search filter only when searchQuery is not empty
    if (this.searchQuery.trim() !== '') {
      this.filteredClasses = this.allClass.filter((classItem: Class) => {
        return classItem.classname.toLowerCase().includes(this.searchQuery.toLowerCase());
        // Add other properties to filter on if needed
      });
    } else {
      // If searchQuery is empty, clear the filteredClasses
      this.filteredClasses = [];
    }
  }

  // Method to fetch students by class
  getStudentsByClass(classname: string) {
    this.classService.getStudentsByClass(classname).subscribe(
      (students: Student[]) => {
        this.allStudents = students; // Store the fetched students
        this.researchedClass = classname;
           // Calculate the number of students
           this.studentCountByClass = this.allStudents.length;
      },
      (error) => {
        console.log('Error fetching students by class:', error);
      }
    );
  }

  // Method to handle class research form submission
  onClassResearch() {
    this.getStudentsByClass(this.researchedClass);
  }
}
