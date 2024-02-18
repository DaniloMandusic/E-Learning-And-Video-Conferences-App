import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { DataService } from '../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  registrationMessage: string = ''
  
  users: User[] = [];

  constructor(private userService: DataService, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe(
      (u: User[]) => {
        this.users = u;
        console.log('Received users:', u);

        // for(let user of this.users){
        //   let blob:any = new Blob([user.profilePicture])
        //   console.log(user.profilePicture)
        //   console.log(blob)
        //   user.profilePictureUrl = URL.createObjectURL(blob);
        //   user.image = this.sanitizer.bypassSecurityTrustUrl(user.profilePictureUrl);
        // }
        for(let user of this.users){
          let image = "data:image/jpg;base64," + user.profilePictureUrl
          user.image = this.sanitizer.bypassSecurityTrustUrl(image);
        }

      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onSubmit(registrationForm: NgForm): void {
    let username = registrationForm.value.username
    let password = registrationForm.value.password

    if(!username || !password){
      this.registrationMessage = "all fields must be filled"
      return
    }
    
    for(let user of this.users){
      if(user.username === username){
        if(user.password === password){

          localStorage.setItem('username', user.username)
          if(user.profileType==='teacher')
            if(user.profileStatus === 'not approved'){
              this.registrationMessage = "profile not approved"
              return
            }
            this.router.navigate(['/teacherProfile'])
          if(user.profileType==='student')
            this.router.navigate(['/studentProfile'])
          if(user.profileType==='admin')
            this.router.navigate(['/admin'])
          this.registrationMessage = "successfull login"
          
          return
        }else{
          this.registrationMessage = "wrong password"
          return
        }

      }
    }

    this.registrationMessage = "user does not exist"
    return
  }

}
