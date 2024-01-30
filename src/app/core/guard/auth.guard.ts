import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var datas = localStorage.getItem('PlanillaUser');
    if(datas !== 'undefined'){
      const usuario = JSON.parse(localStorage.getItem('PlanillaUser'));
      if (usuario === null) {
        localStorage.clear();
        this.router.navigate(["/authentication/signin"]);
        return true;
      } else {
        return true;
      }
    }else{
      localStorage.clear();
      this.router.navigate(["/authentication/signin"]);
      return true;
    }
    
  }
}
