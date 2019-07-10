import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginData } from '../../interfaces/interface';
import { AuthService } from '../../providers/auth.service';
import { MasterProvider } from '../../providers/masterprovider.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword = false;
  constructor(private authService: AuthService, private roter: Router, private masterP: MasterProvider) { }

  ngOnInit() {
  }

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user: LoginData = form.value;
    await this.authService.login(user).subscribe( res => {
      if (res.success) {
        this.masterP.openSnackBar('Login Successfull');
        this.authService.setAuthStatus(true);
        this.roter.navigate(['dashboard']);
      } else {
        this.masterP.openSnackBar('Invalid Credentials');
      }
    }, error => this.masterP.openSnackBar(`Error occured: ${error.error.message}`));
    form.resetForm();
  }

}
