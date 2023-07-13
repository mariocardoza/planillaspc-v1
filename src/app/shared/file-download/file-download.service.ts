import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { endpoint } from "../../../environments/endpoint";
import { HttpErrorHandlerService, HandleError } from '../../core/service/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private handleError: HandleError;
  constructor(
    httpErrorHandler: HttpErrorHandlerService,
    private http: HttpClient,
  ) { 
    this.handleError = httpErrorHandler.createHandleError('fileDownloadService'); 
  }

  downloadFile(fileUrl: string): Observable<Blob> {
    const url = `${endpoint.api.download}`;
    let params = new HttpParams().set("filename", fileUrl);

    return this.http.get(url, { params: params,  responseType: 'blob'})
  }
}
