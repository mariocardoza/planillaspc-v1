import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { LazyLoadEvent } from 'primeng/api';
import { ToastService } from 'src/app/shared/toast/toast.service';
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

  constructor(private dashboardService: DashboardService, private toastService: ToastService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
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

  }

}
