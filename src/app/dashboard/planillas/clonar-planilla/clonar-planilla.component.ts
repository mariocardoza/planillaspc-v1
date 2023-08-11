import { Component, OnInit } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { LazyLoadEvent } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-clonar-planilla',
  templateUrl: './clonar-planilla.component.html',
  providers: [MessageService],
  styleUrls: ['./clonar-planilla.component.scss']
})
export class ClonarPlanillaComponent implements OnInit {
  planillas: any = [];
  data:any;
  token: string;
  clonarForm: FormGroup;
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
  constructor(private planillaService: PlanillaService,public modal: NgbModal,private formBuilder: FormBuilder, private messageService: MessageService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    this.clonarForm = this.formBuilder.group({
      Periodo: ['',Validators.required],
      CodigoTipoCuota: ['', Validators.required],
      NoMandamiento: ['0',''],
      CodigoEstado: ['1',''],
      CodigoPagaduria:[this.data.CodigoPagaduria,''],
      CodigoEmpresa:[this.data.CodigoEmpresa,''],
      Observacion:['',''],
      IdClonar:['',''],
    })
  }

  onSubmit(){
    const data = {
      ...this.clonarForm.value
    }
    this.planillaService.clonarPlanilla(data,this.token).subscribe((res)=>{
      if(res['success']){
        this.modal.dismissAll();
        this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla correctamente clonada'});
      }
    })
  }

  clonar(planilla,modal){
    console.log(planilla)
    this.clonarForm.patchValue({CodigoTipoCuota:planilla.codigoTipoCuota});
    this.clonarForm.patchValue({IdClonar:planilla.idEncabezado});
    this.modal.open(modal);
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