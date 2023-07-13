import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILogin } from '../models/login.interface';
import { BehaviorSubject, ReplaySubject, catchError, Observable, tap, throwError, of } from 'rxjs';
import { endpoint } from 'src/environments/endpoint';
import { ICredencial } from '../models/credencial';
import { ILoginUser } from '../models/login-user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  http: HttpClient;

  private usuarioSubject: ReplaySubject<ICredencial>;
  private currentUserSubject: BehaviorSubject<ICredencial>;

  public usuarioActual: Observable<ICredencial>;
  public datosUsuario: ICredencial;
  EmpleadoUser :any;
  token: string;

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

   validateDUI(dui,token): Observable<any>{
    const url = endpoint.api.naturales+"/"+dui;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${token}`);
    return this.http.get(url,{headers}).pipe(tap((result : any) => {
      if(result.success){
        return result
      }
    }))
   }

   validateNIT(nit): Observable<any>{
    const url = endpoint.api.juridicas+"/"+nit;
    return this.http.get(url).pipe(tap((result : any) => {
      if(result.success){
        return result
      }else{
        return result;
      }
    }),
    catchError(this.handleError)
    );
   }

   register(data):Observable<any>{
    const url = endpoint.api.empty+"Register";
    return this.http.post(url,data).pipe(tap((result: any) => {
      if(result.success){
        return result;
      }else{
        return result;
      }
    }))
   }

   public validateLoginUser(credenciales: ILoginUser)
  {
    const url = endpoint.api.empty +"AuthenticateEP";
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<any>(url, credenciales, { headers: headers })
          .pipe(tap(data => {
               console.log(data.token);

              if (data.token != null) {
                  localStorage.setItem('EmpleadoUser', JSON.stringify(
                    {   usercodigo: credenciales.codigoUsuario,
                        usernombre: data.NombreCompletoUsuario,
                        userperfil: data.Perfil,
                        userunidad: data.UnidadOrganizacional,
                        userpa: data.ProcuraduriaAuxiliar,
                        usernperfil: data.PerfilUsuario,
                        token: data.token
                    }));
                    console.log(JSON.parse(localStorage.getItem("EmpleadoUser")))
                  return data;
            } else {
                return null;
            }
          }),
              catchError(this.handleError)
          );
  }

  findUser(credenciales): Observable<any> {
    const url = endpoint.api.empty+"Authenticate/forgot-user";
    return this.http.post(url,credenciales).pipe(tap((result) => {
      return result;
    }))
  }

  downloadFile(fileUrl: string): Observable<Blob> {
    const url = `${endpoint.api.download}`;
    let params = new HttpParams().set("filename", fileUrl);

    return this.http.get(url, { params: params,  responseType: 'blob'})
  }

   validate(credenciales: ILogin): Observable<any> {
    const url = endpoint.api.empty+'Authenticate';
    const headers = { 'Accept': 'application/json'};
    return this.http.post(url, credenciales,{headers}).pipe(tap((result: any) => {
      if(result.success){
        var data = result;
        if (data != null) {
          console.log(data.codigoEmpresa);
          this.datosUsuario = {
            CodigoEmpresa: data.codigoEmpresa,
            NombreCompletoUsuario: data.nombreCompletoUsuario,
            NombreEmpresa: data.nombreEmpresa,
            CodigoPGR: data.codigoPGR,
            NIT: data.nit,
            CodigoRol: data.codigoRol,
            Usuario: data.usuario,
            Email: data.email,
            Token: data.token,
          };
          console.log(this.datosUsuario);
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
