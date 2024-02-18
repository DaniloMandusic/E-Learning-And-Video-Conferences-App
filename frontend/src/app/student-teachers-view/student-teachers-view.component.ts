import { Component, OnInit, ViewChild } from '@angular/core';
import { TeacherByClass } from '../models/teacherByClass';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Classes } from '../models/classes';
import { User } from '../models/user';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Tution } from '../models/tution';

@Component({
  selector: 'app-student-teachers-view',
  templateUrl: './student-teachers-view.component.html',
  styleUrls: ['./student-teachers-view.component.css']
})
export class StudentTeachersViewComponent implements OnInit {
  users: User[] = [];
  teachersByClass: TeacherByClass[] = []
  classes: Classes[] = []
  searchInput: string = '';

  currentUser = new User();

  numberOfStudents: number = 0
  numberOfActiveTeachers: number = 0

  numberOfClasses7: number = 0
  numberOfClasses30: number = 0

  dataSource: MatTableDataSource<TeacherByClass> = new MatTableDataSource<TeacherByClass>([]);
  displayedColumns: string[] = ['class', 'name', 'surname'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: DataService, private sanitizer: DomSanitizer, private router: Router) {}

  allTutions: Tution[] = []

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe(
      (u: User[]) => {
        this.users = u;
        console.log('Received users:', u);

        let username = localStorage.getItem("username")
        console.log('user from localStroage: ' + username)

        for(let user of this.users){
          let image = "data:image/jpg;base64," + user.profilePictureUrl
          user.image = this.sanitizer.bypassSecurityTrustUrl(image);

          if(user.username === username){
            this.currentUser = user
            console.log('curr user found: ' + username)
          }
        }

      },
      (error) => {
        console.error('Error fetching users:', error);
      },
      () => {
        this.userService.getClasses()
        .subscribe(
          (c: Classes[]) => {
            this.classes = c;
            console.log('Received classes:', c);

          

          },
          (error) => {
            console.error('Error fetching classes:', error);
          },
          () => {

            console.log("classes")
            console.log(this.classes)

            console.log("users")
            console.log(this.users)

            console.log("before loop")

            let teachingGroup = this.currentUser.teachingGroup
            let grade: number = +this.currentUser.grade
            if(this.currentUser.schoolType === 'elementary'){
              if( grade < 5){
                teachingGroup = 'elementary14'
              } else {
                teachingGroup = 'elementary58'
              }
            } else{
              teachingGroup = 'middlehigh'
            }


            console.log("teaching group: " + teachingGroup)
            for(let c of this.classes){
              console.log("got into loop")
              console.log(c.name)
              for(let u of this.users){
                console.log(u.classes)
                if(u.classes){
                  if(u.classes.includes(c.name)){
                    let teacherByClass = new TeacherByClass()
                    teacherByClass.class = c.name
                    teacherByClass.username = u.username
                    teacherByClass.name = u.name
                    teacherByClass.surname = u.surname

                    if(u.teachingGroup === teachingGroup){
                      if(u.profileStatus === 'approved')
                      this.teachersByClass.push(teacherByClass)
                    }
                    
                  }
                }
              }
            }

            for(let u of this.users){
              if(u.profileType === "student"){
                this.numberOfStudents = this.numberOfStudents + 1
              } else{
                if(u.profileStatus === "approved"){
                  this.numberOfActiveTeachers = this.numberOfActiveTeachers + 1
                }
              }
            }

            console.log("teachers by classes")
            console.log(this.teachersByClass)

            this.dataSource = new MatTableDataSource(this.teachersByClass);
            this.dataSource.sort = this.sort;

            this.userService.getTutions().subscribe((t)=>{
              this.allTutions = t

              let today = new Date()
              let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate())
              let lastMonth = new Date(today.getFullYear(), today.getMonth()-1, today.getDate()-7)

              for(let tution of this.allTutions){
                let tmpDate = new Date(tution.date)
                if(tmpDate < today && tmpDate > lastWeek && tution.isDone === 'true'){
                  if(tution.student === this.currentUser.username)
                  this.numberOfClasses7 += 1
                }

                if(tmpDate < today && tmpDate > lastMonth && tution.isDone === 'true'){
                  if(tution.student === this.currentUser.username)
                  this.numberOfClasses30 += 1
                }
              }

            })

          }
        );
      }
    );
  }

  applyFilter() {
    const filterValue = this.searchInput.toLowerCase();
    this.dataSource.filter = filterValue.trim();
  }

  viewDetails(username: string) {
    this.router.navigate(['/teacherInfo', username]);
  }

}
