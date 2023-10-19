import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './authentication/page404/page404.component';
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "dashboard",
        canActivate: [AuthGuard],
        loadChildren: () =>
            import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      }
    ]
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
        import("./authentication/authentication.module").then(
            (m) => m.AuthenticationModule
        ),
},
{ path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
