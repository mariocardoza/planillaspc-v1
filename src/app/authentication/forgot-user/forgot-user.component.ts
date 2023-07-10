import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from 'src/app/core/service/authentication.service';

@Component({
  selector: 'app-forgot-user',
  templateUrl: './forgot-user.component.html',
  styleUrls: ['./forgot-user.component.scss']
})
export class ForgotUserComponent implements OnInit {
  authForm!: FormGroup;
  isSended: boolean = false;
  phrase: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
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

  get f() {
    return this.authForm.controls;
  }

  onSubmit(){
    
    const data ={
      Email: this.f.email.value,
      NIT : this.f.nit.value
    }
    this.authenticationService.findUser(data).subscribe((res) => {
      this.isSended = true;
      this.phrase ="Si los datos coinciden con nuestros registros, recibirá en su correo su usuario del sistema";
    });
  }

  redirect(){
    this.router.navigate(['authentication/signin'])
  }
  

}
