import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent {
  username: string | null = ''
  currentUser: User = new User()
  users: User[] = []

  userGrade: number = 0

  availableGrades: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  registrationMessage: string = '';
  selectedFile: File = new File(["assets\\Screenshot 2024-01-07 143614.jpg"], "profilePicture");
  selectedFileUrl: string = URL.createObjectURL(this.selectedFile);

  constructor(private userService: DataService, private sanitizer: DomSanitizer, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe(
      (u: User[]) => {
        this.users = u;
        console.log('Received users:', u);

        for(let user of this.users){
          let image = "data:image/jpg;base64," + user.profilePictureUrl
          user.image = this.sanitizer.bypassSecurityTrustUrl(image);
        }

        //localStorage.setItem('username', 'danilo7')
        this.username = localStorage.getItem('username');

      },
      (error) => {
        console.error('Error fetching users:', error);
      },
      () => {
        for(let user of this.users){
          if(user.username === this.username){
            this.currentUser = user
          }
        }

        this.selectedFileUrl = this.currentUser.image
        this.selectedFile = this.currentUser.profilePicture

        console.log('current user: ' + this.currentUser.username)

        this.userGrade = parseFloat(this.currentUser.grade.toString());
      }
    );
  }

  onSubmit(registrationForm: NgForm): void {
    console.log("this.username = " + this.username)
    console.log("reg.username = " + registrationForm.value.username)

    if(this.username !== registrationForm.value.username){
      for(let user of this.users){
        if(user.username === registrationForm.value.username){
          this.registrationMessage = 'username allready exists';
          return
        }
      }
    }

    if(registrationForm.value.phoneNumber){
      const regex = /^[0-9]+$/;
    
    
      if(!regex.test(registrationForm.value.phoneNumber)){
        this.registrationMessage = 'bad phone number';
        return
      }

    }

    if (!this.isEmailValid(registrationForm.value.email)){
      this.registrationMessage = 'bad email';
      return
    }

    // if (!this.isPasswordValid(registrationForm.value.password)){
    //   this.registrationMessage = 'bad password';
    //   return
    // }

    // let formGrade = parseFloat(registrationForm.value.grade.toString());

    // console.log("user grade " + this.userGrade)
    // console.log("form grade " + formGrade)

    // if(this.currentUser.schoolType === 'elementary'){
    //   console.log("in elementary")

    //   if(this.userGrade === 8){
    //     console.log("in 8")

    //     if(formGrade !== 8 && formGrade !== 1){
    //       this.registrationMessage = "can only switch from 8 to 1"
    //       return
    //     }
    //    }else{


    //     if(this.userGrade !== formGrade){
    //       if(this.userGrade !== formGrade-1){
    //         console.log("in err 1")
  
    //         this.registrationMessage = "can only switch grades incrementally"
    //         return
    //       }
    //     }
    //   }



    // } else {
    //   console.log("in inc")

    //   if(this.userGrade !== formGrade){
    //     if(this.userGrade !== formGrade-1){
    //       console.log("in err 1")

    //       this.registrationMessage = "can only switch grades incrementally"
    //       return
    //     }
    //   }

    // }



    if (
      registrationForm.value.username 
      // registrationForm.value.password &&
      // registrationForm.value.securityQuestion &&
      // registrationForm.value.securityAnswer &&
      // registrationForm.value.name &&
      // registrationForm.value.surname &&
      // registrationForm.value.gender &&
      // registrationForm.value.address &&
      // registrationForm.value.phoneNumber &&
      // registrationForm.value.email &&
      // registrationForm.value.schoolType &&
      //registrationForm.value.grade
    ) {
      

      // if(this.selectedFileUrl === 'no file'){
      //   this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
      // }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('username', registrationForm.value.username);  
      formData.append('password', registrationForm.value.password);
      formData.append('securityQuestion', registrationForm.value.securityQuestion);
      formData.append('securityAnswer', registrationForm.value.securityAnswer);
      formData.append('name', registrationForm.value.name);
      formData.append('surname', registrationForm.value.surname);
      formData.append('gender', registrationForm.value.gender);
      formData.append('address', registrationForm.value.address);
      formData.append('phoneNumber', registrationForm.value.phoneNumber);
      formData.append('email', registrationForm.value.email);
      formData.append('schoolType', registrationForm.value.schoolType);
      //formData.append('grade', registrationForm.value.grade.toString());
      formData.append('profilePicture', registrationForm.value.profilePicture);
      formData.append('profilePictureUrl', registrationForm.value.profilePictureUrl);
      formData.append('profileType', this.currentUser.profileType);
      formData.append('profileStatus', this.currentUser.profileStatus);


      this.userService.addUser(formData).subscribe((resp) => {
        console.log("poslao post")
      })
      this.http.post('http://localhost:3000/users/addUser', formData)
      .subscribe(response => {
        console.log('Image uploaded successfully', response);
      }, error => {
        console.error('Error uploading image', error);
      });


      this.registrationMessage = 'should change parameters';
      //this.router.navigate(['/registerTeacher']);
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

  allowedTypes: string[] = ['.jpg', '.png'];

  private validateFile(file: File): void {
    // if (this.allowedTypes.indexOf(file.type) === -1) {
    //   this.registrationMessage =  'Invalid file type. Please upload a JPG or PNG image.'
    //   return;
    // }

    const fileName = file.name.toLowerCase();
    console.log(fileName)
    if (!this.allowedTypes.some(ext => fileName.endsWith(ext))) {
      //alert('Invalid file type. Please upload a JPG or PNG image.');
      this.registrationMessage =  'Invalid file type. Please upload a JPG or PNG image.'
      return;
    }

    const img = new Image();
    img.src = this.selectedFileUrl
    img.onload = (e: any) => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        this.registrationMessage = `Invalid dimensions. Please upload an image between 100x100 and 300x300 pixels.`
        return;
      }
    };
    
  }

  onSchoolTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const schoolType = target.value;
  
    if (schoolType && schoolType !== 'elementary') {
      
      this.availableGrades = [1, 2, 3, 4];
    } else {
      
      this.availableGrades = [1, 2, 3, 4, 5, 6, 7, 8];
    }
  }

  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*]).{6,10}$/;
    return passwordRegex.test(password);
  }

  isEmailValid(email: string): boolean {
   
    return /\S+@\S+\.\S+/.test(email);
  }
}
