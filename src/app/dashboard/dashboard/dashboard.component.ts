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
  empleados: number = 0;
  data:any;
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'4', name:'Anulada'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
  ];
  constructor(private dashboardService: DashboardService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
   }

  ngOnInit(): void {
    this.obtenerEstadisticas();
  }

  buscarEstadoPlanilla(codigoEstado){
    var valor = this.codigoEstados.find(e => e.value === codigoEstado);
    return valor.name;
  }

  obtenerEstadisticas(){
    this.dashboardService.estadisticasDashboard(this.data.CodigoEmpresa, this.data.CodigoRol).subscribe((res)=>{
      console.log(res)
      if(res.success){
        this.planillas = res.planillas;
        this.montos = res.montos;
        this.empleados = res.empleados
      }
    });
  }

}
