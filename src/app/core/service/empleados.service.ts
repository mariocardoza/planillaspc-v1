import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, catchError, Observable, tap, throwError, of } from 'rxjs';
import { endpoint } from 'src/environments/endpoint';
@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
   }

   buscarEmpleadosEmpresa(codigoEmpresa:number, codigoPagaduria: string): Observable<any>{
    const url = endpoint.api.empleados+"/empresas/"+codigoEmpresa+"/"+codigoPagaduria
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  registrarEmpleado(data: any): Observable<any>{
    const url = endpoint.api.empleados+"/registrar";
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.post(url,data,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  actualizarEmpleado(data: any): Observable<any>{
    const url = endpoint.api.empleados+"/editar";
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.post(url,data,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  descactivarEmpleado(idRegistro:number) : Observable<any>{
    const data = {
      idTabla : idRegistro
    }
    const url = endpoint.api.empleados+"/desactivar";
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.post(url,data,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  refrescarEmpleados(codigoEmpresa:number, codigoPagaduria: string): Observable<any>{
    const url = endpoint.api.empleados+"/refrescar/"+codigoEmpresa+"/"+codigoPagaduria
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }
}
