import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Page404Component } from '../authentication/page404/page404.component';
import { PlanillaComponent } from './planilla/planilla.component';

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
    path: 'planilla',
    component: PlanillaComponent
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
