import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var datas = localStorage.getItem('PlanillaUser');
    if(datas !== 'undefined'){
      const usuario = JSON.parse(localStorage.getItem('PlanillaUser'));
      if (usuario === null) {
        this.router.navigate(["/dashboard/home"]);
        return true;
      } else {
        if(usuario.CodigoRol == 'R'){
          return true;
        }else{
          this.router.navigate(["/dashboard/home"]);
          return true;
        }
      }
    }else{
      this.router.navigate(["/dashboard/home"]);
      return true;
    }
  }
  
}
