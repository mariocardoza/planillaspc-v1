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
import { ManttoEmpleadosComponent } from './admin/mantto-empleados/mantto-empleados.component';
import { ActiveGuard } from '../core/guard/active.guard';
import { AdminGuard } from '../core/guard/admin.guard';

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
    canActivate: [ActiveGuard],
    component: PlanillaComponent
  },
  {
    path: 'planillas/historial',
    canActivate: [ActiveGuard],
    component: HistorialComponent
  },
  {
    path: 'planillas/create',
    canActivate: [ActiveGuard],
    component: CrearComponent
  },
  {
    path: 'planillas/:id/edit',
    canActivate: [ActiveGuard],
    component: EditarPlanillaComponent
  },
  {
    path: 'planillas/clonar',
    canActivate: [ActiveGuard],
    component: ClonarPlanillaComponent
  },
  {
    path:'planillas/importar',
    canActivate: [ActiveGuard],
    component: ImportarPlanillaComponent
  },
  {
    path:'pagos',
    canActivate: [ActiveGuard],
    component: PagosComponent
  },
  {
    path: 'usuarios-pendientes',
    canActivate: [AdminGuard,ActiveGuard],
    component: UsuariosPendientesComponent
  },
  {
    path: 'usuarios-activos',
    canActivate: [AdminGuard,ActiveGuard],
    component: UsuarioActivosComponent
  },
  {
    path: 'bitacora-juridicas',
    canActivate: [AdminGuard,ActiveGuard],
    component: BitacorapjComponent
  },
  {
    path: 'editar-usuario/:codigopersona',
    canActivate: [ActiveGuard],
    component: EditarUsuarioComponent
  },
  {
    path:'administradores',
    canActivate: [ActiveGuard],
    component: AdministradoresComponent
  },
  {
    path:'administradores/create',
    canActivate: [ActiveGuard],
    component: CrearAdministradorComponent
  },
  {
    path:'administradores/:id/edit',
    canActivate: [ActiveGuard],
    component: EditarAdministradorComponent
  },
  {
    path:'planillas/presentadas',
    canActivate: [AdminGuard,ActiveGuard],
    component: PlanillasPagadasComponent
  },
  {
    path:'planillas/recibos',
    canActivate: [AdminGuard,ActiveGuard],
    component: RecibosIngresoComponent
  },
  //Empleados
  {
    path:'empleados',
    canActivate: [ActiveGuard],
    component: EmpIndexComponent
  },
  {
    path: 'empleados/inactivos',
    canActivate: [ActiveGuard],
    component: EmpdIndexComponent
  },
  {
    path: 'empleados/mantenimiento',
    canActivate: [AdminGuard,ActiveGuard],
    component: ManttoEmpleadosComponent,
  },
  {
    path: 'legal',
    component: LegalComponent
  },
  //Reportes
  {
    path: 'reportes',
    canActivate: [ActiveGuard],
    component: RepIndexComponent
  },
  {
    path:'reportes/planillas',
    canActivate: [ActiveGuard],
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
