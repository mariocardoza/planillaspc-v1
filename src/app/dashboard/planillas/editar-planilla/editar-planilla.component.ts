import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DetallePlanilla } from 'src/app/core/models/detalle-planilla.interface';
import { Table } from 'primeng/table';
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-editar-planilla',
  templateUrl: './editar-planilla.component.html',
  providers: [MessageService],
  styleUrls: ['./editar-planilla.component.scss']
})


export class EditarPlanillaComponent implements OnInit {
  selectAll:boolean = false;
  carpetaInstaciada:string;
  @ViewChild("listaEmpleados") modalEmpleados: ElementRef;
  public response: { dbPath: '' }
  total: number = 0;
  empleadosPre: any;
  isSuccess = false;
  isError = false;
  message = '';
  data: any;
  token: string;
  planilla: any;
  codigoEstado: string;
  codigoTipoCuota: string;
  empleadoForm: FormGroup;
  empleados: DetallePlanilla[];
  planillaFormGroup: FormGroup;
  loading: boolean = false;
  loadingDUI: boolean = false;
  tipoCuotas = [
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
  editing: boolean = false;
  hasExpedient:boolean = false;
  actualfile:any = '';
  clonedEmpleado: { [s: string]: DetallePlanilla } = {};
  @ViewChild(Table, { read: Table }) pTable: Table;
  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private planillaService: PlanillaService,private messageService: MessageService,public modal: NgbModal,
    private fileService: FileDownloadService) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    this.carpetaInstaciada = 'planillas/ordenes';
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
      IdEncabezado:['',''],
      Observacion:['',''],
    });

    this.empleadoForm = this.formBuilder.group({
      DUIDemandado: ['', Validators.required],
      NombresDemandado: ['', Validators.required],
      ApellidosDemandado: ['',Validators.required],
      NombresDemandante: ['', Validators.required],
      CodigoExpediente: ['', Validators.required],
      NoExpediente: ['', ''],
      NoTarjeta: ['', ''],
      ApellidosDemandante: ['', Validators.required],
      Monto: ['', Validators.required],
      NoBeneficiarios: ['', Validators.required],
      IdDetalle: ['0', ''],
      IdEncabezado: ['', ''],
      OrdenDescuento: ['', Validators.required],
    });
  }

  onSubmit(){
    const dataPlanilla = {
      ...this.planillaFormGroup.value
    };

    this.planillaService.editarEncabezadoPlanilla(dataPlanilla).subscribe((result)=>{
      console.log(result['success'])
      if(result['success']){
        this.messageService.add({severity:'success', summary: 'Exito', detail:result['message']});
      }else{
        this.messageService.add({severity:'error', summary: 'Exito', detail:result['message']});
      }
    })
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
        this.planillaFormGroup.patchValue({Monto:result['monto']})
        this.total = result['monto'];
      }else{
        this.messageService.add({severity:'error', summary: 'Exito', detail:result['message']});
      }
    })
  }

  crearNuevo(modal){
    this.editing = false;
    this.empleadoForm.patchValue({DUIDemandado:''});
    this.empleadoForm.patchValue({OrdenDescuento:''});
    this.empleadoForm.patchValue({NombresDemandado:''});
    this.empleadoForm.patchValue({ApellidosDemandado:''});
    this.empleadoForm.patchValue({NombresDemandante:''});
    this.empleadoForm.patchValue({ApellidosDemandante:''});
    this.empleadoForm.patchValue({CodigoExpediente:''});
    this.empleadoForm.patchValue({NoExpediente:''});
    this.empleadoForm.patchValue({NoBeneficiarios:''});
    this.empleadoForm.patchValue({Monto:''});
    this.empleadoForm.patchValue({NoTarjeta:''});
    this.empleadoForm.patchValue({IdEncabezado:this.planilla.idEncabezado});
    this.empleadoForm.patchValue({IdDetalle:'0'});
    this.modal.open(modal,{ size: <any>'lg' });
  }

  onRowEditInit(empleado: DetallePlanilla,modal){
    this.editing = true;
    this.hasExpedient = true;
    this.empleadoForm.controls.OrdenDescuento.setValidators(this.hasExpedient ? null : [Validators.required]);
    this.empleadoForm.controls.OrdenDescuento.updateValueAndValidity();
    this.empleadoForm.patchValue({DUIDemandado:empleado.duIdemandado});
    this.empleadoForm.patchValue({NombresDemandado:empleado.nombresDemandado});
    this.empleadoForm.patchValue({ApellidosDemandado:empleado.apellidosDemandado});
    this.empleadoForm.patchValue({NombresDemandante:empleado.nombresDemandante});
    this.empleadoForm.patchValue({ApellidosDemandante:empleado.apellidosDemandante});
    this.empleadoForm.patchValue({CodigoExpediente:empleado.codigoExpediente});
    this.empleadoForm.patchValue({NoExpediente:empleado.noExpediente});
    this.empleadoForm.patchValue({NoBeneficiarios:empleado.noBeneficiarios});
    this.empleadoForm.patchValue({Monto:empleado.monto});
    this.empleadoForm.patchValue({NoTarjeta:empleado.noTarjeta});
    this.empleadoForm.patchValue({IdEncabezado:empleado.idEncabezado});
    this.empleadoForm.patchValue({IdDetalle:empleado.idDetalle});
    this.empleadoForm.patchValue({OrdenDescuento:empleado.ordenDescuento});
    this.actualfile = empleado.ordenDescuento;
    this.modal.open(modal,{ size: <any>'lg' });
    
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

  buscarDui(){
    this.loadingDUI = true;
    let dui: string = (this.empleadoForm.value.DUIDemandado);
    this.hasExpedient = true;
    const data = {
      dui : dui,
      codigoPagaduria: this.data.CodigoPagaduria,
      codigoEmpresa: this.data.CodigoPGR
    };
    this.planillaService.buscarExpediente(data).subscribe((res)=>{
      if(res.success){
        this.hasExpedient = true;
        this.messageService.add({severity:'success', summary: 'Exito', detail:'DUI válido'});
        //if(res.detalle.length  > 1){
          //this.empleadosPre = res.detalle 
          
          //this.modal.open(this.modalEmpleados,{ size: <any>'xl' });
        /*}else{
          this.empleadoForm.patchValue({CodigoExpediente:res.detalle[0].codigoExpediente})
        }*/
      }else{
        this.hasExpedient = true;
        this.messageService.add({severity:'error', summary: 'Error', detail:'DUI inválido'});
      }
      this.loadingDUI = false;
    })
    this.empleadoForm.controls.OrdenDescuento.setValidators(!this.hasExpedient ? null : [Validators.required]);
    this.empleadoForm.controls.OrdenDescuento.updateValueAndValidity();
  }

  AgregarAPlanilla(empleado){
    const newP: DetallePlanilla = {
      idEncabezado: this.planilla.idEncabezado,
      idDetalle: 0,
      duIdemandado: empleado.duiPersonaNatural,
      nombresDemandado: empleado.nombresPersonaNatural,
      apellidosDemandado: empleado.apellidosPersonaNatural,
      nombresDemandante: empleado.nombresPersonaE,
      apellidosDemandante: empleado.apellidosPersonaE,
      monto: empleado.montoCR,
      noBeneficiarios: empleado.cantidadB,
      noExpediente: empleado.noExpediente,
      noTarjeta: empleado.nTarjeta,
      codigoExpediente: empleado.codigoExpediente,
      observaciones: '',
    };

    this.planillaService.editarDetallePlanilla(newP,this.token).subscribe((result)=>{
      //console.log(result['success'])
      if(result['success']){
        this.getPlanilla(this.planilla.idEncabezado)
        this.messageService.add({severity:'success', summary: 'Exito', detail:result['message']});
        this.modal.dismissAll()
      }else{
        this.messageService.add({severity:'error', summary: 'Exito', detail:result['message']});
      }
    })

  }

  public uploadFinishedOrdenDescuento = (event) => {
    this.response = event;
    console.log(event)
    this.empleadoForm.patchValue({
      OrdenDescuento:  this.response.dbPath
    });     
  }


  verdetalle(empleado:DetallePlanilla){
    alert(empleado.apellidosDemandado)
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
    //this.onRowEditInit(newP);
  }

  onEditComplete(event){
   // console.log(this.planilla)
    let empleado = event.data;
    this.planillaService.editarDetallePlanilla(empleado,this.token).subscribe((result)=>{
      //console.log(result['success'])
      if(result['success']){
        //this.getPlanilla(empleado.idEncabezado)
        if(this.planilla.codigoEstado == '1'){
          this.messageService.add({severity:'success', summary: 'Exito', detail:result['message']});
        }
        this.planillaFormGroup.patchValue({Monto:result['monto']})
        this.total = result['monto'];
        
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:result['message']});
      }
    })
  }

  onEditInit(event): void {
    console.log(event);
    console.log("Edit Init Event Called");
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
        this.empleados = this.planilla.detalles
        this.codigoEstado = this.planilla.codigoEstado;
        this.codigoTipoCuota = this.planilla.codigoTipoCuota;
        this.planillaFormGroup.patchValue({NoMandamiento:this.planilla.noMandamiento})
        this.planillaFormGroup.patchValue({Periodo:this.planilla.periodo})
        this.planillaFormGroup.patchValue({CodigoTipoCuota:this.planilla.codigoTipoCuota})
        this.planillaFormGroup.patchValue({Observacion:this.planilla.observacion})
        this.planillaFormGroup.patchValue({Monto:this.planilla.monto})
        this.total = this.planilla.monto;
        this.planillaFormGroup.patchValue({IdEncabezado:this.planilla.idEncabezado})
        this.empleadoForm.patchValue({IdEncabezado:this.planilla.idEncabezado})
      }  
    })
  }

  procesarPlanilla(idEncabezado: number){
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
            this.getPlanilla(idEncabezado);
            this.messageService.add({severity:'success', summary: 'Exito', detail:'Planilla enviada a la PGR con éxito'});
          }
        });  
      }
    })
  }

  deleteSelected(){
    var input = document.querySelectorAll('input[name=selectedC]:checked');
    
    /*var domRepresentation = document.getElementsByClassName('checkbox');
    console.log(domRepresentation)*/
    //var angularElement = angular.element(domRepresentation);
    //const input = document.querySelectorAll('.checkbox');
    const detalles = Array();
    if (input.length > 0) {
      for(var i=0; i< input.length; i++){
        detalles.push({'idDetalle': parseInt(input[i].id),'idEncabezado':this.planilla.idEncabezado})
      }

      Swal.fire({
        title: '¿Esta seguro?',
        html: "Esta acción eliminará a los <strong>"+detalles.length+"</strong> empleados seleccionados de la planilla",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.planillaService.eliminadoMasivo(detalles).subscribe((res => {
            if(res['success']){
              this.messageService.add({severity:'success', summary: 'Exito', detail:res['message']});
              this.getPlanilla(this.planilla.idEncabezado)
            }else{
              this.messageService.add({severity:'error', summary: 'Exito', detail:res['message']});
            }
          }))
        }
      })
    }else{
      this.messageService.add({severity:'error', summary: 'Exito', detail:'Debe seleccionar al menos un empleado a eliminar'});
    }
  }

  toggleSelectAll(){
    if(this.toggleSelectAll){
      this.empleados.forEach(o => o.selected = this.selectAll)
    }else{
      this.empleados.forEach(o => o.selected = true)
    }
  }

  downloadURLFile() {
    let strUrlFile = this.empleadoForm.controls.OrdenDescuento.value;
    let filename = strUrlFile.substring(strUrlFile.lastIndexOf('\\')+1);
    this.fileService.downloadFile(strUrlFile).subscribe(response => {
			saveAs(response, filename);
		}), error => this.messageService.add({severity:'error', summary: 'Error', detail:''}), () => this.messageService.add({severity:'success', summary: 'Exito', detail:''})
  }


}
