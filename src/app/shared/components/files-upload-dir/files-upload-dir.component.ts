import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { endpoint } from 'src/environments/endpoint';
import { MessageService } from 'primeng/api';
import { FileDownloadService } from '../../file-download/file-download.service';

@Component({
  selector: 'app-files-upload-dir',
  providers: [MessageService],
  templateUrl: './files-upload-dir.component.html',
  styleUrls: ['./files-upload-dir.component.scss']
})
export class FilesUploadDirComponent implements OnInit {
  myFiles: string[] = [];
  loading: boolean = false;
  image: string | SafeUrl = '';
  embed: string | SafeUrl = '';
  selectedPdf: string | SafeResourceUrl = '';
  @Input() Directorio: string;
  @Input() actualFile: any = '';
  @Input() Ocultar: boolean = false;
  @Input() field: any;

  @Output() public onUploadFinished = new EventEmitter();
  @Output() public onDownload = new EventEmitter();

  public message: string;
  public progress: number = 0;

  currentIndex: any = -1;
  showFlag: any = false;

  imageObject: Array<object> = []

  private apiUrlDir = endpoint.api.uploadDir;
  private apiUrl = endpoint.api.upload;

  constructor(
    private http: HttpClient, 
    private sanitizer: DomSanitizer, 
    private modalService: NgbModal,
    private messageService: MessageService,
    private fileService: FileDownloadService
  ) { }

  ngOnInit(): void {
    if (this.actualFile) {
      this.fileService.downloadFile(this.actualFile).subscribe(response => {
        // console.log(response);
        // console.log("response", window.URL.createObjectURL(response));
        if (this.getTypeFile(this.actualFile).toLowerCase() === 'pdf') {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onload = e => this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(
            reader.result.toString()
          );
        } else {
          this.image = this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(response)
          );

          this.imageObject.push({
            image: window.URL.createObjectURL(response),
            thumbImage: window.URL.createObjectURL(response),
            title: "Visualización completa",
          });
        }
      }), error => this.messageService.add({severity:'error', summary: 'Error', detail:'Tipo de archivo inválido.'}), () => console.info('Archivo descargado correctamente');

    }
  }

  public uploadFileD = (files) => {

    if (files.length === 0) return;

    if (files.length > 0) this.myFiles[0] = files[0];
    this.loading = true;

    let fileToUpload = <File>files[0];

    if (!this.validateFile(fileToUpload.name)) {
      this.messageService.add({severity:'error', summary: 'Error', detail:'Tipo de archivo inválido.'});
      //this.toastService.show("Tipo de archivo inválido.", { classname: 'bg-dark text-light', delay: 3000, header: 'Notificación!' });
      this.loading = false;
      this.myFiles = [];
      return;
    }

    this.image = '';
    this.selectedPdf = '';
    this.embed = '';

    let FileSize: number = fileToUpload.size / 1024 / 1024;

    if (FileSize > 2) {
      this.loading = false;
      this.messageService.add({severity:'error', summary: 'Error', detail:'Archivo excede el tamaño máximo..'});
      //this.toastService.show("Archivo excede el tamaño máximo.", { classname: 'bg-dark text-light', delay: 3000, header: 'Notificación!' });
      this.image = '';
      this.selectedPdf = '';
      this.embed = '';
      this.myFiles = [];
      return;
    }

    if (this.getTypeFile(fileToUpload.name).toLowerCase() === 'pdf') {

      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);
      reader.onload = e => this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(
        reader.result.toString()
      );

    } else if(this.getTypeFile(fileToUpload.name).toLowerCase() === 'tiff'){

      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);
      reader.onload = e => {
        this.embed = this.sanitizer.bypassSecurityTrustUrl( reader.result.toString());
      };

    }else {

      this.image = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(fileToUpload)
      );

      this.imageObject = [];

      this.imageObject.push({
        image: window.URL.createObjectURL(fileToUpload),
        thumbImage: window.URL.createObjectURL(fileToUpload),
        title: "Visualización completa",
      });

    }

    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    let url = this.apiUrl;

    if (this.Directorio) {
      formData.append('directoryName', this.Directorio);
      url = this.apiUrlDir;
    }

    this.http.post<any>(url, formData, { reportProgress: true, observe: 'events' }).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      }
      else if (event.type === HttpEventType.Response) {
        this.message = 'Upload with directory success.';
        this.onUploadFinished.emit(event.body);
        this.loading = false;
        setTimeout(() => {
          this.progress = 0;
          // And any other code that should run only after 5s
        }, 3000);

      }
    });

  }

  visualizarArchivo(content){
    console.log(content)
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "xl" });
  }


  getTypeFile(name: String) {
    return name.substring(name.lastIndexOf('.') + 1);
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'jpg'
      || ext.toLowerCase() == 'jpeg'
      || ext.toLowerCase() == 'gif'
      || ext.toLowerCase() == 'png'
      || ext.toLowerCase() == 'tiff'
      || ext.toLowerCase() == 'pdf') {
      return true;
    }
    else {
      return false;
    }
  }

  descargarArchivo() {
    this.onDownload.emit(true);
  }

  eliminarArchivo() {
    this.onUploadFinished.emit({ dbPath: '' });
    this.image = '';
    this.selectedPdf = '';
    this.embed = '';
    this.myFiles = [];
  }

  showLightbox() {
    this.currentIndex = 1;
    this.showFlag = true;

  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

}
