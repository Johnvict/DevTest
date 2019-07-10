import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { AppMaterialModule } from 'src/app/app-material.module';

const route: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(route)
  ]
})

export class DashboardModule { }
