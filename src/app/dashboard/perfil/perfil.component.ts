import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { FormBuilder, FormGroup, Validators,NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs} from 'file-saver';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  data: any;
  active = 1;
  error= '';
  isSuccess: boolean = false;
  isError: boolean = false;
  message: string = '';
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  token: any;
  persona: any = [];
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  perfilFormGroup: FormGroup;
  userFormGroup: FormGroup;
  public response: { dbPath: '' }
  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private fileService: FileDownloadService
  ) { 
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
  }

  public uploadFinishedNITEmp = (event) => {
    this.response = event;
    this.perfilFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

  descargarArchivo(urlImagen) {
    console.log(urlImagen)
    let filename = urlImagen.substring(urlImagen.lastIndexOf('\\')+1);
    this.fileService.downloadFile(urlImagen).subscribe(response => {
			saveAs(response, filename);
		}), error => console.log('error'), () => console.info('Archivo descargado correctamente');
  }

  onSubmit(){

  }

  ngOnInit(): void {
    this.perfilFormGroup = this.formBuilder.group({
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
      CodigoPersona: ['0'],
      CodigoRepresentante: ['0'],
      CodigoMedioContacto: ['0'],
    });


    if(this.data.CodigoRol=='U'){
      let id = this.data.CodigoEmpresa;
      this.dashboardService.searchUser(id,this.token).subscribe((res)=> {
        if(res.success){
          this.persona = res.data
          this.perfilFormGroup.patchValue({NIT: res.data.nit});
          this.perfilFormGroup.patchValue({RazonSocial: res.data.razonSocial});
          this.perfilFormGroup.patchValue({NombreComercial: res.data.nombreComercial});
          this.perfilFormGroup.patchValue({codigoPGR: res.data.codigoPGR});
          this.perfilFormGroup.patchValue({TipoEmpresa: res.data.tipoEmpresa});
          this.perfilFormGroup.patchValue({MedioContactoPersona: res.data.medioContactoPersona});
          this.perfilFormGroup.patchValue({CodigoNumeroDui: res.data.codigoNumeroDui});
          this.perfilFormGroup.patchValue({Nombre1: res.data.nombre1});
          this.perfilFormGroup.patchValue({Nombre2: res.data.nombre2});
          this.perfilFormGroup.patchValue({Nombre3: res.data.nombre3});
          this.perfilFormGroup.patchValue({Apellido1: res.data.apellido1});
          this.perfilFormGroup.patchValue({Apellido2: res.data.apellido2});
          this.perfilFormGroup.patchValue({ApellidoCasada: res.data.apellidoCasada});
          this.perfilFormGroup.patchValue({Sexo: res.data.sexo});
          this.perfilFormGroup.patchValue({FechaNacimiento: res.data.fechaNacimiento});
          this.perfilFormGroup.patchValue({CodigoPersona:res.data.codigoPersona});
          this.perfilFormGroup.patchValue({CodigoRepresentante:res.data.codigoRepresentante});
          this.perfilFormGroup.patchValue({ImagenNIT:res.data.imagenNIT});
          this.perfilFormGroup.patchValue({CodigoMedioContacto:res.data.codigoMedioContacto});
          //this.editFormGroup.patchValue({TelefonoContactoPersona: res.data.telefonoContactoPersona});
        }
      })
    }

    this.userFormGroup = this.formBuilder.group({
      // idRegistro: [{value: '0', disabled: true}, [Validators.required, Validators.min(1)]],
      Username: ['', Validators.required],
      CodigoEmpresa: ['', ''],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.nullValidator]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });

    this.userFormGroup.patchValue({Username:this.data.Usuario});
    this.userFormGroup.patchValue({CodigoEmpresa:this.data.CodigoEmpresa});

  }

  onSubmitPassword(){
    if(this.userFormGroup.valid){
      const postData = {
        ...this.userFormGroup.value
      }
      this.dashboardService.updatePassword(postData,this.token).subscribe((res)=>{
        if(res.success){
          this.isSuccess = true;
          this.message = res.message
          this.userFormGroup.reset();
          this.userFormGroup.patchValue({Username:this.data.Usuario});
          this.userFormGroup.patchValue({CodigoEmpresa:this.data.CodigoEmpresa});
        }else{
          this.isError = true;
          this.message = res.message
        }
      })
    }else{
      this.isError = true;
      this.message = "Revise la información"
    }

    setTimeout(() => {
      this.isError = false;
      this.isSuccess = false;
    }, 4000);
  }

}
