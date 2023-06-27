import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { endpoint } from 'src/environments/endpoint';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  public message: string;
  public progress: number;
  private apiUrl = endpoint.api.upload;
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  public uploadFile = (files) => {
    if (files.length === 0 ) return;

    let fileToUpload = <File>files[0];

    if (!this.validateFile(fileToUpload.name)) {
      return;
    }

    let FileSize : number = fileToUpload.size / 1024 / 1024;
    if (FileSize > 2) {
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post<any>(this.apiUrl, formData, { reportProgress: true, observe: 'events' }).subscribe(event =>{

      if (event.type === HttpEventType.UploadProgress){
        this.progress = Math.round(100 * event.loaded / event.total);
      } 
      else if (event.type === HttpEventType.Response) {
        this.message = 'Upload success.';
        this.onUploadFinished.emit(event.body);
      }
    });
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'jpg' 
    || ext.toLowerCase() == 'jpeg' 
    || ext.toLowerCase() == 'gif'
    || ext.toLowerCase() == 'png'
    || ext.toLowerCase() == 'pdf') {
        return true;
    }
    else {
        return false;
    }
  } 

}
