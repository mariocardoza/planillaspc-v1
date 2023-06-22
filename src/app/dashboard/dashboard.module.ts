import { NgModule } from '@angular/core';
import {MAT_DATE_LOCALE} from "@angular/material/core";

@NgModule({
  declarations: [
  ],
  imports: [
  ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-SV'}
    ]
})
export class DashboardModule { }
