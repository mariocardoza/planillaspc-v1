import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { DetallePlanilla } from '../models/detalle-planilla.interface';
import { Observable, forkJoin, tap, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { endpoint } from 'src/environments/endpoint';
import { DetalleEPlanilla } from '../models/detalle-e-planilla';
import { HandleError, HttpErrorHandlerService } from './http-error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class PlanillaService {
    private serviceUrl = 'https://dummyjson.com/users';
    private readonly handleError: HandleError;
  constructor(private http: HttpClient,httpErrorHandler: HttpErrorHandlerService,) { 
    this.handleError = httpErrorHandler.createHandleError('PlanillaService'); 
  }


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
    const url = endpoint.api.planillas+"/registrarexcel";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.post(url,data,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  anularPlanilla(idEncabezado:number){
    const url = endpoint.api.planillas+"/anular/"+idEncabezado;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.post(url,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  eliminarEmpleadoPlanilla(idDetalle: number, idEncabezado:number){
    const data = {
      idDetalle,
      idEncabezado
    }
    const url = endpoint.api.planillas+"/eliminarEmpleado";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.post(url,data,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  prePlanilla(codigoempresa: number,codigopagaduria:string){
    const url = endpoint.api.planillas+"/preplanilla?codigoPgr="+codigoempresa+"&codigoPagaduria="+codigopagaduria;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    //headers = headers.append('Authorize','Bearer '+ `${token}`);
    return this.http.get<DetalleEPlanilla[]>(url).pipe(
      catchError(this.handleError('prePlanilla', [])
    ));
  }

  
}
