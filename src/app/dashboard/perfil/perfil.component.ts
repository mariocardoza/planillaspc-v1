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
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  providers: [MessageService],
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  data: any;
  cambiarUsuario: boolean = true;
  medioscontacto: any = [];
  active = 1;
  error= '';
  isSuccess: boolean = false;
  isError: boolean = false;
  message: string = '';
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  token: any;
  persona: any = [];
  unidades: any;
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
    private fileService: FileDownloadService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
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
    if(this.perfilFormGroup.valid){
      const postData = {
        ...this.perfilFormGroup.value
      }
      this.dashboardService.editUser(postData,this.token).subscribe((result) => {
        if(result.success){
         // this.isSuccess = true;
          this.messageService.add({severity:'success', summary: 'Exito', detail:result.message});
          //this.message = result.message
        }else{
          //this.isSuccess = false;
          this.messageService.add({severity:'error', summary: 'Error', detail:result.message});
          //this.message = result.message
        }
      })
    }else{
      //this.isSuccess = false;
      //this.message = "No se puede actualizar, intente más tarde."
      this.messageService.add({severity:'error', summary: 'Error', detail:'No se puede actualizar, intente más tarde.'});
    }
  }

  listarPagadurias(){
    this.authenticationService.unidadesOrganizacionales().subscribe((res) => {
      if(res.success){
        this.unidades = res.data
      }
    })
  }

  ngOnInit(): void {
    if(this.data.CodigoRol == 'A'){
      this.cambiarUsuario = false;
    }
    this.listarPagadurias();
    this.perfilFormGroup = this.formBuilder.group({
      NIT: ['', Validators.required],
      Pagaduria: ['', Validators.required],
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
          this.medioscontacto = res.data.mediosContacto;
          this.perfilFormGroup.patchValue({NIT: res.data.nit});
          this.perfilFormGroup.patchValue({RazonSocial: res.data.razonSocial});
          this.perfilFormGroup.patchValue({NombreComercial: res.data.nombreComercial});
          this.perfilFormGroup.patchValue({codigoPGR: res.data.codigoPGR});
          this.perfilFormGroup.patchValue({TipoEmpresa: res.data.tipoEmpresa});
          this.perfilFormGroup.patchValue({MedioContactoPersona: this.isMedios("1")});
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
          this.perfilFormGroup.patchValue({Pagaduria:res.data.pagaduria});
          this.perfilFormGroup.patchValue({TelefonoContactoPersona:this.isMedios("2")});
          //this.editFormGroup.patchValue({TelefonoContactoPersona: res.data.telefonoContactoPersona});
        }
      })
    }

    this.userFormGroup = this.formBuilder.group({
      // idRegistro: [{value: '0', disabled: true}, [Validators.required, Validators.min(1)]],
      IdUsuario: ['', Validators.required],
      Username: ['', Validators.required],
      CodigoPagaduria: ['',Validators.required],
      CodigoEmpresa: ['', ''],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.nullValidator]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });

    this.userFormGroup.patchValue({IdUsuario:this.data.IdUsuario});
    this.userFormGroup.patchValue({Username:this.data.Usuario});
    this.userFormGroup.patchValue({CodigoEmpresa:this.data.CodigoEmpresa});
    this.userFormGroup.patchValue({CodigoPagaduria:this.data.CodigoPagaduria});

  }

  isMedios(tipoMedio) {
    let medio = this.medioscontacto.find(o => o.codigoTipoMedioContacto === tipoMedio);
    if(medio){
      return medio.medioContactoPersona
    }else{
      return '';
    }
  }

  onSubmitPassword(){
    if(this.userFormGroup.valid){
      const postData = {
        ...this.userFormGroup.value
      }
      this.dashboardService.updatePassword(postData,this.token).subscribe((res)=>{
        if(res.success){
          //this.isSuccess = true;
          //this.message = res.message
          this.messageService.add({severity:'success', summary: 'Exito', detail:res.message});
          this.userFormGroup.reset();
          this.userFormGroup.patchValue({Username:this.data.Usuario});
          this.userFormGroup.patchValue({IdUsuario:this.data.IdUsuario});
          this.userFormGroup.patchValue({CodigoEmpresa:this.data.CodigoEmpresa});
          this.userFormGroup.patchValue({CodigoPagaduria:this.data.CodigoPagaduria});
        }else{
          //this.isError = true;
         // this.message = res.message
          this.messageService.add({severity:'error', summary: 'Error', detail:res.message});
        }
      })
    }else{
      //this.isError = true;
      //this.message = "Revise la información"
      
      this.messageService.add({severity:'error', summary: 'Error', detail:'Revise la información, luego intente nuevamente.'});
      
    }

    setTimeout(() => {
      this.isError = false;
      this.isSuccess = false;
    }, 4000);
  }

}
