import { NgModule } from '@angular/core';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import { ComponentsModule } from '../shared/components/components.module';
@NgModule({
  declarations: [
  ],
  imports: [
    ComponentsModule
  ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-SV'}
    ]
})
export class DashboardModule { }
