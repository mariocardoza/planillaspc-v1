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

  obtenerPlanillas(codigoEmpresa: number,filter:string,page:number,limit:number,sortOrder:number,sortField: string): Observable<any>{
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("filter", filter);
    params = params.append("sortOrder", sortOrder);
    params = params.append("sortField", sortField);
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

  editarEncabezadoPlanilla(data:any){
    const url = endpoint.api.planillas+"/update";
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

  buscarExpediente(data:any): Observable<any>{
    const url = endpoint.api.planillas+"/buscarExpediente";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(url,data,{headers:headers}).pipe(tap((result)=>{
        return result;
    }))
  }

  enviarPlanilla(idEncabezado: number): Observable<any>{
    const url = endpoint.api.planillas+"/Enviar/"+idEncabezado;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(url,headers).pipe(tap(result => {
      return result;
    }))
  }

  generarComprobante(idEncabezado: number): Observable<any>{
    const url = endpoint.api.planillas+"/Comprobante/"+idEncabezado;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(url,headers).pipe(tap(result => {
      return result;
    }))
  }

  imprimirComprobante(idEncabezado: number) : Observable<any>{
    const url = endpoint.api.planillas+"/Imprimir/"+idEncabezado;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(url,headers).pipe(tap(result => {
      return result;
    }))
  }

  obtenerComprobantes(codigoEmpresa: number,filter:string,page:number,limit:number,sortOrder:number,sortField: string): Observable<any>{
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("filter", filter);
    params = params.append("sortOrder", sortOrder);
    params = params.append("sortField", sortField);
    const url = endpoint.api.planillas+"/comprobantes/"+codigoEmpresa;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
   // headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers,params}).pipe(tap((result) => {
        return result;
    }))
  }

  obtenerComprobantesPagados(codigoPagaduria: number,filter:string,page:number,limit:number,sortOrder:number,sortField: string): Observable<any>{
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("filter", filter);
    params = params.append("sortOrder", sortOrder);
    params = params.append("sortField", sortField);
    const url = endpoint.api.planillas+"/comprobantes/pagados/"+codigoPagaduria;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
   // headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers,params}).pipe(tap((result) => {
        return result;
    }))
  }

  subirComprobante(data:any): Observable<any>{
    const url = endpoint.api.planillas+"/upload/comprobante";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(url,data,{headers}).pipe(tap((result) => {
      return result;
    }))
  }

  finalizarPlanilla(idEncabezado:number): Observable<any>{
    const url = endpoint.api.planillas+"/finalizar/"+idEncabezado;
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(url,{headers}).pipe(tap((result) => {
      return result;
    }))
  }

  listadoBancos(): Observable<any>{
    const url = endpoint.api.planillas+"/bancos";
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.get(url,{headers}).pipe(tap((result) => {
      return result;
    }))
  }

  
}
