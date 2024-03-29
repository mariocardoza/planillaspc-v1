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
import { EncryptService } from 'src/app/core/service/encrypt.service';
import * as FileSaver from 'file-saver';
import * as jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-editar-planilla',
  templateUrl: './editar-planilla.component.html',
  providers: [MessageService],
  styleUrls: ['./editar-planilla.component.scss']
})


export class EditarPlanillaComponent implements OnInit {
  selectAll:boolean = false;
  esDui: boolean = false;
  DuiValido: boolean = false;
  nombreEliminar:string = '';
  carpetaInstaciada:string;
  documentos: any = [];
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
  cols: any[];
  exportpdf: any;
  exportColumns: any[];
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

  codigoEstadosTimeline = [
    {value:'1', name:'En proceso'},
    {value:'2', name:'Pendiente de emitir mandamiento de pago'},
    {value:'3', name:'Mandamiento de pago emitido'},
    {value:'5', name:'Pago completado'},
    {value:'6', name:'Finalizada'},
  ];

  

  track: any = [];

  editing: boolean = false;
  hasExpedient:boolean = false;
  actualfile:any = '';
  clonedEmpleado: { [s: string]: DetallePlanilla } = {};
  @ViewChild(Table, { read: Table }) pTable: Table;
  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private planillaService: PlanillaService,private messageService: MessageService,public modal: NgbModal,
    private fileService: FileDownloadService,private encryptService: EncryptService) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    this.carpetaInstaciada = 'planillas/ordenes';
    if(this.data != null){
      this.token = this.data.Token;
    }
    
  }

  ngOnInit(): void {
    let id = this.encryptService.decrypt(this.route.snapshot.params.id);
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
      TipoDocumentoI: ['',Validators.required]
    });

    this.cols = [
      { field: 'idDetalle', header: 'idDetalle' },
      { field: 'idEncabezado', header: 'idEncabezado' },
      { field: 'apellidosDemandado', header: 'apellidosDemandado' },
      { field: 'nombresDemandado', header: 'nombresDemandado' },
      { field: 'apellidosDemandante', header: 'apellidosDemandante' },
      { field: 'nombresDemandante', header: 'nombresDemandante' },
      { field: 'duIdemandado', header: 'duIdemandado' },
      { field: 'monto', header: 'monto' },
      { field: 'noBeneficiarios', header: 'noBeneficiarios' },
      { field: 'noTarjeta', header: 'noTarjeta' },
      { field: 'noExpediente', header: 'noExpediente' },
      { field: 'observaciones', header: 'observaciones' },
      { field: 'codigoExpediente', header: 'codigoExpediente' },
      { field: 'tipoDocumentoI', header: 'tipoDocumentoI' }
  ];

  this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  onChangeS(data) {
    if(data.value == 'D'){
      this.esDui = true;
    }else{
      this.esDui = false;
    }
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
    this.DuiValido = false;
    this.empleadoForm.controls.OrdenDescuento.setValidators([Validators.required]);
    this.empleadoForm.controls.OrdenDescuento.updateValueAndValidity();
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
    this.empleadoForm.controls.OrdenDescuento.setValidators(null);
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
    this.empleadoForm.patchValue({TipoDocumentoI:empleado.tipoDocumentoI})
    if(empleado.tipoDocumentoI == 'D'){
      this.esDui = true;
      this.DuiValido = true;
    }
    this.actualfile = empleado.ordenDescuento;
    this.modal.open(modal,{ size: <any>'lg' });
    
  }

  onRowDelete(idDetalle: number,idEncabezado:number,n:string,a:string){
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción eliminará el empleado "+n+ " "+a+" de la planilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¿Completamento seguro?',
          text: "Esta acción eliminará el empleado "+n+ " "+a+" de la actual planilla",
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
                this.messageService.add({severity:'error', summary: 'Error', detail:res['message']});
              }
            })
          }
        })
      }
    })
  }

  /*exportPdf() {
    console.log(this.exportpdf)
    const doc = new jsPDF.default("landscape","pt");
      const columns = [this.exportColumns];
      const data = 
        this.exportpdf
      ;
      autoTable(doc, {
        head: columns,
        body: this.exportpdf,
        didDrawPage: dataArg => {
          doc.setFontSize(20);
          doc.setTextColor(40);
          doc.text("previa", dataArg.settings.margin.left, 10);
        }
      });
  
      doc.save("table.pdf");
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default('landscape','pt');
            doc.autoTable(this.exportColumns, this.empleados);
            doc.save('products.pdf');
        })
    })
  }*/

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.empleados);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "planilla");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_vista_previa_' + new Date().getTime() + EXCEL_EXTENSION);
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
        this.DuiValido = true;
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
        this.DuiValido = false;
      }
      this.loadingDUI = false;
    })
    
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
      tipoDocumentoI: empleado.tipoDocumentoI,
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
        this.messageService.add({severity:'error', summary: 'Error', detail:result['message']});
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
      tipoDocumentoI: '',
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
        this.messageService.add({severity:'error', summary: 'Error', detail:result['message']});
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
        this.exportpdf = this.planilla.detalles
        this.codigoEstado = this.planilla.codigoEstado;
        this.track = result['track'];
        this.documentos = result['documentos'];
        //console.log(this.documentos)
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
    this.planillaService.verificarDistribucion(idEncabezado,this.data.TipoEmpresa).subscribe((result) => {
      if(result.cuantos > 0){
        this.messageService.add({severity:'error', summary: 'Error', detail:'Verifique la correcta distribucion de las prestaciones'});
        Swal.fire({
          html: result.duis
        });
      }else{
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
              this.messageService.add({severity:'error', summary: 'Error', detail:res['message']});
            }
          }))
        }
      })
    }else{
      this.messageService.add({severity:'info', summary: 'Aviso', detail:'Debe seleccionar al menos un empleado a eliminar'});
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

  buscarTrackPlanilla(codigoEstado){
    //console.log(this.track)
    let estadoActual = this.codigoEstado;
    let color = '';
    if(estadoActual < codigoEstado){
      //console.log("rojo "+ estadoActual+" "+codigoEstado)
      color = '#DF0101'
    }else{
      if(estadoActual == codigoEstado && estadoActual != '6'){
        //console.log("amarillo" + estadoActual+" "+codigoEstado)
        color = '#01DF01'
      }else{
        if(estadoActual == '6'){
          //console.log("verde ultimo" + estadoActual+" "+codigoEstado)
          color = '#01DF01'
        }else{
          //console.log("verde" + estadoActual+" "+codigoEstado)
          color = '#01DF01'
        }
      }
    }
    return color;
  }

  verificarDistribucion(idEncabezado: number){
    this.planillaService.verificarDistribucion(idEncabezado,this.data.TipoEmpresa).subscribe((result) => {
      if(result.cuantos > 0){
        this.messageService.add({severity:'error', summary: 'Error', detail:'Verifique la correcta distribucion de las prestaciones'});
        Swal.fire({
          html: result.duis
        });
      }else{
        this.messageService.add({severity:'success', summary: 'Exito', detail:'Distribución correcta'});
      }
    })
  }

}
