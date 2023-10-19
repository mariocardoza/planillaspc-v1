import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject  } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-crear-administrador',
  templateUrl: './crear-administrador.component.html',
  styleUrls: ['./crear-administrador.component.scss']
})
export class CrearAdministradorComponent implements OnInit, OnDestroy {
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
  selectedUser: string | undefined;
  constructor(private formBuilder: FormBuilder,private dashboardService: DashboardService, private authenticationService: AuthenticationService, private router: Router) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
    if(this.data.CodigoRol != 'R'){
      window.location.href = 'dashboard';
    }
   }

  ngOnInit(): void {
    this.listarPagadurias();
    this.listadoSisUsuarios();
    this.userFormGroup = this.formBuilder.group({
      Username: ['', Validators.required],
      NIT: ['', Validators.required],
      CodigoPagaduria: ['', Validators.required],
      CodigoEmpresa: ['', ''],
      Accion: [false, ''],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.nullValidator]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });

    this.userFormGroup.patchValue({NIT:this.data.NIT});
    this.userFormGroup.patchValue({CodigoEmpresa:this.data.CodigoEmpresa});
  }

  ngOnDestroy() {

    this.onDestroy.next(1);

    this.onDestroy.complete();

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

  listarPagadurias(){
    this.authenticationService.unidadesOrganizacionales().subscribe((res) => {
      if(res.success){
        this.unidades = res.data
      }
    })
  }

  onSubmit(){
    if(this.userFormGroup.valid){
      const data = {
        ...this.userFormGroup.value
      };

      this.dashboardService.createAdmin(data,this.token).subscribe((res)=>{
        if(res.success){
          this.router.navigate(["/dashboard/administradores"])
        }else{
          this.isError = true;
          this.message = "Compruebe los campos"
        }
      });
    }else{
      this.isError = true;
      this.message = "Compruebe los campos"
    }
  }

}
