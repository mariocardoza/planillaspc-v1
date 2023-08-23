import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/service/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  planillas:number = 0;
  montos:number = 0;
  data:any;
  constructor(private dashboardService: DashboardService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
   }

  ngOnInit(): void {
    this.obtenerEstadisticas();
  }

  obtenerEstadisticas(){
    this.dashboardService.estadisticasDashboard(this.data.CodigoEmpresa).subscribe((res)=>{
      console.log(res)
      if(res.success){
        this.planillas = res.planillas;
        this.montos = res.montos;
      }
    });
  }

}
