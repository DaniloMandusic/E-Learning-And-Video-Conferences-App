import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  registrationMessage: string = ''
  users: User[] = [];

  constructor(private router: Router, private userService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }

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

        console.log(this.users)

      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onSubmit(registrationForm: NgForm): void {
    if (
      registrationForm.value.username &&
      registrationForm.value.oldPassword &&
      registrationForm.value.newPassword &&
      registrationForm.value.newPasswordConfirmation
    ) {
      
      let u: User | null = null

      for(let user of this.users){
        if(user.username === registrationForm.value.username){
          u = user
        }
      }

      if(!u){
        this.registrationMessage = "username does not exist"
        return
      }

      if(!(u.password === registrationForm.value.oldPassword)){
        this.registrationMessage = "old password wrong"
        return
      }

      if(!(registrationForm.value.newPasswordConfirmation === registrationForm.value.newPassword)){
        this.registrationMessage = "new pass and new pass confirm are different"
        return
      }

      let formData = new FormData()
      formData.append('username', registrationForm.value.username);
      formData.append('newPassword', registrationForm.value.newPassword);

      this.http.post('http://localhost:3000/users/changePassword', formData)
      .subscribe(response => {
        console.log('pass change successfully', response);
      }, error => {
        console.error('Error uploading image', error);
      });

      this.registrationMessage = "should change pass in database"

    } else{
      this.registrationMessage = "all parameters must be present"
      return
    }
  }
}
