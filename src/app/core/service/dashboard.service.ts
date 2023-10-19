import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { endpoint } from 'src/environments/endpoint';
import { BehaviorSubject, ReplaySubject, catchError, Observable, tap, throwError, of } from 'rxjs';
import { IEmpleado } from '../models/empleados/empleado';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http: HttpClient;
  constructor(http: HttpClient) { 
    this.http = http;
  }

  bitacoraJuridicas(token,page:number,limit: number, codigoPagaduria:string, codigoRol:string): Observable<any> {
    const url = endpoint.api.juridicas+"/bitacoras";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("codigoRol", codigoRol);
    params = params.append("codigoPagaduria", codigoPagaduria);
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{params,headers}).pipe(tap((result) => {
      return result;
    }))
  }

  usersPending(token:string,codigoRol:string,codigoPagaduria:any,page:number,limit: number): Observable<any> {
    const url = endpoint.api.usuarios+"/usuarios-pendientes";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("codigoRol", codigoRol);
    params = params.append("codigoPagaduria", codigoPagaduria);
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{params,headers}).pipe(tap((result) => {
      return result;
    }))
  }

  usersActive(token: string,codigoRol:string,codigoPagaduria:string, page:number, limit: number): Observable<any> {
    const url = endpoint.api.usuarios+"/usuarios-activos";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("codigoRol", codigoRol);
    params = params.append("codigoPagaduria", codigoPagaduria);
    return this.http.get(url,{params,headers}).pipe(tap((result) => {
      return result;
    }))
  }

  usersActiveAsync(token: string,codigoRol:string,codigoPagaduria:string, page:number, limit: number): Observable<any> {
    const url = endpoint.api.usuarios+"/usuarios-activossync";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    params = params.append("codigoRol", codigoRol);
    params = params.append("codigoPagaduria", codigoPagaduria);
    return this.http.get(url,{params,headers}).pipe(tap((result) => {
      return result;
    }))
  }

  searchUser(codigoPersona: number, token: string): Observable<any>{
    const url = endpoint.api.usuarios+"/buscar-usuario/"+codigoPersona;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers}).pipe(tap((result) => {
      return result;
    }))
  }

  editUser(data:any,token:string): Observable<any>{
    const url = endpoint.api.usuarios+"/actualizar";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.post(url,data,{headers}).pipe(tap((result) => {
      return result;
    }))
  }

  deactiveUser(codigoPersona :number, token: string): Observable<any>{
    const url = endpoint.api.usuarios+"/desactivar-usuario/"+codigoPersona
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  activeUser(codigoPersona :number, token: string): Observable<any>{
    const url = endpoint.api.usuarios+"/activar-usuario/"+codigoPersona
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  updatePassword(data:any,token: string): Observable<any>{
    const url = endpoint.api.usuarios+"/actualizar-clave";
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.post(url,data,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }


  /* administradores */
  adminsList(token: string, page: number, limit: number): Observable<any>{
    const url = endpoint.api.usuarios+"/administradores"
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    let params = new HttpParams();
    params = params.append("skip", page);
    params = params.append("limit", limit);
    return this.http.get(url,{params,headers}).pipe(tap((result) => {
      return result;
    }))
  }

  createAdmin(data:any,token: string): Observable<any>{
    const url = endpoint.api.usuarios+"/administradores/create";
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.post(url,data,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  findAdmin(idUsuario: number,token:string): Observable<any>{
    const url = endpoint.api.usuarios+"/administradores/"+idUsuario
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer '+`${token}`);
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  estadisticasDashboard(codigoEmpresa:number):Observable<any>{
    const url = endpoint.api.dashboard+"/estadisticas/"+codigoEmpresa
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }

  sisUsuarios(): Observable<any>{
    const url = endpoint.api.usuarios+"/sisusuarios"
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }
}
