import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserBio, LoginData } from '../../interfaces/interface';

import { AuthService } from '../../providers/auth.service';
import { MasterProvider } from '../../providers/masterprovider.service';
import { DataProcessorService } from '../../providers/data-processor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newUser: UserBio = { name: null, address: null, gender: null, email: null, password: null };
  userLoginData: LoginData = { email: null, password: null };
  waiting = false;
  constructor(
    private router: Router,
    private masterP: MasterProvider,
    private dataService: DataProcessorService,
    private authP: AuthService,
  ) { }

  ngOnInit() {
    this.dataService.getLoans().subscribe( res => {
      console.log(res);
    });
  }

  registerUser() {
    this.waiting = true;
    this.dataService.createUser(this.newUser).subscribe( res => {
      this.waiting = false;
      if (res.success) {
        // this.masterP.showToast('Registration Successfull', 'Congratulations', 'success');
      }
    });
  }

  loginUser() {
    this.waiting = true;
    this.authP.login(this.userLoginData).subscribe( res => {
      this.waiting = false;
      if (res.success) {
        // this.masterP.showToast(`Welcome back ${this.userLoginData.email}`, 'Login Successfull', 'success');
        this.router.navigate(['loans']);
      } else {
        // this.masterP.showToast('Invalid Credientials', 'Login Error', 'warning');
      }
    });
  }

}
