import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { PerfilComponent } from './perfil/perfil.component';
import { MaterialModule } from '../shared/material.module';
import { UsuariosPendientesComponent } from './usuarios-pendientes/usuarios-pendientes.component';
import { EditarUsuarioComponent } from './admin/editar-usuario/editar-usuario.component';
import { ComponentsModule } from "../shared/components/components.module";
@NgModule({
  declarations: [
    DashboardComponent,
    PlanillaComponent,
    PerfilComponent,
    UsuariosPendientesComponent,
    EditarUsuarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class DashboardModule { }
