import { Component, OnInit } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { LazyLoadEvent } from 'primeng/api';
import Swal from "sweetalert2";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  providers: [MessageService],
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  planillas: any = [];
  data:any;
  private lastTableLazyLoadEvent: LazyLoadEvent;
  token: string;
  meses = [
    {value:'01', name:'Enero'},
    {value:'02', name:'Febrero'},
    {value:'03', name:'Marzo'},
    {value:'04', name:'Abril'},
    {value:'05', name:'Mayo'},
    {value:'06', name:'Junio'},
    {value:'07', name:'Julio'},
    {value:'08', name:'Agosto'},
    {value:'08', name:'Septiembre'},
    {value:'10', name:'Octubre'},
    {value:'11', name:'Noviembre'},
    {value:'12', name:'Diciembre'},
  ];
  tipoCuotas = [
    {value:'1', name:'Cuota alimenticia'},
    {value:'2', name:'Bonificaciones'},
    {value:'3', name:'Aguinaldos'},
    {value:'4', name:'Indemnizaciones'},
    {value:'0', name:'Otras prestaciones'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Enviada'},
    {value:'3', name:'Procesada'},
    {value:'4', name:'Anulada'},
  ];
  totalRecords: number = 0;
  constructor(private planillaService: PlanillaService, private messageService: MessageService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    
  }

  obtenerPlanillas(event: LazyLoadEvent){
    this.lastTableLazyLoadEvent = event;
    console.log(event)
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'fechaHoraRegistro').subscribe((result) => {
      this.planillas = result['data'];
      this.totalRecords = result['registros'];
    });
  }

  procesarPlanilla(idEncabezado){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción guardará la planilla y ya no podrá hacer cambios en ella",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Continuar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.planillaService.enviarPlanilla(idEncabezado).subscribe((result) => {
          if(result.success){
            this.obtenerPlanillas(this.lastTableLazyLoadEvent);
            this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla enviada a la PGR con éxito'});
          }
        });  
      }
    })
  }

  buscarTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    return valor.name;
  }

  buscarEstadoPlanilla(codigoEstado){
    var valor = this.codigoEstados.find(e => e.value === codigoEstado);
    return valor.name;
  }

  claseEstadoPlanilla(codigoEstado){
    if(codigoEstado==1){
      return 'primary';
    }else{
      if(codigoEstado==4){
        return 'danger';
      }else{
        return 'success';
      }
    }
  }

  anularPlanilla(idEncabezado){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción anulará la planilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.planillaService.anularPlanilla(idEncabezado).subscribe((res)=>{
          if(res['success']){
            this.obtenerPlanillas(this.lastTableLazyLoadEvent);
            this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla anulada con éxito'});
          }else{
            this.messageService.add({severity:'error', summary: 'Error', detail:'Ocurrió un error al anular la planilla'});
          }
        })
      }
    })
  }

}
