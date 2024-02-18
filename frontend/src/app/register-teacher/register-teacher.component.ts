import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Classes } from '../models/classes';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './register-teacher.component.html',
  styleUrls: ['./register-teacher.component.css']
})
export class RegisterTeacherComponent implements OnInit{
  registrationMessage: string = ''
  selectedFile: File = new File(["assets\\Screenshot 2024-01-07 143614.jpg"], "profilePicture");
  selectedFileUrl: string = ''

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }

  allClasses: Classes[] = []
  approvedClasses: Classes[] = []
  ngOnInit(): void {
    this.dataService.getClasses().subscribe((c)=>{
      this.allClasses = c

      for(let cl of this.allClasses){
        if(cl.status === 'approved'){
          this.approvedClasses.push(cl)
        }
      }

    })

  }

  onSubmit(registrationForm: NgForm): void {
    
      //console.log("tg" + registrationForm.value.teachingGroup + " hf" + registrationForm.value.heardFrom + " cv" + registrationForm.value.cv)

    if (
      registrationForm.value.teachingGroup &&
      registrationForm.value.heardFrom &&
      this.selectedFile
    ) {
      

      // if(this.selectedFileUrl === 'no file'){
      //   this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
      // }
      const formValues = registrationForm.value;

      let checkedCheckboxes = Object.keys(formValues)
      .filter(key => formValues[key] && key.startsWith('predmet') && formValues[key] === true);

      checkedCheckboxes = checkedCheckboxes.map(str => str.substring(8))

      console.log('Checked checkboxes:', checkedCheckboxes);

      let classes: string = ''

      for (let c of checkedCheckboxes){
        classes = classes + "|"
        classes = classes + c
      }

      if(registrationForm.value.somethingElseClass){
        classes = classes + "|"
        classes = classes + registrationForm.value.somethingElseClass

        let formData = new FormData()
        formData.append("name", registrationForm.value.somethingElseClass)
        formData.append("status", "not approved")

        this.dataService.addClass(formData)
      }

      classes = classes.substring(1)
      console.log(classes)

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('cv', registrationForm.value.cv);
      formData.append('cvUrl', registrationForm.value.cvUrl);
      formData.append('heardFrom', registrationForm.value.heardFrom)
      formData.append('teachingGroup', registrationForm.value.teachingGroup)
      formData.append('classes', classes)

      const username = localStorage.getItem('username');
      if(username !== null){
        formData.append('username', username)
      }

      
      this.http.post('http://localhost:3000/users/changeTeacher', formData)
      .subscribe(response => {
        console.log('File uploaded successfully', response);
      }, error => {
        console.error('Error uploading file', error);
      });

      this.registrationMessage = 'should go to mainpage';
      if(username)
        localStorage.setItem('username', username)
      this.router.navigate(['/teacherProfile']);
    } else {
      
      this.registrationMessage = 'All parameters must be present.';
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;

    
    if (this.selectedFile) {
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);

      this.validateFile(this.selectedFile);
    }
  }

  allowedTypes: string[] = ['.pdf'];

  private validateFile(file: File): void {
    // if (this.allowedTypes.indexOf(file.type) === -1) {
    //   this.registrationMessage =  'Invalid file type. Please upload a JPG or PNG image.'
    //   return;
    // }

    const fileName = file.name.toLowerCase();
    console.log(fileName)
    if (!this.allowedTypes.some(ext => fileName.endsWith(ext))) {
      //alert('Invalid file type. Please upload a JPG or PNG image.');
      this.registrationMessage =  'Invalid file type. Please upload a PDF file.'
      return;
    }

    // const img = new Image();
    // img.src = this.selectedFileUrl
    // img.onload = (e: any) => {
    //   if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
    //     this.registrationMessage = `Invalid dimensions. Please upload an image between 100x100 and 300x300 pixels.`
    //     return;
    //   }
    // };
    
  }

}
