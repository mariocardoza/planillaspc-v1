import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs } from 'file-saver';
import { ToastService } from 'src/app/shared/toast/toast.service';
import {Observable, Subject} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-usuario-activos',
  templateUrl: './usuario-activos.component.html',
  styleUrls: ['./usuario-activos.component.scss']
})
export class UsuarioActivosComponent implements OnInit {
  private lastTableLazyLoadEvent: LazyLoadEvent;
  http: HttpClient;
  private data: any;
  token: any;
  constructor(http: HttpClient,private router:Router,private dashboardService: DashboardService,private _sanitizer: DomSanitizer,private fileService: FileDownloadService,public toastService: ToastService,public modal: NgbModal) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }
  totalRecords: number = 0;
  usuarios: any = [];

  ngOnInit(): void {
    //this.buscarUsuarios();
    if(this.data.CodigoRol == 'U'){
      this.router.navigate(['/dashboard/403'])
    }
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
    this.dashboardService.usersActive(this.token,this.data.CodigoRol,this.data.CodigoPagaduria,event.first || 0,event.rows || 10).subscribe((res) => {
      if (res.success) {
        this.usuarios = res.data
        this.totalRecords = res.registros
      } else {
        this.toastService.showError("No se pudo obtener la información","Recargue nuevamente")
      }
    })
  }

  editar(codigoPersona){
    this.router.navigate(["dashboard/editar-usuario/"+codigoPersona])
  }

  desactivarUsuario(codigoEmpresa){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción deshabilitará el acceso a sistema EPlanilla al usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.deactiveUser(codigoEmpresa,this.token).subscribe((res) => {
          if(res){
            this.toastService.showSuccess("Actualización realizada con éxito","Se envió correctamente el correo electrónico de notificación")
            this.buscarUsuarios(this.lastTableLazyLoadEvent);
          }
        });
      }
    })
    
  }

}
