import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ILogin } from 'src/app/core/models/login.interface';
import { endpoint } from "src/environments/endpoint";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ICredencial } from 'src/app/core/models/credencial';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [MatSnackBar]
})
export class SigninComponent implements OnInit {
  loading = false;
  error = "";
  submitted = false;
  hide = true;
  datosUsuario: ICredencial;
  authForm!: FormGroup;
  nitForm: FormGroup;
  sucursales = [
    {value:'1', name:'Central'},
  ];
  constructor(
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public modal: NgbModal,
    private toast: ToastService

  ) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    this.nitForm = this.formBuilder.group({
      NIT: ['',Validators.required]
    })
    // prevent sign in again when a token exist
    if (localStorage.getItem('PlanillaUser') !== null){
      this.router.navigate(['/dashboard']);
    }

    if (this.router.url.split('/').pop() !== "signin"){
      this.f.username.setValue(this.router.url.split('/').pop());
    }
  }

  get f() {
    return this.authForm.controls;
  }

  get n(){
    return this.nitForm.controls;
  }

  onNit(){
    let nit = this.n.NIT.value
    this.authenticationService.validateNIT(nit).subscribe((res) => {
    console.log(res)
      if (res.success) {
        this.toast.showSuccess("Continuar al login","La empresa ya se encuentra registrada");
        this.modal.dismissAll();
        this.f.username.setValue(nit)
      } else {
        this.toast.showError("La empresa no se encuentra registrada","Continuar con el registro")
        setTimeout(() => {
          this.router.navigate(['authentication/signup']);
          this.modal.dismissAll();
        }, 2000);
      }
    })
  }

  onSubmit() {
    localStorage.clear();
    this.submitted = true;
    this.loading = true;
    if(this.authForm.invalid){
      this.error = "¡Usuario(a) y clave no válidos!";
      return;
    }else{
      const login: ILogin = {
        Username: this.f.username.value,
        Password: this.f.password.value
      };
      /*this.datosUsuario = {
        id: 1,
        fullname:"Usuario de prueba",
        username: "usuario",
        email: "usuario@corre.com",
        uuid: "ghghgfhfgh",
        token: "fgdfgdfgdfgfddf",
      };
      localStorage.setItem('PlanillaUser', JSON.stringify(this.datosUsuario));*/
      //this.router.navigate(['/dashboard']);
      this.authenticationService.validate(login).subscribe((res) => {
        console.log(res.success)
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          console.log(res)
          this.error = res.message;
          this.submitted = false;
          this.loading = false;
        }
      })
    }
    
  }

}
