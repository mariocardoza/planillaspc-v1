import { AbstractControl, ValidationErrors } from "@angular/forms";

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

    let value: string = control.value || '';
    if (!value) {
        return null
      }
    
      if (value.length < 8) {
        // return { passwordStrength: `text has to contine at least 8 characters length, current value ${value}` };
        return { passwordStrength: `La clave debe contener al menos 8 caracteres de longitud` };
      }
    
      let upperCaseCharacters = /[A-Z]+/g
      if (upperCaseCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine Upper case characters,current value ${value}` };
        return { passwordStrength: `La clave debe contener al menos una letra mayúscula` };
      }
    
      let lowerCaseCharacters = /[a-z]+/g
      if (lowerCaseCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine lower case characters,current value ${value}` };
        return { passwordStrength: `La clave debe contener al menos una letra minúscula` };
      }
    
    
      let numberCharacters = /[0-9]+/g
      if (numberCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine number characters,current value ${value}` };
        return { passwordStrength: `La clave debe contener al menos un número` };
      }
    
      let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
      if (specialCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine special character,current value ${value}` };
        return { passwordStrength: `La clave debe contener al menos un caracter especial` };
      }
      return null;
}