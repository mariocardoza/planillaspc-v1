import { AbstractControl } from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('Password').value;
        if(AC.get('ConfirmPassword').touched || AC.get('ConfirmPassword').dirty) {
            let verifyPassword = AC.get('ConfirmPassword').value;

            if(password != verifyPassword) {
                AC.get('ConfirmPassword').setErrors( {MatchPassword: true} )
            } else {
                return null
            }
        }
    }
}