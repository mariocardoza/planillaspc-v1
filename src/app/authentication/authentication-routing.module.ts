import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { Page404Component } from "./page404/page404.component";
import { Page500Component } from "./page500/page500.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RecoverPasswordComponent } from "./recover-password/recover-password.component";
import { SignupCompleteComponent } from "./signup-complete/signup-complete.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full",
  },
  {
    path: "signin",
    component: SigninComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path:'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path:'recover-password',
    component: RecoverPasswordComponent
  },
  {
    path: 'signup-complete',
    component: SignupCompleteComponent
  },
  {
    path: "page404",
    component: Page404Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
