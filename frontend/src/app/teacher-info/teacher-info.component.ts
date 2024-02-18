import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { User } from '../models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Tution } from '../models/tution';

@Component({
  selector: 'app-teacher-info',
  templateUrl: './teacher-info.component.html',
  styleUrls: ['./teacher-info.component.css']
})
export class TeacherInfoComponent implements OnInit {
  currentUser: User = new User
  currentProfessor: User = new User

  username: string = '';
  professorUsername: string = '';

  classes: string[] = []

  constructor(private route: ActivatedRoute, private userService: DataService, private sanitizer: DomSanitizer, private http: HttpClient) { }

  professorsTutions: Tution[] = []

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.professorUsername = params['username'];
      
    })

    this.userService.getUsers()
    .subscribe(
      (u: User[]) => {
        let users = u;
        console.log('Received users:', u);

        let username = localStorage.getItem("username")
        console.log('user from localStroage: ' + username)

        for(let user of users){
          let image = "data:image/jpg;base64," + user.profilePictureUrl
          user.image = this.sanitizer.bypassSecurityTrustUrl(image);

          if(user.username === username){
            this.currentUser = user
            console.log('curr user found: ' + username)
          }

          if(user.username === this.professorUsername){
            this.currentProfessor = user
            console.log('curr prof found: ' + this.professorUsername)
          }
        }

      },
      (error) => {
        console.error('Error fetching users:', error);
      },() => {
        this.classes = this.currentProfessor.classes.split("|")
        //this.classes.pop()

        if (this.classes.length === 1) {
          this.selectedClass = this.classes[0];
          this.isDropdownDisabled = true;
        }

        console.log("classes: " + this.classes)

        this.userService.getTutions().subscribe((t)=>{
          for(let tution of t){
            if(tution.professor === this.currentProfessor.username){
              this.professorsTutions.push(tution)
            }
          }
        })
      });

  }

  selectedClass: string = '';
  selectedDate: null | Date = null;
  selectedTime: string = '';
  additionalInfo: string = '';
  wantTwoClasses: boolean = false;
  isDropdownDisabled: boolean = false;

  registrationMessage: string = ''

  submitForm() {
    
    console.log("Form submitted with data:", {
      selectedClass: this.selectedClass,
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      additionalInfo: this.additionalInfo,
      wantTwoClasses: this.wantTwoClasses
    });

    if(!this.selectedClass){
      this.registrationMessage = "class not selected"
      return
    }

    if(!this.selectedDate){
      this.registrationMessage = "date not selected"
      return
    }

    if(!this.selectedTime){
      this.registrationMessage = "time not selected"
      return
    }

    if(!this.additionalInfo){
      this.registrationMessage = "additionalInfo not selected"
      return
    }

    let tmpDate = this.selectedDate
    const [hours1, minutes1] = this.selectedTime.split(':').map(Number);
    tmpDate.setHours(hours1, minutes1)

    for(let tution of this.professorsTutions){
      if(tution.date === this.selectedDate.toString()){
        let d2 = new Date()
        const [hours2, minutes2] = tution.time.split(':').map(Number);
        d2.setHours(hours2, minutes2)

        let d3 = new Date()
        const [hours3, minutes3] = tution.endTime.split(':').map(Number);
        d3.setHours(hours3, minutes3)

        if( d2.getTime() < tmpDate.getTime() && tmpDate.getTime() < d3.getTime()){
          this.registrationMessage = "time allready booked"
          return
        }
        
      }
    }

    const formData = new FormData();
    
    formData.append('student', this.currentUser.username);
    formData.append('professor', this.currentProfessor.username);

    formData.append('class', this.selectedClass);
    formData.append('date', this.selectedDate.toString());
    formData.append('time', this.selectedTime);
    formData.append('additionalInfo', this.additionalInfo);
    formData.append('wantTwoClasses', this.wantTwoClasses.toString())
    
    this.http.post('http://localhost:3000/users/addTution', formData)
    .subscribe(response => {
      console.log('Image uploaded successfully', response);
    }, error => {
      console.error('Error uploading image', error);
    });

    this.registrationMessage = "should book tution"
  }

}
