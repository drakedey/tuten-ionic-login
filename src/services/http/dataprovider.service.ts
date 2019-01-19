import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { APP, API_BASE_URL, API_USER, EMAIL_KEY, TOKEN_KEY, API_BOOKING, CURRENT_USER } from '../constanst';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../authentication/auth-service.service';
import { of } from 'rxjs/observable/of';

@Injectable()
/**
 * Service in charge of parsing, procces and transform
 * the data used at all the aplication.
 */
export class DataproviderService {
  headers = {
    App: APP,
    Accept: 'aplication/json'
  };
  constructor(private httpClient: HttpClient) {
   }



  /**
   * Function to update the description of a given user
   * @param email user target
   * @param password description updated
   */
  doLoggin(email: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        ...this.headers,
        Password: password,
      }),
    }
    return this.httpClient.put(API_BASE_URL + API_USER + '/' + encodeURIComponent(email),{}, httpOptions)
    .pipe(
      map(data => data),
      catchError((error: HttpErrorResponse) => of(error))
    )
  }

  getBookingData(emailContact: string): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
    const adminemail = currentUser[EMAIL_KEY];
    const token = currentUser[TOKEN_KEY];
    const httpOptions = {
      headers: new HttpHeaders({
        ...this.headers,
        adminemail,
        token
      }),
      params: new HttpParams().set('current', 'true')
    };
    return this.httpClient.get(API_BASE_URL + API_USER + '/' + encodeURIComponent(emailContact) + API_BOOKING, httpOptions)
    .pipe(
      map(data => data),
      catchError((error: HttpErrorResponse) => of(error))
    )
    
  }

}
