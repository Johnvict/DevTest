import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {
    constructor( private authService: AuthService, private router: Router ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.isAuthenticated()
        .then(
          (authenticated: boolean) => {
            if (authenticated) {
              this.authService.setAuthStatus(true);
              return true;
            } else {
              this.authService.setAuthStatus(false);
              this.router.navigate(['admin']);
              return false;
            }
          }
        );
    }
}
