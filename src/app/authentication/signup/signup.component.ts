import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators,NG_VALUE_ACCESSOR, FormControl} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ICredencial } from 'src/app/core/models/credencial';
import { IconOptions } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/core/models/field.interface';
import { MatSelect } from '@angular/material/select';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';
import { ILoginUser } from 'src/app/core/models/login-user-interface';
import * as moment from 'moment';
import { IRegister } from 'src/app/core/models/register.interface';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    {
      provide: [STEPPER_GLOBAL_OPTIONS,NG_VALUE_ACCESSOR],
      useValue: {showError: true},
      multi: true,
    },
  ],
})
export class SignupComponent implements OnInit {
  error= '';
  a = moment().subtract(18, 'year').format("YYYY-MM-DD");
  accepted: boolean = false;
  nitExiste: boolean;
  registerForm: FormGroup;
  personaJuridicaFormGroup: FormGroup;
  personaNaturalFormGroup: FormGroup;
  userFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  datosUsuario: ICredencial;
  EmpleadoUser: any;
  public itemFilterCtrl1: FormControl = new FormControl();
  public filteredItems1: ReplaySubject<Item[]> = new ReplaySubject<Item[]>(1);
  @ViewChild('singleSelect1', { static: true }) singleSelect1: MatSelect;
  protected _onDestroy1 = new Subject<void>();
  hide = true;
  hider = true;
  protected items1: Item[];
  public response: { dbPath: '' }
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  documentos = [
    {value:'N', name:'NIT'},
    {value:'D', name:'DUI'},
    {value:'P', name:'Pasaporte'},
  ];
  nitMask = '0000-000000-000-0';
  eldocumento = 'NIT';
  unidades = [];
  departments = [];
  private data: any;
  token: any;

  constructor(private formBuilder: FormBuilder, private router: Router,public toastService: ToastService,private authenticationService: AuthenticationService) {
    this.data = JSON.parse(localStorage.getItem('EmpleadoUser'));
    this.nitExiste = false;
    if(this.data != null)
      this.token = this.data.token;
    }

  ngOnInit(): void {
    console.log(this.a)
    this.buscarUnidades();
    const login: ILoginUser = {
      codigoUsuario: 'PGRPERSONA',
      claveUsuario: '51APP6R'
    };
    if(this.EmpleadoUser == null){
      this.authenticationService.validateLoginUser(login).subscribe(
        response => {
            console.log(response)
            this.personaNaturalFormGroup.patchValue({CodigoPersona: response.codigoUsuario});
      });
    }else{
      this.token = this.EmpleadoUser.token;
      this.personaNaturalFormGroup.patchValue({CodigoPersona: this.EmpleadoUser.codigoUsuario});
    }

    /*this.registerForm = this.formBuilder.group({
      'firstFormGroup': new FormGroup({
        'nit': new FormGroup(null,Validators.required),
        'nrc': new FormGroup(null,Validators.required),
        'RazonSocialPersonaJuridica': new FormGroup(null,Validators.required),
        'NombreComercialPersonaJuridica': new FormGroup(null,Validators.required),
      }),
      'secondFormGroup' : new FormGroup({
        'ApellidosPersonaNatural': new FormGroup(null,Validators.required),
        'NombresPersonaNatural': new FormGroup(null,Validators.required),
        'FechaNacimientoPersonaNatural': new FormGroup(null,Validators.required),
      })
    });*/

    this.personaJuridicaFormGroup = this.formBuilder.group({
      NIT: ['', Validators.required],
      TipoDocumento: ['I', Validators.required],
      codigoPGR: ['',Validators.required],
      RazonSocial: ['',Validators.required],
      ImagenNIT: ['',Validators.required],
      MedioContactoPersona: ['',Validators.required],
      TelefonoContactoPersona: ['',''],
      TipoEmpresa: ['',Validators.required],
      NombreComercial: ['',Validators.required],
      CodigoTipoMedioContacto: ['1'],

    });
    
    this.personaNaturalFormGroup = this.formBuilder.group({
      Nombre1: ['', Validators.required],
      Nombre2: [''],
      Nombre3: [''],
      ConDui: ['S'],
      Pagaduria: ['', Validators.required],
      Apellido1: ['', Validators.required],
      Apellido2: [''],
      ApellidoCasada: [''],
      FechaNacimiento: ['', Validators.required],
      Sexo: ['', Validators.required],
      CodigoNumeroDui: ['',Validators.required],
      CodigoPersona: ['0']
    });
    /*this.userFormGroup = this.formBuilder.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    });*/

    this.userFormGroup = this.formBuilder.group({
      // idRegistro: [{value: '0', disabled: true}, [Validators.required, Validators.min(1)]],
      Username: ['', Validators.required],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.required]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });

