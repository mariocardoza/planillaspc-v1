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
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HistorialComponent } from './planillas/historial/historial.component';
import { UsuarioActivosComponent } from './admin/usuario-activos/usuario-activos.component';
import { BitacorapjComponent } from './admin/bitacorapj/bitacorapj.component';
import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { CrearComponent } from './planillas/crear/crear.component';
import { Page403Component } from './page403/page403.component';
import { AdministradoresComponent } from './admin/administradores/administradores.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CrearAdministradorComponent } from './admin/crear-administrador/crear-administrador.component';
@NgModule({
  declarations: [
    DashboardComponent,
    PlanillaComponent,
    PerfilComponent,
    UsuariosPendientesComponent,
    EditarUsuarioComponent,
    HistorialComponent,
    UsuarioActivosComponent,
    BitacorapjComponent,
    CrearComponent,
    Page403Component,
    AdministradoresComponent,
    CrearAdministradorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
    ComponentsModule,
    NgbAlertModule,
    NgbNavModule,
    MatAutocompleteModule,
    PrimeNgModule
  ]
})
export class DashboardModule { }
