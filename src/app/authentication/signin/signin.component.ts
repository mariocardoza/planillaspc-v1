import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ILogin } from 'src/app/core/models/login.interface';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [MatSnackBar]
})
export class SigninComponent implements OnInit {
  loading = false;
  error = "";
  hide = true;
  authForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    console.log("submit")
    const login: ILogin = {
      codigoUsuario: this.f['username'].value,
      claveUsuario: this.f['password'].value
    };
    console.log(login)
  }

}
