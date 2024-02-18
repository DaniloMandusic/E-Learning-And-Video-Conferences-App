import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Tution } from '../models/tution';

@Component({
  selector: 'app-student-tutions',
  templateUrl: './student-tutions.component.html',
  styleUrls: ['./student-tutions.component.css']
})
export class StudentTutionsComponent implements OnInit{

  constructor(private userService: DataService, private sanitizer: DomSanitizer) {}

  allTutions: Tution[] = []
  passedTutions: Tution[] = []
  comingTutions: Tution[] = []

  currentUsername: null | string = ''

  ngOnInit(): void {
    this.userService.getTutions()
    .subscribe(
      (t: Tution[]) => {
        this.allTutions = t

        this.currentUsername = localStorage.getItem('username')

        console.log("curr username: " + this.currentUsername)

        console.log("allTutions: " + this.allTutions)

        for(let tution of this.allTutions){
          if(tution.student === this.currentUsername){
            
            let startTime = new Date(tution.date + 'T' + tution.time);
            let endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);
            if(tution.wantTwoClasses === 'true'){
              endTime.setHours(endTime.getHours() + 1);
            }
            tution.endTime = this.formatTime(endTime);


            if(tution.isDone === 'true'){
              this.passedTutions.push(tution)
            }
  
            if(tution.isDone === 'false'){
              this.comingTutions.push(tution)
            }
          }

        }

        console.log("comingTutions: " + this.comingTutions)
        console.log("passedTutions: " + this.passedTutions)

        this.comingTutions = this.sortTutions(this.comingTutions)
        this.passedTutions = this.sortTutions(this.passedTutions)

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

}
