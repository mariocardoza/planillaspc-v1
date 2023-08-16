import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
@Injectable()
export class ProtectRoutesInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const usuario = JSON.parse(localStorage.getItem('PlanillaUser'));
    const token = usuario?.Token;
    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
        catchError((err: HttpErrorResponse) => {
          

          if (err.status === 401) {
            localStorage.clear();
            this.router.navigate(['/authentication/signin']);
          }

          //this.router.navigate(['/authentication/signin']);
          return throwError( err );

        })
    );
  }
}
