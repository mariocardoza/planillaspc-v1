import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/core/service/empleados.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IEmpleado } from 'src/app/core/models/empleados/empleado';

@Component({
  selector: 'app-empd-index',
  templateUrl: './empd-index.component.html',
  providers: [MessageService],
  styleUrls: ['./empd-index.component.scss']
})
export class EmpdIndexComponent implements OnInit {
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  carpetaInstaciada: string;
  actualfile: string = '';
  empleados: IEmpleado[];
  totalRecords: number = 0;
  data:any;
  isCreating: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;
  constructor(private empleadosService: EmpleadosService,private messageService: MessageService) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
  }

  ngOnInit(): void {
    this.buscarEmpleados()
  }

  onRestore(idRegistro:number){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción habilitará el empleado nuevamente a la empresa",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadosService.activarEmpleado(idRegistro).subscribe((result) => {
          if(result.success){
            this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
            this.buscarEmpleados()
          }else{
            this.messageService.add({severity:'error', summary: 'Exito', detail:result.message});
          }
        })
      }
    })
  }

  buscarEmpleados(){
    this.empleadosService.buscarEmpleadosInactivosEmpresa(this.data.CodigoPGR,this.data.CodigoPagaduria).subscribe((res)=>{
      if(res.success){
        this.empleados = res.data;
        this.totalRecords = res.total
        this.loading = false
      }else{
        this.loading = false;
      }
    })
  }

}