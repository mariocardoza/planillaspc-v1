import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { PerfilComponent } from './perfil/perfil.component';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [
    DashboardComponent,
    PlanillaComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    MaterialModule
  ]
})
export class DashboardModule { }
