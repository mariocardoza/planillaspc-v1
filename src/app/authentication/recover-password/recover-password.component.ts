import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  recoverForm: FormGroup;
  hide = true;
  constructor(
    private builder:FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.recoverForm = this.builder.group({
      
      password: ["", Validators.required],
      cpassword: ["", Validators.required],
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
    
    })('password','cpassword')
  });
  }

  onSubmit(){
    this.router.navigate(['authentication/signin/']);
  }

}
