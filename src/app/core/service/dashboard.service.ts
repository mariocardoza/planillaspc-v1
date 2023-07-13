import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { endpoint } from 'src/environments/endpoint';
import { BehaviorSubject, ReplaySubject, catchError, Observable, tap, throwError, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http: HttpClient;
  constructor(http: HttpClient) { 
    this.http = http;
  }

  users(token): Observable<any> {
    const url = endpoint.api.empty+"usuarios/usuarios-pendientes";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers}).pipe(tap((result) => {
      return result;
    }))
  }

  activeUser(codigoPersona :number, token: string): Observable<any>{
    const url = endpoint.api.empty+"usuarios/activar-usuario/"+codigoPersona
    let headers = new HttpHeaders({'Content-Type' : 'application/json'})
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers: headers}).pipe(tap((result) => {
      return result;
    }))
  }
}
