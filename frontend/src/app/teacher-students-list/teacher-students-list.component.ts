import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/user';
import { DataService } from '../services/data.service';
import { Tution } from '../models/tution';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher-students-list',
  templateUrl: './teacher-students-list.component.html',
  styleUrls: ['./teacher-students-list.component.css']
})
export class TeacherStudentsListComponent implements OnInit{
  
  allUsers: User[] = [];
  allTutions: Tution[] = []

  teachersStudents: User[] = []
  currentTutions: Tution[] = []

  currentUsername: null | string = ''

  constructor(private userService: DataService, private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe(
      (u: User[]) => {
        this.allUsers = u;
        console.log('Received users:', u);

        // for(let user of this.users){
        //   let blob:any = new Blob([user.profilePicture])
        //   console.log(user.profilePicture)
        //   console.log(blob)
        //   user.profilePictureUrl = URL.createObjectURL(blob);
        //   user.image = this.sanitizer.bypassSecurityTrustUrl(user.profilePictureUrl);
        // }
        for(let user of this.allUsers){
          let image = "data:image/jpg;base64," + user.profilePictureUrl
          user.image = this.sanitizer.bypassSecurityTrustUrl(image);
        }

      },
      (error) => {
        console.error('Error fetching users:', error);
      },
      () => {
        this.userService.getTutions()
        .subscribe(
          (t: Tution[]) => {
            this.allTutions = t

            this.currentUsername = localStorage.getItem('username')

            console.log("curr username: " + this.currentUsername)

            console.log("allTutions: " + this.allTutions)

            let count5 = 0

            for(let tution of this.allTutions){
              if(tution.professor === this.currentUsername){
                
                let startTime = new Date(tution.date + 'T' + tution.time);
                let endTime = new Date(startTime);
                endTime.setHours(endTime.getHours() + 1);
                if(tution.wantTwoClasses === 'true'){
                  endTime.setHours(endTime.getHours() + 1);
                }
                tution.endTime = this.formatTime(endTime);


                // if(tution.isConfirmed === 'true'){
                //   if(this.isDateInNextThreeDays(tution.date)){
                //     this.confirmedTutions.push(tution)
                //   count5 += 1

                //   if(count5 >= 5){
                //     break
                //   }
                //   }
                  
                // }

                // if(tution.isConfirmed === 'false'){
                //   this.requestedTutions.push(tution)
                // }
      
              }

            }

          },
          (error) => {
            console.error('Error fetching users:', error);
          },
          () => {
            for(let user of this.allUsers){
              for(let tution of this.allTutions){
                if(user.username === tution.student){
                  if(!this.teachersStudents.includes(user))
                    if(tution.professor === this.currentUsername)
                      this.teachersStudents.push(user)
                  break
                }
              }
            }
            console.log("teachersStudents: " + this.teachersStudents)
          }
        );

        }
      );
  }

  formatTime(date: Date): string {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    
    hours = hours.length === 1 ? '0' + hours : hours;
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
  }

  seeTutions(user: User){
    this.currentTutions = []

    for(let tution of this.allTutions){
      if(tution.student === user.username){
        this.currentTutions.push(tution)
      }
    }

  }

  onScoreChange(mark: string): void{
    
  }

  // tutionScore: string = ''
  // tutionComment: string = ''

  setScore(tution: Tution){
    const formData = new FormData();
    formData.append('selectedClass', tution.selectedClass);
    formData.append('date', tution.date);
    formData.append('time', tution.time);
    formData.append('additionalInfo', tution.additionalInfo);
    formData.append('wantTwoClasses', tution.wantTwoClasses);
    formData.append('student', tution.student);
    formData.append('professor', tution.professor);
    formData.append('isConfirmed', tution.isConfirmed);
    formData.append('declineComment', tution.declineComment);

    formData.append('score', tution.score);
    formData.append('comment', tution.comment);

    formData.append('isScored', "true");

    this.userService.changeTution(formData).subscribe((resp) => {
      console.log("poslao post")
    })
    this.http.post('http://localhost:3000/users/confirmTution', formData)
    .subscribe(response => {
      console.log('Image uploaded successfully', response);
    }, error => {
      console.error('Error uploading image', error);
    });
  }

}
