import { Injectable } from '@angular/core';
import { DataproviderService } from '../http/dataprovider.service';
import { Observable, Subject } from 'rxjs';
import { CURRENT_USER } from '../constanst';
import { User } from '../../models/user.model';

@Injectable()
export class AuthService {
  loginSubject = new Subject<any>();
  currentUser: User = null;
  constructor(
    private dataProvider: DataproviderService,
    ) {
    }

  setCurrentUser(userObj): User {
    if(userObj) {
      const { firstName, lastName, email, sessionTokenBck:token } = userObj;
      console.log(token);
      const currentUser = new User(firstName, lastName, email, token);
      return currentUser;
    }
    return null;
  }
    
  logginUser(email, password): any {
    this.dataProvider.doLoggin(email, password)
    .subscribe( response => {
      const { error } = response;
      if(error) {
        this.loginSubject.next({ status: false, error });
        localStorage.setItem(CURRENT_USER,  null);
      } else {
        console.log(response);
        this.currentUser = this.setCurrentUser(response);
        localStorage.setItem(CURRENT_USER, JSON.stringify(this.currentUser));
        this.loginSubject.next({ status: true });
      }
    });
    return this.getCurrentUserValue();
  }

  getCurrentUserValue(): any {
    const currentUser = localStorage.getItem(CURRENT_USER) ? JSON.parse(localStorage.getItem(CURRENT_USER)) : null;
    return currentUser;
  }

  logout(): void {
    if(this.getCurrentUserValue()) {
      localStorage.removeItem(CURRENT_USER);
    }
  }

  onLoggin(): Observable<any> {
    return this.loginSubject.asObservable();
  }
}
