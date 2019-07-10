import { Injectable } from '@angular/core';
import { MasterProvider } from './masterprovider.service';
import { UserBio, LoanData, NewLoan } from '../interfaces/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataProcessorService {

  url = this.masterP.url;
  constructor( private masterP: MasterProvider ) { }

  createUser(user: UserBio): Observable<any> {
    return this.masterP.http.post<any>(`${this.url}user-register`, user, this.masterP.options);
  }

  getLoans(): Observable<any> {
    return this.masterP.http.get<{message: string, loans: LoanData[]}>(`${this.url}loans`);
  }

  applyForLoan(data: NewLoan): Observable<any> {
    return this.masterP.http.post<UserBio>(`${this.url}loan-apply`, data);
  }

}
