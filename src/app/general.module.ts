import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [],
  providers: [
    HttpClient,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class GeneralModule { }
