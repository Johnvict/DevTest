import { Injectable } from '@angular/core';
import { Subject, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class MasterProvider {
  // url = 'http://localhost:3000/api/';
  url = 'https://back.devtest.my-backend.com.ng/api/';
  options: any;

  public toastTitle: string;
  public toastContent: string;
  public toastType: string;
  public listners = new Subject<any>();
  constructor(
    public http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.createNewHeader();
    console.log(this.url);
  }

  createNewHeader() {
    this.options = new HttpHeaders({
      enctype: 'multipart/form-data',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }

  async recreateHeaders(bearer: string) {

    this.options = new HttpHeaders({
      enctype: 'multipart/form-data',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: bearer
    });
    this.filter('Header Recreated');
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {duration: 3000});
  }

  listen(): Observable<any> {
    return this.listners.asObservable();
  }

  filter(filterMssg: string) {
    this.listners.next(filterMssg);
    this.listen();
  }

}
