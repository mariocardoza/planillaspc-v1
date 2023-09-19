import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IEmpleado } from 'src/app/core/models/empleados/empleado';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadosService } from 'src/app/core/service/empleados.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-emp-index',
  templateUrl: './emp-index.component.html',
  providers: [MessageService],
  styleUrls: ['./emp-index.component.scss']
})
export class EmpIndexComponent implements OnInit {
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
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  constructor(private empleadosService: EmpleadosService,private formBuilder: FormBuilder,public modal: NgbModal,private messageService: MessageService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    console.log(this.data)
   }

  ngOnInit(): void {
    this.carpetaInstaciada = "empresas/empleados";
    this.carpetaInstaciada2 = "empresas/empleados/cesados";
    this.buscarEmpleados()
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
      CodigoEmpresa: [this.data.CodigoPGR, ''],
    });

    this.empleadoFormDelete = this.formBuilder.group({
      IdRegistro: ['',Validators.required],
      FechaCesacion: ['',Validators.required],
      RutaDocumentoCesado: ['',Validators.required]
    });
  }

  actualizarEmpleados(){
    this.loading = true;
    this.empleadosService.refrescarEmpleados(this.data.CodigoPGR,this.data.CodigoPagaduria).subscribe((res)=>{
      if(res.success){
        this.messageService.add({severity:'success', summary: 'Exito', detail:res.message});
        this.loading = false;
        this.buscarEmpleados();
      }else{
        this.messageService.add({severity:'danger', summary: 'Error', detail:res.message});
        this.loading = false;
      }
    })
    //this.loading = false;
  }

  onEditInit(empleado: IEmpleado,modal){
    this.isCreating = false;
    this.isEditing = true;
    this.empleadoForm.patchValue({IdPersona:empleado.idPersona});
    this.empleadoForm.patchValue({Nombres:empleado.nombres});
    this.empleadoForm.patchValue({Apellidos:empleado.apellidos});
    this.empleadoForm.patchValue({DuiPasaporte:empleado.duiPasaporte});
    this.empleadoForm.patchValue({CodigoExpediente:empleado.codigoExpediente});
    this.empleadoForm.patchValue({ExpedienteFisico:empleado.expedienteFisico});
    this.actualfile = empleado.rutaDocumento;
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
      text: "Esta acción eliminará el empleado de la empresa",
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
            this.buscarEmpleados();
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
    this.empleadoForm.patchValue({IdPersona:0});
    this.empleadoForm.patchValue({Nombres:''});
    this.empleadoForm.patchValue({Apellidos:''});
    this.empleadoForm.patchValue({DuiPasaporte:''});
    this.empleadoForm.patchValue({CodigoExpediente:''});
    this.empleadoForm.patchValue({ExpedienteFisico:''});
    this.modal.open(modalEmpleados,{ size: <any>'lg' })
  }

  editEmpleado(){
    const data = {
      ...this.empleadoForm.value
    }
    this.empleadosService.actualizarEmpleado(data).subscribe((result) => {
      console.log(result.success)
      if(result.success){
        this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
        this.buscarEmpleados();
        this.modal.dismissAll();
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:result.message});
      }
    })
  }

  onSubmitEmpleado(){
    const data = {
      ...this.empleadoForm.value
    }
    this.empleadosService.registrarEmpleado(data).subscribe((result) => {
      console.log(result.success)
      if(result.success){
        this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
        this.buscarEmpleados();
        this.modal.dismissAll();
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail:result.message});
      }
    })
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

  downloadURLFile() {
    let strUrlFile = this.empleadoForm.controls[0].value;

    let filename = strUrlFile.substring(strUrlFile.lastIndexOf('\\')+1);

  }

  downloadURLFile2() {
    let strUrlFile = this.empleadoFormDelete.controls[0].value;

    let filename = strUrlFile.substring(strUrlFile.lastIndexOf('\\')+1);

  }

  buscarEmpleados(){
    this.empleadosService.buscarEmpleadosEmpresa(this.data.CodigoPGR,this.data.CodigoPagaduria).subscribe((res)=>{
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
