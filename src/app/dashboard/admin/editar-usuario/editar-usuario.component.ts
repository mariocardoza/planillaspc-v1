import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import {FormBuilder, FormGroup, Validators,NG_VALUE_ACCESSOR, FormControl} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  private data: any;
  error= '';
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  token: any;
  persona: any = [];
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  editFormGroup: FormGroup;
  public response: { dbPath: '' }
  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder
    ) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }
  

  ngOnInit(): void {
    this.editFormGroup = this.formBuilder.group({
      NIT: ['', Validators.required],
      codigoPGR: ['0'],
      RazonSocial: ['',Validators.required],
      ImagenNIT: ['',''],
      MedioContactoPersona: ['',Validators.required],
      TelefonoContactoPersona: ['',''],
      TipoEmpresa: ['',Validators.required],
      NombreComercial: ['',Validators.required],
      CodigoTipoMedioContacto: ['1'],
      Nombre1: ['', Validators.required],
      Nombre2: [''],
      Nombre3: [''],
      ConDui: ['S'],
      Apellido1: ['', Validators.required],
      Apellido2: [''],
      ApellidoCasada: [''],
      FechaNacimiento: ['', Validators.required],
      Sexo: ['', Validators.required],
      CodigoNumeroDui: ['',Validators.required],
      CodigoPersona: ['0']

    });
    let id = this.route.snapshot.params.codigopersona;
    this.dashboardService.searchUser(id,this.token).subscribe((res)=> {
      if(res.success){
        this.persona = res.data
        this.editFormGroup.patchValue({NIT: res.data.nit});
        this.editFormGroup.patchValue({RazonSocial: res.data.razonSocial});
        this.editFormGroup.patchValue({NombreComercial: res.data.nombreComercial});
        this.editFormGroup.patchValue({codigoPGR: res.data.codigoPGR});
        this.editFormGroup.patchValue({TipoEmpresa: res.data.tipoEmpresa});
        this.editFormGroup.patchValue({MedioContactoPersona: res.data.medioContactoPersona});
        this.editFormGroup.patchValue({CodigoNumeroDui: res.data.codigoNumeroDui});
        this.editFormGroup.patchValue({Nombre1: res.data.nombre1});
        this.editFormGroup.patchValue({Nombre2: res.data.nombre2});
        this.editFormGroup.patchValue({Nombre3: res.data.nombre3});
        this.editFormGroup.patchValue({Apellido1: res.data.apellido1});
        this.editFormGroup.patchValue({Apellido2: res.data.apellido2});
        this.editFormGroup.patchValue({ApellidoCasada: res.data.apellidoCasada});
        this.editFormGroup.patchValue({Sexo: res.data.sexo});
        this.editFormGroup.patchValue({FechaNacimiento: res.data.fechaNacimiento});
        //this.editFormGroup.patchValue({TelefonoContactoPersona: res.data.telefonoContactoPersona});
      }
    })
  }

  onSubmit(){
    const data = {
      ...this.editFormGroup.value,
    };

    this.dashboardService.editUser(data,this.token).subscribe((res) => {
      console.log(res)
    })
  }

  public uploadFinishedNITEmp = (event) => {
    this.response = event;
    this.editFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

}
