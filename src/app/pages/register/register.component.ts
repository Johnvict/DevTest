import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserBio } from '../../interfaces/interface';
import { Router } from '@angular/router';
import { DataProcessorService } from '../../providers/data-processor.service';
import { MasterProvider } from '../../providers/masterprovider.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  showPassword = false;
  constructor(private dataService: DataProcessorService, private router: Router, private masterP: MasterProvider) { }

  ngOnInit() {
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user: UserBio = form.value;
    this.dataService.createUser(user).subscribe( response => {
      if (response.success) {
        this.masterP.openSnackBar('Registration Successfull');
        form.resetForm();
        this.router.navigate(['login']);
      }
    }, error => error.status === 409 ? this.masterP.openSnackBar('A user is already registered with this email') : null);
  }
}
