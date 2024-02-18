import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './index/index.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { RegisterTeacherComponent } from './register-teacher/register-teacher.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { UnregisteredComponent } from './unregistered/unregistered.component'
//ng add @angular/material
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentTeachersViewComponent } from './student-teachers-view/student-teachers-view.component';
import { TeacherInfoComponent } from './teacher-info/teacher-info.component';
import { StudentTutionsComponent } from './student-tutions/student-tutions.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherTutionsComponent } from './teacher-tutions/teacher-tutions.component';
import { TeacherStudentsListComponent } from './teacher-students-list/teacher-students-list.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    IndexComponent,
    MainpageComponent,
    RegisterTeacherComponent,
    ChangePasswordComponent,
    LoginComponent,
    UnregisteredComponent,
    StudentProfileComponent,
    StudentTeachersViewComponent,
    TeacherInfoComponent,
    StudentTutionsComponent,
    TeacherProfileComponent,
    TeacherTutionsComponent,
    TeacherStudentsListComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
