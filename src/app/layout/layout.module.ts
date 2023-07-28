import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material/tabs";
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule, NgbModule, MatTabsModule,MaterialModule
  ]
})
export class LayoutModule { }
