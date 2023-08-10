import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DetallePlanilla } from 'src/app/core/models/detalle-planilla.interface';
import { Table } from 'primeng/table';
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
  empleados: DetallePlanilla[];
  planillaFormGroup: FormGroup;
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
  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private planillaService: PlanillaService,private messageService: MessageService) { 
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
  }

  onSubmit(){

  }

  onRowEditInit(empleado: DetallePlanilla){
    //console.log(empleado)
    this.clonedEmpleado[empleado.idDetalle] = { ...empleado };
    //console.log(this.clonedEmpleado)
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
    console.log(empleado)
    this.planillaService.editarDetallePlanilla(empleado,this.token).subscribe((result)=>{
      if(result){
        this.getPlanilla(empleado.idEncabezado)
        this.messageService.add({severity:'success', summary: 'Exito', detail:'Empleado actualizado'});
      }
    })
  }

  onRowEditCancel(empleado:DetallePlanilla,index: number){
    this.empleados[index] = this.clonedEmpleado[empleado.idDetalle];
    //console.log(this.empleados[empleado.idDetalle])
    //delete this.empleados[empleado.idDetalle];
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
      }
      
    })
    
    //
  }

}
