import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { User } from '../models/user';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: DataService, private sanitizer: DomSanitizer) {}

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
}
