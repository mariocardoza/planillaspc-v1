import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { DetallePlanilla } from '../models/detalle-planilla.interface';
import { Observable, forkJoin, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { endpoint } from 'src/environments/endpoint';
@Injectable({
  providedIn: 'root'
})
export class PlanillaService {
    private serviceUrl = 'https://dummyjson.com/users';
  constructor(private http: HttpClient) { }


  guardarPlanilla(data:any,token:string){
    const url = endpoint.api.planillas+"/create";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.post(url,data,{headers:headers}).pipe(tap((result) => {
        return result;
    }))
  }

  obtenerPlanilla(idEncabezado: number,token:string){
    const url = endpoint.api.planillas+"/"+idEncabezado;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers:headers}).pipe(tap((result) => {
        return result;
    }))
  }

  obtenerPlanillas(codigoEmpresa: number,token:string,page:number,limit:number){
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    const url = endpoint.api.planillas+"/empresa/"+codigoEmpresa;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
   // headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers,params}).pipe(tap((result) => {
        return result;
    }))
  }

  editarDetallePlanilla(data:any,token:string){
    const url = endpoint.api.planillas+"/detalle/update";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.post(url,data,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  clonarPlanilla(data:any,token:string){
    const url = endpoint.api.planillas+"/clonar";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.post(url,data,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  guardarPlanillaImportada(data:any,token:string){
    const url = endpoint.api.planillas+"/importada";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.post(url,data,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  
}
