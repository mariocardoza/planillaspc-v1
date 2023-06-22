import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILogin } from '../models/login.interface';
import { BehaviorSubject, ReplaySubject, catchError, Observable, tap, throwError, of } from 'rxjs';
import { endpoint } from 'src/environments/endpoint';
import { ICredencial } from '../models/credencial';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  http: HttpClient;

  private usuarioSubject: ReplaySubject<ICredencial>;
  private currentUserSubject: BehaviorSubject<ICredencial>;

  public usuarioActual: Observable<ICredencial>;
  public datosUsuario: ICredencial;

  constructor(
    http: HttpClient,
    private router: Router
  ) {
    this.http = http;
    this.usuarioSubject = new ReplaySubject<ICredencial>(
      JSON.parse(localStorage.getItem('PlanillaUser'))
    );
    this.currentUserSubject = new BehaviorSubject<ICredencial>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.usuarioActual = this.usuarioSubject.asObservable();
   }

   public get currentUserValue(): ICredencial {
    return this.currentUserSubject.value;
   }

   validate(credenciales: ILogin): Observable<any> {
    const url = endpoint.api.auth+'/login';
    const headers = { 'Accept': 'application/json'};
    return this.http.post(url, credenciales,{headers}).pipe(tap((result: any) => {
      if(result.success){
        var data = result.data;
        if (data.user != null) {
          this.datosUsuario = {
            id: data.id,
            fullname: data.user.fullname,
            username: data.user.username,
            email: data.user.email,
            uuid: data.user.uuid,
            token: data.access_token,
          };
          localStorage.setItem('PlanillaUser', JSON.stringify(this.datosUsuario));
          this.usuarioSubject.next(this.datosUsuario);
          this.currentUserSubject.next(this.datosUsuario);
          return this.datosUsuario;
        } else {
          // return false to indicate failed login
          return result;
        }
      }else{
        console.log("g")
          return result;
      }
    }),
      //catchError(this.handleError)
    );
  }

  logout() {
    // Eliminar todas las variables del storage
    localStorage.clear();

    this.currentUserSubject.next(null);
    this.router.navigate(['/authentication/signin']);
    return of({ success: false });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    //console.log('error', error);
    return throwError('Something bad happened; please try again later.');
  }
}
