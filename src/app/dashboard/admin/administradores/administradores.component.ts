import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { LazyLoadEvent } from 'primeng/api';
import { ToastService } from 'src/app/shared/toast/toast.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss']
})
export class AdministradoresComponent implements OnInit {
  usuarios = [];
  totalRecords: number = 0;
  token: string;
  data: any = [];
  private lastTableLazyLoadEvent: LazyLoadEvent;

  constructor(private dashboardService: DashboardService, private toastService: ToastService, private router: Router) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
    if(this.data.CodigoRol != 'R'){
      window.location.href = 'dashboard';
    }
   }

  ngOnInit(): void {
  }

  buscarUsuarios(event: LazyLoadEvent){
    this.lastTableLazyLoadEvent = event;
    this.dashboardService.adminsList(this.token,event.first || 0,event.rows || 10).subscribe((res) => {
      if (res.success) {
        this.usuarios = res.data
        this.totalRecords = res.registros
      } else {
        this.toastService.showError("No se pudo obtener la información","Recargue nuevamente")
      }
    })
  }

  desactivarUsuario(usuario){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción deshabilitará el acceso a sistema EPlanilla al usuario administrador",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.deactiveUser(usuario,this.token).subscribe((res) => {
          if(res){
            this.toastService.showSuccess("Actualización realizada con éxito","Se envió correctamente el correo electrónico de notificación")
            this.buscarUsuarios(this.lastTableLazyLoadEvent);
          }
        });
      }
    })
  }

  editarUsuario(id){
    this.router.navigate(["/dashboard/administradores/"+id+"/edit"])
  }

  activarUsuario(usuario){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción habilitará el acceso a sistema EPlanilla al usuario administrador",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.activeUser(usuario,this.token).subscribe((res) => {
          if(res){
            this.toastService.showSuccess("Actualización realizada con éxito","Se envió correctamente el correo electrónico de notificación")
            this.buscarUsuarios(this.lastTableLazyLoadEvent);
          }
        });
      }
    })
  }

}
