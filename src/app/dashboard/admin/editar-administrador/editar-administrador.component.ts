import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-editar-administrador',
  templateUrl: './editar-administrador.component.html',
  styleUrls: ['./editar-administrador.component.scss']
})
export class EditarAdministradorComponent implements OnInit {
  isSuccess: boolean = false;
  isError: boolean = false;
  message: string = "";
  userFormGroup: FormGroup;
  data: any = [];
  token: string;
  unidades: any = [];
  constructor(private formBuilder: FormBuilder,private dashboardService: DashboardService, private authenticationService: AuthenticationService,private route: ActivatedRoute,) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.buscarAdministrador(id)
    this.listarPagadurias()
    this.userFormGroup = this.formBuilder.group({
      Username: ['', Validators.required],
      NIT: ['', Validators.required],
      CodigoPagaduria: ['', Validators.required],
      CodigoEmpresa: ['', ''],
      Accion: ['', ''],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.nullValidator]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });

    
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
          this.message = "Actualización de usuario administrador; realizada con éxito"
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
        this.userFormGroup.patchValue({Username : res.data.usuario});
        this.userFormGroup.patchValue({CodigoPagaduria:res.data.codigoPagaduria});
        this.userFormGroup.patchValue({NIT:res.data.nit});
        this.userFormGroup.patchValue({CodigoEmpresa:res.data.codigoEmpresa});
        this.userFormGroup.patchValue({Accion:true});
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
