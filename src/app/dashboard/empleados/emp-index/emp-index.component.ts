import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { IEmpleado } from 'src/app/core/models/empleados/empleado';
@Component({
  selector: 'app-emp-index',
  templateUrl: './emp-index.component.html',
  styleUrls: ['./emp-index.component.scss']
})
export class EmpIndexComponent implements OnInit {
  empleados: IEmpleado[];
  totalRecords: number = 0;
  data:any;
  loading: boolean = true;
  constructor(private dashboardService: DashboardService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
   }

  ngOnInit(): void {
    this.buscarEmpleados()
  }

  buscarEmpleados(){
    this.dashboardService.buscarEmpleadosEmpresa(this.data.CodigoPGR).subscribe((res)=>{
      console.log(res.total)
      if(res.success){
        this.empleados = res.data;
        this.totalRecords = res.total
        this.loading = false
        console.log(this.empleados)
      }else{
        this.loading = false;
      }
    })

    
  }

}
