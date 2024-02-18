import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Tution } from '../models/tution';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher-tutions',
  templateUrl: './teacher-tutions.component.html',
  styleUrls: ['./teacher-tutions.component.css']
})
export class TeacherTutionsComponent implements OnInit{

  //constructor(private userService: DataService, private sanitizer: DomSanitizer) {}
  constructor(private userService: DataService, private sanitizer: DomSanitizer, private http: HttpClient) { }


  allTutions: Tution[] = []
  confirmedTutions: Tution[] = []
  requestedTutions: Tution[] = []
  
  currentUsername: null | string = ''

  ngOnInit(): void {
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


            if(tution.isConfirmed === 'true'){
              if(this.isDateInNextThreeDays(tution.date)){
                this.confirmedTutions.push(tution)
              count5 += 1

              if(count5 >= 5){
                break
              }
              }
              
            }

            if(tution.isConfirmed === 'false'){
              this.requestedTutions.push(tution)
            }
  
          }

        }

        console.log("confirmedTutions: " + this.confirmedTutions)

        this.confirmedTutions = this.sortTutions(this.confirmedTutions)
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  sortTutions(tutions: any[]): any[] {
    return tutions.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA.getTime() - dateB.getTime();
    });
  }

  formatTime(date: Date): string {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    
    hours = hours.length === 1 ? '0' + hours : hours;
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
  }

  isDateInNextThreeDays(dateString: string): boolean {
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);
  
    const dateToCheck = new Date(dateString);
    
    return dateToCheck >= currentDate && dateToCheck <= threeDaysFromNow;
  }

  accept(tution: Tution){
    const formData = new FormData();
    
    formData.append('student', tution.student);
    formData.append('professor', tution.professor);

    formData.append('class', tution.selectedClass);
    formData.append('date', tution.date);
    formData.append('time', tution.time);
    formData.append('additionalInfo', tution.additionalInfo);
    formData.append('wantTwoClasses', tution.wantTwoClasses)
    formData.append('isConfirmed', 'true')
    formData.append('declineComment', '')
    
    this.http.post('http://localhost:3000/users/confirmTution', formData)
    .subscribe(response => {
      console.log('Image uploaded successfully', response);
    }, error => {
      console.error('Error uploading image', error);
    });
  }

  decline(tution: Tution){
    const formData = new FormData();
    
    formData.append('student', tution.student);
    formData.append('professor', tution.professor);

    formData.append('class', tution.selectedClass);
    formData.append('date', tution.date);
    formData.append('time', tution.time);
    formData.append('additionalInfo', tution.additionalInfo);
    formData.append('wantTwoClasses', tution.wantTwoClasses)
    formData.append('isConfirmed', 'declined')
    formData.append('declineComment', tution.declineComment)
    
    this.http.post('http://localhost:3000/users/confirmTution', formData)
    .subscribe(response => {
      console.log('Image uploaded successfully', response);
    }, error => {
      console.error('Error uploading image', error);
    });
  }

}
