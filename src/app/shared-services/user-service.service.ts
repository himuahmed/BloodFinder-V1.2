import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from '../app-person/interfaces/person';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService()
  constructor(private http:HttpClient) {
   
   }


  getPersonByUserId():Observable<Person>{
    const userId = this.getLoggedinUserId();
    return this.http.get<Person>(this.baseUrl + 'userandperson/personbyuserid/'+userId);
  }

  getCurrentUser():Observable<Person>{
    return this.http.get<Person>(this.baseUrl + 'userandperson/getLoggedInUser');
  }

  tokenDecoder()
  {
    const token =  localStorage.getItem('token');
    return this.jwtHelper.decodeToken(token);

  }

  getLoggedinUserId(){
    const decodedToken = this.tokenDecoder()
    return decodedToken["nameid"];
  }

  addPersonInformation(personData:Person){
    return this.http.post<Person>(this.baseUrl+ 'userandperson/addPersonData', personData);
  }

  updatePersonInformation(personData:Person){
    return this.http.put<Person>(this.baseUrl + 'userandperson/updatePerson', personData);
  }

}
