import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {TableModule} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonModule,
    CardModule,
    TableModule,
    DropdownModule,
    TagModule,
    ToastModule,
    CalendarModule,
    KeyFilterModule,
    MultiSelectModule
  ]
})
export class PrimeNgModule { }
