import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
@Component({
  selector: 'app-crear-administrador',
  templateUrl: './crear-administrador.component.html',
  styleUrls: ['./crear-administrador.component.scss']
})
export class CrearAdministradorComponent implements OnInit {
  isSuccess: boolean = false;
  isError: boolean = false;
  message: string = "";
  userFormGroup: FormGroup;
  data: any = [];
  token: string;
  unidades: any = [];
  constructor(private formBuilder: FormBuilder,private dashboardService: DashboardService, private authenticationService: AuthenticationService) {
    this.data = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.data != null){
      this.token = this.data.Token;
    }
   }

  ngOnInit(): void {
    this.listarPagadurias();
    this.userFormGroup = this.formBuilder.group({
      Username: ['', Validators.required],
      NIT: ['', Validators.required],
      CodigoPagaduria: ['', Validators.required],
      CodigoEmpresa: ['', ''],
      Password: ['', [Validators.required, PasswordStrengthValidator]],
      ConfirmPassword: ['', Validators.nullValidator]
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });

    this.userFormGroup.patchValue({NIT:this.data.NIT});
    this.userFormGroup.patchValue({CodigoEmpresa:this.data.CodigoEmpresa});
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

      });
    }else{
      this.isError = true;
      this.message = "Compruebe los campos"
    }
  }

}
