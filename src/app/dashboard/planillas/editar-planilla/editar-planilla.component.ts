import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DetallePlanilla } from 'src/app/core/models/detalle-planilla.interface';
import { Table } from 'primeng/table';
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editar-planilla',
  templateUrl: './editar-planilla.component.html',
  providers: [MessageService],
  styleUrls: ['./editar-planilla.component.scss']
})



export class EditarPlanillaComponent implements OnInit {
  isSuccess = false;
  isError = false;
  message = '';
  data: any;
  token: string;
  planilla: any;
  empleadoForm: FormGroup;
  empleados: DetallePlanilla[];
  planillaFormGroup: FormGroup;
  loading: boolean = false;
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
  clonedEmpleado: { [s: string]: DetallePlanilla } = {};
  @ViewChild(Table, { read: Table }) pTable: Table;
  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private planillaService: PlanillaService,private messageService: MessageService,public modal: NgbModal) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.getPlanilla(id)
    this.planillaFormGroup = this.formBuilder.group({
      Periodo: ['', Validators.required],
      CodigoTipoCuota: ['', Validators.required],
      NoMandamiento: ['0',''],
      CodigoEstado: ['1',''],
      Monto: ['',''],
      CodigoPagaduria:[this.data.CodigoPagaduria,''],
      CodigoEmpresa:[this.data.CodigoEmpresa,''],
      Observacion:['',''],
    });

    this.empleadoForm = this.formBuilder.group({
      DUIDemandado: ['', Validators.required],
      NombresDemandado: ['', Validators.required],
      ApellidosDemandado: ['',Validators.required],
      NombresDemandante: ['', Validators.required],
      CodigoExpediente: ['', ''],
      NumeroExpediente: ['', ''],
      NumeroTarjeta: ['', ''],
      ApellidosDemandante: ['', Validators.required],
      Monto: ['', Validators.required],
      NoBeneficiarios: ['', Validators.required],
      IdDetalle: ['0', ''],
      IdEncabezado: ['', ''],
    });
  }

  onSubmit(){
    const dataF: DetallePlanilla = {
      ...this.empleadoForm.value
    };

    console.log(dataF)
  }

  onSubmitEmpleado(){
    const dataF: DetallePlanilla = {
      ...this.empleadoForm.value
    };

    this.planillaService.editarDetallePlanilla(dataF,this.token).subscribe((result)=>{
      console.log(result['success'])
      if(result['success']){
        this.getPlanilla(dataF['IdEncabezado'])
        this.modal.dismissAll()
        this.messageService.add({severity:'success', summary: 'Exito', detail:result['message']});
      }else{
        this.messageService.add({severity:'error', summary: 'Exito', detail:result['message']});
      }
    })
  }

  crearNuevo(modal){
    this.modal.open(modal,{ size: <any>'lg' });
  }

  onRowEditInit(empleado: DetallePlanilla){
    //console.log(empleado)
    this.clonedEmpleado[empleado.idDetalle] = { ...empleado };
    //console.log(this.clonedEmpleado)
  }

  onRowDelete(idDetalle: number,idEncabezado:number){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción eliminará el empleado de la planilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.planillaService.eliminarEmpleadoPlanilla(idDetalle,idEncabezado).subscribe((res)=>{
          if(res['success']){
            this.messageService.add({severity:'success', summary: 'Exito', detail:res['message']});
            this.getPlanilla(idEncabezado)
          }else{
            this.messageService.add({severity:'error', summary: 'Exito', detail:res['message']});
          }
        })
      }
    })
  }

  onAddNewRow(){
    const newP: DetallePlanilla = {
      idEncabezado: this.planilla.idEncabezado,
      idDetalle: 0,
      duIdemandado: '',
      nombresDemandado: '',
      apellidosDemandado: '',
      nombresDemandante: '',
      apellidosDemandante: '',
      monto: 0,
      noBeneficiarios: 0,
      noExpediente: '',
      noTarjeta: '',
      codigoExpediente: 0,
      observaciones: '',
    };
    //console.log(newP)
    this.empleados.unshift(newP);
    //Caution: guard again dataKey here
    this.pTable.editingRowKeys[newP[this.pTable.dataKey]] = true;
    this.onRowEditInit(newP);
  }

  onRowEditSave(empleado: DetallePlanilla){
    this.planillaService.editarDetallePlanilla(empleado,this.token).subscribe((result)=>{
      console.log(result['success'])
      if(result['success']){
        this.getPlanilla(empleado.idEncabezado)
        this.messageService.add({severity:'success', summary: 'Exito', detail:result['message']});
      }else{
        this.messageService.add({severity:'error', summary: 'Exito', detail:result['message']});
      }
    })
  }

  onRowEditCancel(empleado:DetallePlanilla,index: number){
    //this.empleados[index] = this.clonedEmpleado[empleado.idDetalle];
    //console.log(this.clonedEmpleado[empleado.idDetalle])
    //delete this.empleados[index]
    /*if(this.empleados[empleado.idDetalle].idDetalle == 0){
      this.empleados.shift();
    }*/
  }

  getPlanilla(idEncabezado){
    this.planillaService.obtenerPlanilla(idEncabezado,this.token).subscribe((result) => {
      if(result['success']){
        this.planilla = result['data']
        this.empleados = this.planilla.empleados
        this.planillaFormGroup.patchValue({NoMandamiento:this.planilla.noMandamiento})
        this.planillaFormGroup.patchValue({Periodo:this.planilla.periodo})
        this.planillaFormGroup.patchValue({CodigoTipoCuota:this.planilla.codigoTipoCuota})
        this.planillaFormGroup.patchValue({Observacion:this.planilla.observacion})
        this.planillaFormGroup.patchValue({Monto:this.planilla.monto})
        this.empleadoForm.patchValue({IdEncabezado:this.planilla.idEncabezado})
      }
      
    })
    
    //
  }

}
