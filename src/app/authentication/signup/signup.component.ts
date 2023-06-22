import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class SignupComponent implements OnInit {
  error= '';
  registerForm: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  sexos = [
    {value:'F', name:'Femenino'},
    {value:'M', name:'Masculino'},
  ];
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    /*this.registerForm = this.formBuilder.group({
      'firstFormGroup': new FormGroup({
        'nit': new FormGroup(null,Validators.required),
        'nrc': new FormGroup(null,Validators.required),
        'RazonSocialPersonaJuridica': new FormGroup(null,Validators.required),
        'NombreComercialPersonaJuridica': new FormGroup(null,Validators.required),
      }),
      'secondFormGroup' : new FormGroup({
        'ApellidosPersonaNatural': new FormGroup(null,Validators.required),
        'NombresPersonaNatural': new FormGroup(null,Validators.required),
        'FechaNacimientoPersonaNatural': new FormGroup(null,Validators.required),
      })
    });*/

    this.firstFormGroup = this.formBuilder.group({
      nit: ['', Validators.required],
      nrc: ['', Validators.required],
      RazonSocialPersonaJuridica: ['',Validators.required],
      NombreComercialPersonaJuridica: ['',Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      ApellidosPersonaNatural: ['', Validators.required],
      NombresPersonaNatural: ['', Validators.required],
      FechaNacimientoPersonaNatural: ['', Validators.required],
      SexoPersonalNatural: ['', Validators.required],
    });
  }

  onSubmit(){
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const data = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
      };

      console.log(data)
    }
  }

}
