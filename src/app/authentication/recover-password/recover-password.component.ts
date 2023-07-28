import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { PasswordStrengthValidator } from 'src/app/core/validators/password-strength.validator';
import { PasswordValidation } from 'src/app/core/validators/password-validator';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  recoverForm: FormGroup;
  loading = false;
  hide = true;
  error = false;
  hideForm = false;
  public datos: any;
  public userInfo: any;
  phrase :string = '';
  constructor(
    private builder:FormBuilder,
    private authenticationService: AuthenticationService,
    private router:Router
  ) { }

  ngOnInit(): void {
    
    this.recoverForm = this.builder.group({
      
      CodigoEmpresa: ["", Validators.required],
      Username: ["", Validators.required],
      Password: ["", [Validators.required,PasswordStrengthValidator]],
      ConfirmPassword: ["", Validators.required],
    },{
      validator:((controlName: string, matchingControlName: string)=>{

        return (formGroup: FormGroup) => {
    
            const control = formGroup.controls[controlName];
    
            const matchingControl = formGroup.controls[matchingControlName];
    
            if (matchingControl.errors && !matchingControl.errors.mismatchValue) {
    
                return;
    
            }
    
            if (control.value !== matchingControl.value) {
    
                matchingControl.setErrors({ mismatchValue:"claves no coinciden" });
    
            } else {
    
                matchingControl.setErrors(null);
    
            }
    
        }
    
    })('Password','ConfirmPassword')
  });

  this.datos = JSON.parse(localStorage.getItem("RecoverUser"))
  if(this.datos){
    this.recoverForm.patchValue({CodigoEmpresa: this.datos.codigoPersona});
    this.recoverForm.patchValue({Username: this.datos.usuario});
    this.hideForm= false
    this.error = false
  }else{
    this.phrase ="Primero busque el usuario"
    this.hideForm = true
  }
  if (window.performance.navigation.type == 1) {
    localStorage.clear();
  }


    /*this.authenticationService.disparador.subscribe((data) => {
      this.datos = data;
      this.recoverForm.patchValue({CodigoPersona: data.data.codigoPersona});
      console.log(data.data.codigoPersona)
      if(data){
        this.hideForm = false;
      }else{
        this.hideForm = true;
        this.phrase ="Primero busque el usuario"
      }
      //console.log(this.datos.data)
    })*/
    

    
  }

  onSubmit(){
    this.loading = true
    const data = {
      ...this.recoverForm.value
    }
    this.authenticationService.updatePassword(data).subscribe((result)=>{
      if(result.success){
        this.router.navigate(['authentication/signin/']);
      }else{
        this.loading = false
      }
    })
    
  }

  redirect(){
    this.router.navigate(['authentication/forgot-password/']);
  }

}
