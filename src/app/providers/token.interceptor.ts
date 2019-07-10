import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { MasterProvider } from './masterprovider.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor( private masterP: MasterProvider ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('token');
        if (token !== null) {
          token = atob(localStorage.getItem('token'));
        }
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json'
                }
            });
        }

        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.body.token) {
                        const tok = `devtest ${event.body.token}`;
                        localStorage.setItem('token', btoa(tok));
                        localStorage.setItem('userData', JSON.stringify(event.body.userData));
                        localStorage.setItem('availableLoans', JSON.stringify(event.body.availableLoans));
                        localStorage.setItem('status', JSON.stringify({
                            loggedIn: true,
                        }));
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !error.error.isAuthenticated) {
                  this.masterP.openSnackBar('Session expired, please login again');
                }
                return throwError(error);
            })
        );
    }
}
