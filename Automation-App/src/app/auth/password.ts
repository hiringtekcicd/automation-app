import { FormControl } from '@angular/forms';
// import {AbstractControl} from '@angular/forms'

export class PasswordStrengthValidator {

    static isValid(control: FormControl): any {
        if(control.value == ''){
            return {
                message:"Password cannot be blank."
            };
        }
        if(control.value.length<6){
            return {
                message:"Should contain atleast 6 characters."
            };
        }
        let re = /[0-9]/;
        if(!re.test(control.value)){
            return {
                message:"Must contain a number."
            };
        }
        re = /[a-z]/;
        if (!re.test(control.value)){
            return {
                message:"Must contain atleast one lowercase letter."
            };
        }

        re = /[A-Z]/;
        if (!re.test(control.value)){
            return {
                message:"Must contain atleast one uppercase letter."
            };
        }
        re = /[@#$%^&*]/;
        if (!re.test(control.value)){
            return {
                message:"Must contain a special character."
            };
        }
        return null;
    }

}
export class PasswordMatch {
    static MatchPassword(Control: FormControl) {
        let password = Control.get('password').value;
        let confirmpassword = Control.get('confirmpassword').value;
         if (password != confirmpassword) {
             return{
                 mismatch: "Passwords donot match"
             }
             }
             return null;
        } 
      }
