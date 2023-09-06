import { Component, OnInit } from '@angular/core';
import { IEmpleado } from 'src/app/core/models/empleados/empleado';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadosService } from 'src/app/core/service/empleados.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-emp-index',
  templateUrl: './emp-index.component.html',
  providers: [MessageService],
  styleUrls: ['./emp-index.component.scss']
})
export class EmpIndexComponent implements OnInit {
  empleados: IEmpleado[];
  totalRecords: number = 0;
  data:any;
  isCreating: boolean = false;
  isEditing: boolean = false;
  loading: boolean = true;
  public response: { dbPath: '' }
  empleadoForm: FormGroup;
  constructor(private empleadosService: EmpleadosService,private formBuilder: FormBuilder,public modal: NgbModal,private messageService: MessageService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
   }

  ngOnInit(): void {
    this.buscarEmpleados()
    this.empleadoForm = this.formBuilder.group({
      DuiPasaporte: ['', Validators.required],
      Nombres: ['', Validators.required],
      Apellidos: ['',Validators.required],
      CodigoExpediente: ['', ''],
      ExpedienteFisico: ['', ''],
      IdPersona: ['', ''],
      RutaDocumento: ['', ''],
    });
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
    this.modal.open(modal,{ size: <any>'lg' })
    console.log(empleado)
  }

  onDelete(idRegistro:number){
    this.empleadosService.descactivarEmpleado(idRegistro).subscribe((result) => {
      console.log(result)
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

  buscarEmpleados(){
    this.empleadosService.buscarEmpleadosEmpresa(this.data.CodigoPGR).subscribe((res)=>{
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