    this.fourthFormGroup = this.formBuilder.group({
      Terminos: ['',Validators.required],
      FechaHoraTerminos: ['',''],
    });

    
  }

  onChangeS(data) {
    if(data.value == 'D'){
      this.nitMask = "00000000-0";
      this.eldocumento = "DUI";
    }if(data.value == 'P'){
      this.nitMask = "000000000";
      this.eldocumento = "Pasaporte"
    }if(data.value == 'I'){
      this.nitMask = "0000-000000-000-0";
      this.eldocumento = "NIT"
    }
  }

  checkValue(event){

    if(event.checked){
      this.accepted =true;
      this.fourthFormGroup.patchValue({Terminos:1})
      this.fourthFormGroup.patchValue({FechaHoraTerminos:moment().format('YYYY-MM-DD HH:mm:SS')})
    }else{
      this.accepted = false;
      this.fourthFormGroup.patchValue({Terminos:0})
      this.fourthFormGroup.patchValue({FechaHoraTerminos:''})
    }
 }

 findDUI(){
  let dui: string = (this.personaNaturalFormGroup.value.CodigoNumeroDui)
  this.authenticationService.validateDUI(dui,this.token).subscribe((res) => {
    console.log(res)
    if (res.success) {
      this.personaNaturalFormGroup.patchValue({Nombre1: res.data.nombre1});
      this.personaNaturalFormGroup.patchValue({Nombre2: res.data.nombre2});
      this.personaNaturalFormGroup.patchValue({Nombre3: res.data.nombre3});
      this.personaNaturalFormGroup.patchValue({Apellido1: res.data.apellido1});
      this.personaNaturalFormGroup.patchValue({Apellido2: res.data.apellido2});
      this.personaNaturalFormGroup.patchValue({ApellidoCasada: res.data.apellidoCasada});
      this.personaNaturalFormGroup.patchValue({FechaNacimiento: res.data.fechaNacimiento});
      this.personaNaturalFormGroup.patchValue({Sexo: res.data.sexo});
    } else {
      console.log(res)
      this.error = res.message;
    }
  })
  //this.userFormGroup.patchValue({Username: dui});
 }

 buscarUnidades(){
  this.authenticationService.unidadesOrganizacionales().subscribe((res)=>{
    this.unidades = res.data;
  });
 }

 findNIT(){
  let nit: string = (this.personaJuridicaFormGroup.value.NIT)
  this.authenticationService.validateNIT(nit).subscribe((res) => {
    console.log(res)
    if (res.success) {
      this.nitExiste = true;
      console.log(this.nitExiste)
      this.toastService.showError("La empresa ya se encuentra registrada","Puede probar con recuperar usuario o clave")
        
    } else {
      console.log(res)
      this.error = res.message;
      this.nitExiste = false;
    }
  })
 }

  public uploadFinishedNITEmp = (event) => {
    this.response = event;
    this.personaJuridicaFormGroup.patchValue({
      ImagenNIT:  this.response.dbPath
    });     
  }

  public uploadFinishedNRCEmp = (event) => {
    this.response = event;
    this.personaJuridicaFormGroup.patchValue({
      ImagenNRC:  this.response.dbPath
    });     
  }

  public uploadFinishedEscrituraEmp = (event) => {
    this.response = event;
    this.personaJuridicaFormGroup.patchValue({
      ImagenEscritura:  this.response.dbPath
    });     
  }

  private filterItems1() {
    if (!this.departments) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl1.value;
    if (!search) {
      this.filteredItems1.next(this.departments.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredItems1.next(
      this.departments.filter(item1 => item1.tcampo2.toLowerCase().indexOf(search) > -1)
    );
  }

  protected setInitialValue() {
    // this.filteredItems
    //   .pipe(take(1), takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.singleSelect.compareWith = (a: Item, b: Item) => a && b && a.tcampo1 === b.tcampo1;
    //   });

      this.filteredItems1
      .pipe(take(1),takeUntil(this._onDestroy1))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect1.compareWith = (a: Item, b: Item) => a && b && a.tcampo1 === b.tcampo1;
      });
  }

  ngOnDestroy() {
    // this._onDestroy.next();
    // this._onDestroy.complete();

    this._onDestroy1.next();
    this._onDestroy1.complete();

  }

  onSubmit(){
    if (this.personaNaturalFormGroup.valid && this.userFormGroup) {

      const data: IRegister = {
        ...this.personaJuridicaFormGroup.value,
        ...this.personaNaturalFormGroup.value,
        ...this.userFormGroup.value,
        ...this.fourthFormGroup.value
      };

      this.authenticationService.register(data).subscribe((res) => {
        if(res.success){
          this.router.navigate(['/authentication/signup-complete']);
        }else{
          this.error =res.message
        }
      },(error) => {
        let val = error.error.errors;
        this.error ="Ocurrieron uno o más errores de validación al registrar la informacion, revise nuevamente:<br><br>"
        var errores = Object.values(val);
        this.error+="<ul>"
        for(var i=0; i< errores.length; i++){
          this.error +="<li>"+errores[i]+"</li>"
        }
        this.error+="</ul>"
        /*if(typeof val.Username != 'undefined'){
          this.error +=val.Username+"<br>"
        }*/
      },
      );
      
    }else{
      this.error ="Revise los campos obligatorios e intente nuevamente."
    }
  }

}
