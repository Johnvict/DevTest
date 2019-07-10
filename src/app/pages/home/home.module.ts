import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { GeneralModule } from '../../general.module';
import { AppMaterialModule } from '../../app-material.module';


const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    GeneralModule,
    AppMaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
