import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Classes } from '../models/classes';
import { Tution } from '../models/tution';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private apiUrl = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getClasses() {
    return this.http.get<Classes[]>('http://localhost:3000/classes');
  }

  getTutions() {
    return this.http.get<Tution[]>('http://localhost:3000/tutions');
  }

  changeTution(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/confirmTution`, formData);
  }

  addClass(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/addClass`, formData);
  }

  addUser(formData: FormData) {
    
    // formData.append('password', u.password);

    return this.http.post<any>(`${this.apiUrl}/addUser`, formData)
  }
}
