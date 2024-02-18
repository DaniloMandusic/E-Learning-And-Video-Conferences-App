import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/user';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Classes } from '../models/classes';
import { Tution } from '../models/tution';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  allClasses: Classes[] = []
  classRequests: Classes[] = []
  allTutions: Tution[] = []
  currentUser: User = new User()
  registrationMessage: string = '';
  selectedFile: File = new File(["assets\\Screenshot 2024-01-07 143614.jpg"], "profilePicture");
  selectedFileUrl: string = URL.createObjectURL(this.selectedFile);
  username: string | null = ''
  availableGrades: number[] = [1, 2, 3, 4, 5, 6, 7, 8];


  showTeacherAccount: boolean = false
  teacherRequests: User[] = []

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

          if(user.profileType === 'teacher' && user.profileStatus === 'not approved'){
            this.teacherRequests.push(user)
          }

        }

      },
      (error) => {
        console.error('Error fetching users:', error);
      }, () => {
        this.userService.getClasses()
        .subscribe(
          (c: Classes[]) => {
            this.allClasses = c;
            console.log('Received classes:', c);

            for(let cl of this.allClasses){
              if(cl.status === 'not approved'){
                this.classRequests.push(cl)
              }
            }

          },
          (error) => {
            console.error('Error fetching users:', error);
          }, () => {
            this.userService.getTutions()
            .subscribe(
              (t: Tution[]) => {
                this.allTutions = t;
                console.log('Received tutions:', t);

                this.createPieChart();
                this.createBarChart()
                this.createHistogramChart()
                this.createLineChart()

              },
              (error) => {
                console.error('Error fetching users:', error);
              })

          }
        );
      }
    );

    
  }

  showUserForChange(user: User){
    this.showTeacherAccount = true

    this.currentUser = user
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

    


    if (
      
      registrationForm.value.grade
    ) {
      
      const formData = new FormData();
      //formData.append('file', this.selectedFile);
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
      formData.append('grade', registrationForm.value.grade.toString());
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

  approve(user: User){
    const formData = new FormData();
      //formData.append('file', this.selectedFile);
      formData.append('username', user.username);  
      formData.append('password', user.password);
      formData.append('securityQuestion', user.securityQuestion);
      formData.append('securityAnswer', user.securityAnswer);
      formData.append('name', user.name);
      formData.append('surname', user.surname);
      formData.append('gender', user.gender);
      formData.append('address', user.address);
      formData.append('phoneNumber', user.phoneNumber);
      formData.append('email', user.email);
      formData.append('schoolType', user.schoolType);
      formData.append('profilePicture', user.profilePicture);
      formData.append('profilePictureUrl', user.profilePictureUrl);
      formData.append('profileType', user.profileType);
      formData.append('profileStatus', 'approved');


      this.userService.addUser(formData).subscribe((resp) => {
        console.log("poslao post")
      })
      this.http.post('http://localhost:3000/users/addUser', formData)
      .subscribe(response => {
        console.log('Image uploaded successfully', response);
      }, error => {
        console.error('Error uploading image', error);
      });
  }

  className: string = ''

  addClass(className: string){
    const formData = new FormData();
    
    formData.append('name', className);
    formData.append('status', 'approved');


    this.userService.addUser(formData).subscribe((resp) => {
      console.log("poslao post")
    })
    this.http.post('http://localhost:3000/users/addClass', formData)
    .subscribe(response => {
      console.log('Image uploaded successfully', response);
    }, error => {
      console.error('Error uploading image', error);
    });
  }


  chart: any

  createPieChart(): void {
    let maleStudents = 0
    let maleTeachers = 0
    let femaleStudents = 0
    let femaleTeachers = 0

    for(let u of this.users){
      if(u.profileType === 'teacher'){
        if (u.gender === 'male'){
          maleTeachers += 1
        } else {
          femaleTeachers += 1
        }
      }else{
        if (u.gender === 'male'){
          maleStudents += 1
        } else {
          femaleStudents += 1
        }
      }
    }

    console.log("ms " + maleStudents + " fs " + femaleStudents + " mt " + maleTeachers + " ft " + femaleTeachers)

    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Male Students', 'Female Students', 'Male Teachers', 'Female Teachers'],
        datasets: [{
          label: 'Pie Chart',
          data: [maleStudents, femaleStudents, maleTeachers, femaleTeachers], 
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pie Chart'
          }
        }
      }
    });
  }


  barChart: any

  createBarChart(): void {

    let classesArray = []
    let classesValuesArray = []

    for(let c of this.allClasses){
      classesArray.push(c.name)
      classesValuesArray.push(0)
    }

    let teachingGroupsArray = ['elementary14', 'elementary58', 'middlehigh']
    let teachingGroupsValuesArray = [0,0,0]

    for(let u of this.users){
      if(u.profileType === 'teacher'){
        if(u.teachingGroup === 'elementary14'){
          teachingGroupsValuesArray[0] += 1
        }

        if(u.teachingGroup === 'elementary58'){
          teachingGroupsValuesArray[1] += 1
        }

        if(u.teachingGroup === 'middlehigh'){
          teachingGroupsValuesArray[2] += 1
        }

        if(u.classes){
          for(let c of classesArray){
            if(u.classes.includes(c)){
              classesValuesArray[classesArray.indexOf(c)] += 1
            }
          }
        }
      
      }
    }

    let finalArray = []
    let finalArrayValues = []

    for(let tmp of classesArray){
      finalArray.push(tmp)
    }
    for(let tmp of teachingGroupsArray){
      finalArray.push(tmp)
    }
    
    for(let tmp of classesValuesArray){
      finalArrayValues.push(tmp)
    }
    for(let tmp of teachingGroupsValuesArray){
      finalArrayValues.push(tmp)
    }

    const canvas = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: finalArray,
        datasets: [{
          label: 'Bar Chart',
          data: finalArrayValues, 
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false, 
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bar Chart'
          }
        }
      }
    });
  }


  histogramChart: any

  createHistogramChart(): void {

    let numOfTutionsPerDay = [0,0,0,0,0,0,0]

    for(let t of this.allTutions){
      let date = new Date(t.date)

      numOfTutionsPerDay[date.getDay()] += 1

    }


    const canvas = document.getElementById('histogramChartCanvas') as HTMLCanvasElement;

    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    this.histogramChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
          label: 'Histogram',
          data: numOfTutionsPerDay, 
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 205, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false, 
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Histogram'
          }
        }
      }
    });
  }


  lineChart: any

  createLineChart(): void {

    let teachersArray: string[] = []
    let teachersNumOfClasses: number[] = []

    for(let t of this.allTutions){
      if(teachersArray.includes(t.professor)){
        teachersNumOfClasses[teachersArray.indexOf(t.professor)] += 1
      }else{
        teachersArray.push(t.professor)
        teachersNumOfClasses.push(1)
      }
    }

    let zipped = teachersArray.map((name, index) => ({ name, value: teachersNumOfClasses[index] }));

    
    zipped.sort((a, b) => b.value - a.value);

    
    teachersArray = zipped.map(item => item.name);
    teachersNumOfClasses = zipped.map(item => item.value);

    let top10TeachersArray = []

    let count10 = 0

    for(let teacher of teachersArray){
      top10TeachersArray.push(teacher)

      count10 += 1
      if(count10 >= 10){
        break
      }
    }

    let numOfClassesByMonthArray = [0, 0, 0, 0, 0 , 0, 0, 0, 0, 0, 0 , 0]

    for(let tution of this.allTutions){
      if(top10TeachersArray.includes(tution.professor)){
        let date = new Date(tution.date)
        let month = date.getMonth()

        numOfClassesByMonthArray[month] += 1

      }

    }


    const canvas = document.getElementById('lineChartCanvas') as HTMLCanvasElement;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Line Chart',
          data: numOfClassesByMonthArray, 
          fill: false,
          borderColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: false, 
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Line Chart'
          }
        }
      }
    });
  }

}
