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
import { DividerModule } from "primeng/divider";
import {TimelineModule} from 'primeng/timeline';

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
    MultiSelectModule,
    DividerModule,
    TimelineModule
  ]
})
export class PrimeNgModule { }
