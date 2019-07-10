import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MasterProvider } from './masterprovider.service';
import { LoginData } from '../interfaces/interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = this.masterP.url;
  isloggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    public http: HttpClient,
    private masterP: MasterProvider,
    private router: Router,
  ) { }

  isAuthenticated() {
    return new Promise(resolve => {
        resolve(this.isAuthenticated);
      }
    );
  }

  isUserAuthenticated(): Observable<boolean> {
    return this.isloggedIn.asObservable();
  }

  setAuthStatus(status: boolean) {
    this.isloggedIn.next(status);
  }

  get authStatus() {
    if (localStorage.getItem('token')) {
      return this.checkAuthStatus().subscribe(res => {
        if (res.isAuthenticated) {
          this.isloggedIn.next(true);
          return true;
        }
      }, e => {
        this.masterP.openSnackBar('Please login or your session has expired', 'Unauthorised');
        localStorage.clear();
        this.router.navigate(['/']);
      });
    } else {
      localStorage.clear();
      this.isloggedIn.next(false);
      return false;
    }
  }

  login(userData: LoginData): Observable<any> {
    return this.masterP.http.post<any>(`${this.masterP.url}user-login`, userData, this.masterP.options);
  }

  checkAuthStatus(): Observable<any> {
    return this.http.post<any>(`${this.masterP.url}auth-check`, this.masterP.options);
  }

  logout() {
    this.doLogout().subscribe( res => {
      this.completeLogout();
    }, e => {
      this.completeLogout(true);
    });
  }

  doLogout(): Observable<any> {
    return this.masterP.http.post<any>(`${this.masterP.url}logout`, this.masterP.options);
  }
  completeLogout(error?: boolean) {
    if (error) {
      this.masterP.openSnackBar('Ooops! You were not logged in before');
    } else {
      this.masterP.openSnackBar('Logout success');
    }
    localStorage.clear();
    this.isloggedIn.next(false);
    this.router.navigate(['/']);
  }

}
