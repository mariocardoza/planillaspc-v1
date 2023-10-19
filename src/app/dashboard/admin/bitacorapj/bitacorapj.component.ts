import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-bitacorapj',
  templateUrl: './bitacorapj.component.html',
  styleUrls: ['./bitacorapj.component.scss']
})
export class BitacorapjComponent implements OnInit {
  totalRecords: number = 0;
  loading: boolean = true;
  private lastTableLazyLoadEvent: LazyLoadEvent;
  token: any;
  private data: any;
  bitacoras: any = [];
  constructor(private dashboardService: DashboardService, private toastService: ToastService) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
    if(this.data.CodigoRol == 'U'){
      window.location.href = 'dashboard';
    }
  }

  ngOnInit(): void {
  }

  buscarBitacoras(event: LazyLoadEvent){
    this.loading = true
    this.lastTableLazyLoadEvent = event;
    setTimeout(() => {
      this.dashboardService.bitacoraJuridicas(this.token,event.first || 0,event.rows || 10,this.data.CodigoPagaduria,this.data.CodigoRol).subscribe((res) => {
        if (res.success) {
          this.bitacoras = res.data
          this.totalRecords = res.registros
          this.loading = false
        } else {
          this.toastService.showError("No se pudo obtener la información","Recargue nuevamente")
        }
      })
  }, 1000);
    
  }

}
