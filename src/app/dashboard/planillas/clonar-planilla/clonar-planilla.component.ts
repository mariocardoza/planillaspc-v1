import { Component, OnInit } from '@angular/core';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { LazyLoadEvent } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EncryptService } from 'src/app/core/service/encrypt.service';

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
  loading: boolean = false;
  cuotas: number = 1;
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
  public tipoCuotas = [
    {value:'1', name:'Cuota alimenticia'},
    {value:'2', name:'Bonificaciones'},
    {value:'3', name:'Aguinaldos'},
    {value:'4', name:'Indemnizaciones'},
    {value:'0', name:'Otras prestaciones'},
  ];
  codigoEstados = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'4', name:'Anulada'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
  ];
  totalRecords: number = 0;
  constructor(private planillaService: PlanillaService,public modal: NgbModal,private formBuilder: FormBuilder, private messageService: MessageService, private router: Router,
    private encryptService: EncryptService) {
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
      TipoClonar: ['',Validators.required],
      CodigoPagaduria:[this.data.CodigoPagaduria,''],
      CodigoEmpresa:[this.data.CodigoEmpresa,''],
      Observacion:['',''],
      IdClonar:['',''],
      Monto:[0,''],
    })
  }

  conMontos(){
    let tipoclonar = this.clonarForm.controls.TipoClonar.value;
    this.cuotas = tipoclonar;
    this.clonarForm.controls.Monto.setValidators(this.cuotas == 1 ? null : [Validators.required]);
    this.clonarForm.controls.Monto.updateValueAndValidity();
  }

  claseEstadoPlanilla(codigoEstado){
    if(codigoEstado==1){
      return 'primary';
    }else{
      if(codigoEstado == 2){
        return 'warning';
      }
      if(codigoEstado==4){
        return 'danger';
      }else{
        return 'success';
      }
    }
  }

  onSubmit(){
    const data = {
      ...this.clonarForm.value
    }
    this.loading = true;
    this.planillaService.clonarPlanilla(data,this.token).subscribe((res)=>{
      if(res['success']){
        this.loading = false;
        this.modal.dismissAll();
        this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla correctamente clonada'});
        const idEncrypt = this.encryptService.encrypt(res['idEncabezado']);
        this.router.navigate(['/dashboard/planillas/'+idEncrypt+'/edit']);

      }
      this.loading = false;
    })
  }

  clonar(planilla,modal){
    console.log(planilla)
    this.clonarForm.patchValue({CodigoTipoCuota:planilla.codigoTipoCuota});
    this.clonarForm.patchValue({IdClonar:planilla.idEncabezado});
    this.modal.open(modal);
  }

  obtenerPlanillas(event: LazyLoadEvent){
    this.planillaService.obtenerPlanillas(this.data.CodigoEmpresa,0,event.globalFilter || '',event.first || 0,event.rows || 10,event.sortOrder || 1,event.sortField || 'fechaHoraRegistro').subscribe((result) => {
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
    if(valor){
      return valor.name;
    }else{
      return 'sin definir';
    }
    
  }

}
