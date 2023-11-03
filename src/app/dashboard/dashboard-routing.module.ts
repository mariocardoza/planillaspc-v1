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
import { Page403Component } from './page403/page403.component';
import { AdministradoresComponent } from './admin/administradores/administradores.component';
import { CrearAdministradorComponent } from './admin/crear-administrador/crear-administrador.component';
import { EditarAdministradorComponent } from './admin/editar-administrador/editar-administrador.component';
import { EditarPlanillaComponent } from './planillas/editar-planilla/editar-planilla.component';
import { ClonarPlanillaComponent } from './planillas/clonar-planilla/clonar-planilla.component';
import { ImportarPlanillaComponent } from './planillas/importar-planilla/importar-planilla.component';
import { EmpIndexComponent } from './empleados/emp-index/emp-index.component';
import { EmpdIndexComponent } from './empleados/empd-index/empd-index.component';
import { LegalComponent } from './dashboard/legal/legal.component';
import { RepIndexComponent } from './reportes/rep-index/rep-index.component';
import { RepPlanillasComponent } from './reportes/rep-planillas/rep-planillas.component';
import { PagosComponent } from './planillas/pagos/pagos.component';
import { PlanillasPagadasComponent } from './admin/planillas-pagadas/planillas-pagadas.component';
import { DashPage404Component } from './dash-page404/dash-page404.component';
import { RecibosIngresoComponent } from './admin/recibos-ingreso/recibos-ingreso.component';

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
    path: 'planillas/:id/edit',
    component: EditarPlanillaComponent
  },
  {
    path: 'planillas/clonar',
    component: ClonarPlanillaComponent
  },
  {
    path:'planillas/importar',
    component: ImportarPlanillaComponent
  },
  {
    path:'pagos',
    component: PagosComponent
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
    path:'administradores',
    component: AdministradoresComponent
  },
  {
    path:'administradores/create',
    component: CrearAdministradorComponent
  },
  {
    path:'administradores/:id/edit',
    component: EditarAdministradorComponent
  },
  {
    path:'planillas/presentadas',
    component: PlanillasPagadasComponent
  },
  {
    path:'planillas/recibos',
    component: RecibosIngresoComponent
  },
  //Empleados
  {
    path:'empleados',
    component: EmpIndexComponent
  },
  {
    path: 'empleados/inactivos',
    component: EmpdIndexComponent
  },
  {
    path: 'legal',
    component: LegalComponent
  },
  //Reportes
  {
    path: 'reportes',
    component: RepIndexComponent
  },
  {
    path:'reportes/planillas',
    component: RepPlanillasComponent
  },
  {
    path:'403',
    component: Page403Component
  },
  {
    path: "**",
    component: DashPage404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
