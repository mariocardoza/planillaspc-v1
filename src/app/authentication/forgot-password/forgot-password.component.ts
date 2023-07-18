import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from 'src/app/core/service/authentication.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  authForm!: FormGroup;
  isSended: boolean = false;
  phrase: string = '';
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      nit: ["",Validators.required]
    });
  }

  onSubmit(){
    this.loading = true;
    const credenciales = {
      ...this.authForm.value
    }
    this.authenticationService.forgotPassword(credenciales).subscribe((result)=>{
      if(result.success){
        this.authenticationService.disparador.emit({data: result.data})
        localStorage.setItem('RecoverUser', JSON.stringify(result.data));
        this.router.navigate(['authentication/recover-password'])
      }else{
        this.loading = false;
        this.authForm.reset();
        this.authForm.clearAsyncValidators();
      }
    });
    //this.router.navigate(['authentication/recover-password'])
  }

  redirect(){
    this.router.navigate(['authentication/signin'])
  }

}
