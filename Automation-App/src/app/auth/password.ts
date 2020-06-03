import { FormControl, FormGroup} from '@angular/forms';

//Password Validator class with custom error messages.
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

// Confirm Password Validator class.
export class PasswordMatch {
    static MatchPassword(group: FormGroup) {
        let password = group.controls.password.value;
        let confirmpassword = group.controls.confirmpassword.value;;
         if (password != confirmpassword) {
             console.log('here');
             return{
                 mismatch: "Passwords do not match"
             }
        }
             return null;
        } 
      }


 
         
    
