import { ValidatorFn, FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ECPumpValidator{
    public ecPumpValidator(monitoringOnly: string, subFormName: string, pumpArrayName: string): ValidatorFn{
        return (form: FormGroup) => {
            let subForm = form.get(subFormName);
            if(!subForm || subForm === null) return null; //not supposed to happen
            const monitoringOnlyVal: boolean = form.get(monitoringOnly).value;
            const pumpArrayVal = subForm.get(pumpArrayName).value;
            if(monitoringOnlyVal === null) return null; //not supposed to happen
            if(!monitoringOnlyVal){
                let valid = false;
                for(var elem in pumpArrayVal){
                    let value = pumpArrayVal[elem];
                    if(value !== null && value > 0)
                        valid = true;
                }
                return (valid? null : {"ecPumpZero": true});
            }else{
                return null; //is monitoringonly, it's fine
            }
        }
    }
}