import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgxMaskModule } from "ngx-mask";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from "@angular/material/tabs";
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import {MatCardModule} from '@angular/material/card';
import { MatProgressBarModule } from "@angular/material/progress-bar";

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatCheckboxModule,
  MatIconModule,
  MatTooltipModule,
  MatCardModule,
  MatNativeDateModule,
  NgxMaskModule.forRoot(),
  MatButtonToggleModule,
  MatFormFieldModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatOptionModule,
  MatDatepickerModule,
  MatTableModule,
  MatPaginatorModule,
  MatStepperModule,
  MatSortModule,
  MatProgressBarModule,
];

@NgModule({
  declarations: [],
  imports: [materialModules],
  exports: [materialModules],
  providers: [MatDatepickerModule, { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }]
})
export class MaterialModule {}
