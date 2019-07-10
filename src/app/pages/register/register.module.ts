import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AppMaterialModule } from './../../app-material.module';

const route: Routes = [
  { path: '', component: RegisterComponent }
];


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(route)
  ]
})
export class RegisterModule { }
