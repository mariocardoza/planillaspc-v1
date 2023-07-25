import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Page404Component } from '../authentication/page404/page404.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosPendientesComponent } from './usuarios-pendientes/usuarios-pendientes.component';
import { EditarUsuarioComponent } from './admin/editar-usuario/editar-usuario.component';
import { HistorialComponent } from './planillas/historial/historial.component';
import { UsuarioActivosComponent } from './admin/usuario-activos/usuario-activos.component';
import { BitacorapjComponent } from './admin/bitacorapj/bitacorapj.component';
import { CrearComponent } from './planillas/crear/crear.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: 'home',
    component: DashboardComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'planillas',
    component: PlanillaComponent
  },
  {
    path: 'planillas/historial',
    component: HistorialComponent
  },
  {
    path: 'planillas/create',
    component: CrearComponent
  },
  {
    path: 'usuarios-pendientes',
    component: UsuariosPendientesComponent
  },
  {
    path: 'usuarios-activos',
    component: UsuarioActivosComponent
  },
  {
    path: 'bitacora-juridicas',
    component: BitacorapjComponent
  },
  {
    path: 'editar-usuario/:codigopersona',
    component: EditarUsuarioComponent
  },
  {
    path: "**",
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
