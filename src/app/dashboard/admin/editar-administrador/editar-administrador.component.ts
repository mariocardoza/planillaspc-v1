import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';
import { ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject  } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-editar-administrador',
  templateUrl: './editar-administrador.component.html',
  styleUrls: ['./editar-administrador.component.scss']
})
export class EditarAdministradorComponent implements OnInit, OnDestroy {
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  isSuccess: boolean = false;
  public itemFilterCtrl: FormControl = new FormControl();
  protected onDestroy = new Subject();
  
  isError: boolean = false;
  message: string = "";
  userFormGroup: FormGroup;
  data: any = [];
  token: string;
  unidades: any = [];
  usuarios: any = [];
  sisusuarios: any = [];
  constructor(private formBuilder: FormBuilder,private dashboardService: DashboardService, private authenticationService: AuthenticationService,private route: ActivatedRoute,) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.buscarAdministrador(id)
    this.listarPagadurias();
    this.listadoSisUsuarios();
    this.userFormGroup = this.formBuilder.group({
      Username: ['', Validators.required],
      IdUsuario: ['', Validators.required],
      NIT: ['', Validators.required],
      CodigoPagaduria: ['', Validators.required],
      CodigoEmpresa: ['', ''],
      itemFilterCtrl: ['',''],
      Accion: ['', ''],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.nullValidator]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });
    console.log(this.sisusuarios)
    this.userFormGroup.patchValue({WebsiteFilterCtrl:this.sisusuarios[1]});

    

  }

  ngOnDestroy() {

    this.onDestroy.next(1);

    this.onDestroy.complete();

  }

  filterItems() {
    if (!this.sisusuarios) {
      console.log("no tiene")
        return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl.value;
    if (!search) {
        this.filteredUsers.next(this.sisusuarios.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the banks
        this.filteredUsers.next(
            this.sisusuarios.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
}

  onSubmit(){
    const data = {
      ...this.userFormGroup.value,
    };

    console.log(data)

    if(this.userFormGroup.valid){
      this.dashboardService.createAdmin(data, this.token).subscribe((res) => {
        if(res.success){
          this.isSuccess = true
          this.message = "Actualización de usuario administrador realizada con éxito"
        }else{
          this.isError = true;
          this.message = res.message
        }
      })
    }else{
      console.log("a")
      this.isError = true;
      this.message = "Complete los campos"
    }

    
  }

  buscarAdministrador(idUsuario){
    console.log(idUsuario)
    this.dashboardService.findAdmin(idUsuario,this.token).subscribe((res) => {
      if(res.success){
        this.userFormGroup.patchValue({IdUsuario : res.data.idUsuario});
        this.userFormGroup.patchValue({Username : res.data.usuario});
        this.userFormGroup.patchValue({CodigoPagaduria:res.data.codigoPagaduria});
        this.userFormGroup.patchValue({NIT:res.data.nit});
        this.userFormGroup.patchValue({CodigoEmpresa:res.data.codigoEmpresa});
        this.userFormGroup.patchValue({Accion:true});
      }
    })
  }

  listadoSisUsuarios(){
    this.dashboardService.sisUsuarios().subscribe((res)=>{
      if(res.success){
        this.usuarios = res.data;
        this.sisusuarios = this.usuarios.map(e => ({
          code: e.codigoUsuario,
          name: e.nombresUsuario+" "+e.apellidosUsuario
        }))

        this.filteredUsers.next(this.sisusuarios.slice());

        this.itemFilterCtrl.valueChanges
          .pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterItems();
        });
      }
    })
  }

  listarPagadurias(){
    this.authenticationService.unidadesOrganizacionales().subscribe((res) => {
      if(res.success){
        this.unidades = res.data
      }
    })
  }

}
