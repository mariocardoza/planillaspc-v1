import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs } from 'file-saver';
import { ToastService } from 'src/app/shared/toast/toast.service';
import {Observable, Subject} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { LazyLoadEvent } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-usuarios-pendientes',
  providers: [MessageService],
  templateUrl: './usuarios-pendientes.component.html',
  styleUrls: ['./usuarios-pendientes.component.scss']
})
export class UsuariosPendientesComponent implements OnInit {
  
  @ViewChild("mail") modalMail: ElementRef;
  http: HttpClient;
  private lastTableLazyLoadEvent: LazyLoadEvent;
  private data: any;
  mensaje:string;
  idUsuario: number;
  token: any;
  loading:boolean = false;
  public Editor = ClassicEditor;
  constructor(http: HttpClient,private messageService: MessageService,public modalService: NgbModal,private router: Router,private primengConfig: PrimeNGConfig,private dashboardService: DashboardService,private _sanitizer: DomSanitizer,private fileService: FileDownloadService,public toastService: ToastService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }
  usuarios: any = [];
  totalRecords: number = 0;
    
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.mensaje = '';
    if(this.data.CodigoRol == 'U'){
      this.router.navigate(['/dashboard'])
    }
    //this.buscarUsuarios();
  }

  descargarArchivo(urlImagen) {
    console.log(urlImagen)
    let filename = urlImagen.substring(urlImagen.lastIndexOf('\\')+1);
    this.fileService.downloadFile(urlImagen).subscribe(response => {
			saveAs(response, filename);
		}), error => console.log('error'), () => console.info('Archivo descargado correctamente');
  }

  buscarUsuarios(event: LazyLoadEvent){
    this.lastTableLazyLoadEvent = event;
    this.dashboardService.usersPending(this.token,this.data.CodigoRol,this.data.CodigoPagaduria,event.first || 0,event.rows || 10).subscribe((res) => {
      if (res.success) {
        this.usuarios = res.data
        this.totalRecords = res.registros
      } else {
        this.toastService.showError("No se pudo obtener la información","Recargue nuevamente")
      }
    })
  }

  getTypeFile(name: String) {
    return name.substring(name.lastIndexOf('.') + 1);
}

verUsuario(usuario){
  console.log(usuario)
}

enviarMensaje(idUsuario){
  this.idUsuario = idUsuario
  this.modalService.open(this.modalMail,{ size: <any>'lg' });
  //alert(idUsuario)
}

sendMail(){
  this.loading = true;
  this.dashboardService.sendMail(this.idUsuario,this.mensaje).subscribe((res)=>{
    if(res){
      this.loading = false;
      this.mensaje = '';
      this.messageService.add({severity:'success', summary: 'Exito', detail:"Correo electrónico enviado con éxito"});
      //this.modalService.dismissAll()
    }else{
      this.loading = false;
      this.messageService.add({severity:'danger', summary: 'Exito', detail:"Correo electrónico no pudo enviarse"});
    }
  })
}

onChange({ editor }: ChangeEvent) {
  const data = editor.getData();
  this.mensaje = data;
}

  activarUsuario(codigoEmpresa){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción habilitará el acceso a sistema EPlanilla al usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.activeUser(codigoEmpresa,this.token).subscribe((res) => {
          if(res){
            this.toastService.showSuccess("Actualización realizada con éxito","Se envió correctamente el correo electrónico de notificación")
            this.buscarUsuarios(this.lastTableLazyLoadEvent);
          }
        });
      }
    })
    
  }

}
