import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError = <T>(
  operation?: string,
  result?: T,
) => (error: HttpErrorResponse) => Observable<T>;


@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor( private router: Router ) {}

  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') => {
    return <T>(operation = 'operation', result = {} as T) =>
      this.handleError(serviceName, operation, result);
  };

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status === 401 || error.status === 403) {

        //navigate /delete cookies or whatever
        //this.router.navigateByUrl('/login');
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
        return throwError(() => error.message); // or EMPTY may be appropriate here
      }
  
      if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('Un error ocurrido en: ' + serviceName + ' : ', error.error.message);
      } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(`Servicio del back-end ${serviceName} retorno error # ${error.status} ` + ` : ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError( () => 'Algo malo ha sucedido, por favor intenta de nuevo.');

    };
  }

}
