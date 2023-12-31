import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { FormBuilder, FormGroup, Validators,NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { FileDownloadService } from 'src/app/shared/file-download/file-download.service';
import { saveAs} from 'file-saver';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  providers: [MessageService],
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  private data: any;
  error= '';
  isSuccess: boolean = false;
  medioscontacto: any = [];
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  token: any;
  persona: any = [];
  unidades: any = [];
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  editFormGroup: FormGroup;
  public response: { dbPath: '' }
  constructor(
    private route: ActivatedRoute, 
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
  

  ngOnInit(): void {
    this.listarPagadurias();
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
      CodigoPersona: ['0'],
      CodigoRepresentante: ['0'],
      CodigoMedioContacto: ['0'],
      Pagaduria: ['0'],

    });
    let id = this.route.snapshot.params.codigopersona;
    this.dashboardService.searchUser(id,this.token).subscribe((res)=> {
      if(res.success){
        this.persona = res.data
        this.medioscontacto = res.data.mediosContacto;
        this.editFormGroup.patchValue({NIT: res.data.nit});
        this.editFormGroup.patchValue({RazonSocial: res.data.razonSocial});
        this.editFormGroup.patchValue({NombreComercial: res.data.nombreComercial});
        this.editFormGroup.patchValue({codigoPGR: res.data.codigoPGR});
        this.editFormGroup.patchValue({TipoEmpresa: res.data.tipoEmpresa});
        this.editFormGroup.patchValue({MedioContactoPersona: this.isMedios("1")});
        this.editFormGroup.patchValue({CodigoNumeroDui: res.data.codigoNumeroDui});
        this.editFormGroup.patchValue({Nombre1: res.data.nombre1});
        this.editFormGroup.patchValue({Nombre2: res.data.nombre2});
        this.editFormGroup.patchValue({Nombre3: res.data.nombre3});
        this.editFormGroup.patchValue({Apellido1: res.data.apellido1});
        this.editFormGroup.patchValue({Apellido2: res.data.apellido2});
        this.editFormGroup.patchValue({ApellidoCasada: res.data.apellidoCasada});
        this.editFormGroup.patchValue({Sexo: res.data.sexo});
        this.editFormGroup.patchValue({FechaNacimiento: res.data.fechaNacimiento});
        this.editFormGroup.patchValue({CodigoPersona:res.data.codigoPersona});
        this.editFormGroup.patchValue({CodigoRepresentante:res.data.codigoRepresentante});
        this.editFormGroup.patchValue({ImagenNIT:res.data.imagenNIT});
        this.editFormGroup.patchValue({CodigoMedioContacto:1});
        this.editFormGroup.patchValue({Pagaduria:res.data.pagaduria});
        //this.editFormGroup.patchValue({TelefonoContactoPersona: res.data.telefonoContactoPersona});
      }
    })
  }

  isMedios(tipoMedio) {
    let medio = this.medioscontacto.find(o => o.codigoTipoMedioContacto === tipoMedio);
    if(medio){
      return medio.medioContactoPersona
    }else{
      return '';
    }
  }

  listarPagadurias(){
    this.authenticationService.unidadesOrganizacionales().subscribe((res) => {
      if(res.success){
        this.unidades = res.data
      }
    })
  }

  descargarArchivo(urlImagen) {
    console.log(urlImagen)
    let filename = urlImagen.substring(urlImagen.lastIndexOf('\\')+1);
    this.fileService.downloadFile(urlImagen).subscribe(response => {
			saveAs(response, filename);
		}), error => console.log('error'), () => console.info('Archivo descargado correctamente');
  }

  onSubmit(){
    const data = {
      ...this.editFormGroup.value,
    };
    if(this.editFormGroup.valid){
      this.dashboardService.editUser(data,this.token).subscribe((res) => {
        console.log(res)
        if(res.success){
          //this.isSuccess = true;
          this.messageService.add({severity:'success', summary: 'Exito', detail:res.message});
        }else{
          this.messageService.add({severity:'error', summary: 'Error', detail:res.message}); 
        }
      })
    }else{
      this.messageService.add({severity:'error', summary: 'Error', detail:'Revise la información, luego intente nuevamente.'});
    }

    
  }

  public uploadFinishedNITEmp = (event) => {
    this.response = event;
    this.editFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

}
