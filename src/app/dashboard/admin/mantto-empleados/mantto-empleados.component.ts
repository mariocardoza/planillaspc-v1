import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IEmpleado } from 'src/app/core/models/empleados/empleado';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadosService } from 'src/app/core/service/empleados.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs } from 'file-saver';
import { PlanillaService } from 'src/app/core/service/planilla.service';
import { DashboardService } from 'src/app/core/service/dashboard.service';

@Component({
  selector: 'app-mantto-empleados',
  templateUrl: './mantto-empleados.component.html',
  providers: [MessageService],
  styleUrls: ['./mantto-empleados.component.scss']
})
export class ManttoEmpleadosComponent implements OnInit {
  @ViewChild("eliminarEmpleado") modalEliminarEmpleado: ElementRef;
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  carpetaInstaciada: string;
  carpetaInstaciada2: string;
  actualfile: string = '';
  actualfile2: string = '';
  empleados: IEmpleado[];
  totalRecords: number = 0;
  data:any;
  isCreating: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;
  public response: { dbPath: '' }
  empleadoForm: FormGroup;
  empleadoFormDelete: FormGroup;
  loadingDUI: boolean = false;
  DuiValido: boolean = false;
  esDui: boolean = false;
  filterForm: FormGroup;
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  documentos: any = [];
  empresas: any = [];
  usuarios: any = [];
  constructor(private dashboardService: DashboardService,private empleadosService: EmpleadosService,private planillaService: PlanillaService,private formBuilder: FormBuilder,public modal: NgbModal,private messageService: MessageService, private fileService: FileDownloadService) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
  }

  ngOnInit(): void {
    this.carpetaInstaciada = "empresas/empleados";
    this.carpetaInstaciada2 = "empresas/empleados/cesados";
    this.buscarEmpleados(5)
    this.obtenerEmpresas()
    this.loading = false
    this.empleadoForm = this.formBuilder.group({
      DuiPasaporte: ['', Validators.required],
      Nombres: ['', Validators.required],
      Apellidos: ['',Validators.required],
      CodigoExpediente: ['', Validators.required],
      Sexo: ['', ''],
      FechaNacimiento: ['', ''],
      ExpedienteFisico: ['', ''],
      IdPersona: ['', ''],
      RutaDocumento: ['', ''],
      CodigoEmpresa: ['', ''],
      TipoDocumentoI: ['', Validators.required],
    });

    this.empleadoFormDelete = this.formBuilder.group({
      IdRegistro: ['',Validators.required],
      FechaCesacion: ['',Validators.required],
      RutaDocumentoCesado: ['',Validators.required]
    });

    this.filterForm = this.formBuilder.group({
      empresa:['','']
    });
  }

  buscar(){
    if(this.filterForm.value.empresa){
      let empresa = this.filterForm.value.empresa;
      this.buscarEmpleados(empresa)
    }
  }

  limpiar(){
    /*this.planillaService.obtenerComprobantesPagados(this.data.CodigoPagaduria,this.data.CodigoRol,'6','', '', 0, 1000, 1,'fechaHora').subscribe((result) => {
      this.empleadosService = result.data;
      this.totalRecords = result.registros;
    });*/
    this.buscarEmpleados(-7)
  }

  obtenerEmpresas(){
    let token = "gdfd";
    this.dashboardService.usersActiveAsync(token,this.data.CodigoRol,this.data.CodigoPagaduria,1,100).subscribe((res) => {
      if(res.success){
        this.empresas = res.data;
        this.usuarios = this.empresas.map(e => ({
          code: e.codigoPGR,
          name: e.nombreComercial
        }))
      }
    });
  }

  onChangeS(data) {
    if(data.value == 'D'){
      this.esDui = true;
    }else{
      this.esDui = false;
    }
  }

  actualizarEmpleados(){
    this.loading = true;
    this.empleadosService.refrescarEmpleados(this.data.CodigoPGR,this.data.CodigoPagaduria).subscribe((res)=>{
      if(res.success){
        this.messageService.add({severity:'success', summary: 'Exito', detail:res.message});
        this.loading = false;
        //this.buscarEmpleados();
      }else{
        this.messageService.add({severity:'danger', summary: 'Error', detail:res.message});
        this.loading = false;
      }
    })
    //this.loading = false;
  }

  onEditInit(empleado: IEmpleado,modal){
    this.isCreating = false;
    this.DuiValido = false;
    this.isEditing = true;
    this.esDui = false;
    this.empleadoForm.patchValue({IdPersona:empleado.idPersona});
    this.empleadoForm.patchValue({Nombres:empleado.nombres});
    this.empleadoForm.patchValue({Apellidos:empleado.apellidos});
    this.empleadoForm.patchValue({DuiPasaporte:empleado.duiPasaporte});
    this.empleadoForm.patchValue({CodigoExpediente:empleado.codigoExpediente});
    this.empleadoForm.patchValue({ExpedienteFisico:empleado.expedienteFisico});
    this.empleadoForm.patchValue({TipoDocumentoI:empleado.tipoDocumentoI});
    this.empleadoForm.patchValue({RutaDocumento:empleado.rutaDocumento});
    this.empleadoForm.patchValue({CodigoEmpresa:empleado.codigoEmpresaPGR})
    this.actualfile = empleado.rutaDocumento;
    if(empleado.tipoDocumentoI == 'D'){
      this.esDui = true;
    }
    this.empleadoForm.controls.RutaDocumento.setValidators(null);
    this.empleadoForm.controls.RutaDocumento.updateValueAndValidity();
    console.log(this.actualfile)
    this.modal.open(modal,{ size: <any>'lg' })
    console.log(empleado)
  }

  onDeleteModal(idRegistro:number){
    this.empleadoFormDelete.patchValue({IdRegistro:idRegistro})
    this.modal.open(this.modalEliminarEmpleado,{ size: <any>'lg' });
  }

  onDelete(){
    const data = {
      ...this.empleadoFormDelete.value
    }
    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta acción inactivará al empleado de la empresa",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadosService.descactivarEmpleado(data).subscribe((result) => {
          if(result.success){
            this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
            //this.buscarEmpleados();
            this.modal.dismissAll();
          }else{
            this.messageService.add({severity:'error', summary: 'Exito', detail:result.message});
          }
        })
      }
    })
  }

  crearNuevo(modalEmpleados){
    this.isCreating = true;
    this.isEditing = false;
    this.DuiValido = false;
    this.empleadoForm.patchValue({IdPersona:0});
    this.empleadoForm.patchValue({Nombres:''});
    this.empleadoForm.patchValue({Apellidos:''});
    this.empleadoForm.patchValue({DuiPasaporte:''});
    this.empleadoForm.patchValue({CodigoExpediente:''});
    this.empleadoForm.patchValue({ExpedienteFisico:''});
    this.empleadoForm.patchValue({RutaDocumento:''});
    this.empleadoForm.controls.RutaDocumento.setValidators([Validators.required]);
    this.empleadoForm.controls.RutaDocumento.updateValueAndValidity();
    this.actualfile = '';
    this.modal.open(modalEmpleados,{ size: <any>'lg' })
  }

  editEmpleado(){
    const data = {
      ...this.empleadoForm.value
    }
    let empresa = this.empleadoForm.value.CodigoEmpresa;
    this.empleadosService.actualizarEmpleado(data).subscribe((result) => {
      if(result.success){
        this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
        this.buscarEmpleados(empresa);
        this.modal.dismissAll();
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:result.message});
      }
    })
  }

  onSubmitEmpleado(){
    if(this.empleadoForm.valid){
      const data = {
        ...this.empleadoForm.value
      }
      let empresa = this.empleadoForm.value.CodigoEmpresa;
      this.empleadosService.registrarEmpleado(data).subscribe((result) => {
        console.log(result.success)
        if(result.success){
          this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
          this.buscarEmpleados(empresa);
          this.modal.dismissAll();
        }else{
          this.messageService.add({severity:'error', summary: 'Error', detail:result.message});
        }
      })
    }
    
  }

  public uploadFinishedDocumento = (event) => {
    this.response = event;
    console.log(event)
    this.empleadoForm.patchValue({
      OrdenDescuento:  this.response.dbPath
    });     
  }

  uploadFinished = (event) => {
    this.response = event;
    // console.log(this.response);
    
    this.empleadoForm.patchValue({RutaDocumento:this.response.dbPath})
    // this.group.patchValue({ 'GDocumento1' : ''  })
    // console.log('code: ' + this.field.CodigoCampo, this.group.controls[this.field.CodigoCampo].value);
  }

  uploadFinished2 = (event) => {
    this.response = event;
    // console.log(this.response);
    
    this.empleadoFormDelete.patchValue({RutaDocumentoCesado:this.response.dbPath})
    // this.group.patchValue({ 'GDocumento1' : ''  })
    // console.log('code: ' + this.field.CodigoCampo, this.group.controls[this.field.CodigoCampo].value);
  }

  downloadURLFile2() {
    let strUrlFile = this.empleadoFormDelete.controls.RutaDocumentoCesado.value;
    let filename = strUrlFile.substring(strUrlFile.lastIndexOf('\\')+1);
    this.fileService.downloadFile(strUrlFile).subscribe(response => {
			saveAs(response, filename);
		}), error => this.messageService.add({severity:'error', summary: 'Error', detail:''}), () => this.messageService.add({severity:'success', summary: 'Exito', detail:''})
  }

  buscarEmpleados(codigoPgr){
    this.empleadosService.buscarEmpleadosEmpresa(codigoPgr,this.data.CodigoPagaduria).subscribe((res)=>{
      if(res.success){
        this.empleados = res.data;
        this.totalRecords = res.total
        this.documentos = res.documentos;
        this.loading = false
      }else{
        this.loading = false;
      }
    })
  }

  validarDui(){
    this.loadingDUI = true;
    let dui: string = (this.empleadoForm.value.DuiPasaporte);
    const data = {
      dui : dui,
      codigoPagaduria: this.data.CodigoPagaduria,
      codigoEmpresa: this.data.CodigoPGR
    };
    this.planillaService.buscarExpediente(data).subscribe((res)=>{
      if(res.success){
        this.messageService.add({severity:'success',summary: 'Exito',detail:'DUI válido'})
        this.DuiValido = true;
      }else{
        this.messageService.add({severity:'error',summary: 'Error',detail:'DUI inválido'})
        this.DuiValido = false;
      }
      this.loadingDUI = false;
    })
  }

  downloadURLFile() {
    let strUrlFile = this.empleadoForm.controls.RutaDocumento.value;
    let filename = strUrlFile.substring(strUrlFile.lastIndexOf('\\')+1);
    this.fileService.downloadFile(strUrlFile).subscribe(response => {
			saveAs(response, filename);
		}), error => this.messageService.add({severity:'error', summary: 'Error', detail:''}), () => this.messageService.add({severity:'success', summary: 'Exito', detail:''})
  }

}
