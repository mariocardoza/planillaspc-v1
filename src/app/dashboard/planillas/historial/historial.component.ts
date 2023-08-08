import { Component, OnInit } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  planillas: any = [];
  data:any;
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
    {value:'3', name:'Aguinaldos'},
    {value:'0', name:'Otras prestaciones'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Enviada'},
    {value:'3', name:'Procesada'},
  ];
  totalRecords: number = 0;
  constructor(private planillaService: PlanillaService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    
  }

  obtenerPlanillas(event: LazyLoadEvent){
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,this.token,event.first || 0,event.rows || 10).subscribe((result) => {
      this.planillas = result['data'];
      this.totalRecords = result['registros'];
    });
  }

  buscarTipoCuota(codigoTipoCuota){
    var valor = this.tipoCuotas.find(e => e.value === codigoTipoCuota);
    return valor.name;
  }

  buscarEstadoPlanilla(codigoEstado){
    var valor = this.codigoEstados.find(e => e.value === codigoEstado);
    return valor.name;
  }

}
