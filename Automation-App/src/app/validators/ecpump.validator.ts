import { ValidatorFn, FormGroup} from '@angular/forms';
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ECPumpValidator{
    public ecPumpValidator(monitoringOnly: string, subFormName: string, pumpArrayName: string): ValidatorFn{
        return (form: FormGroup) => {
            let subForm = form.get(subFormName);
            if(!subForm || subForm === null) return null; //not supposed to happen
            const monitoringOnlyVal: boolean = form.get(monitoringOnly).value;
            const pumpArrayVal = subForm.get(pumpArrayName).value;
            const pumpArrayForm = subForm.get(pumpArrayName) as FormGroup; //probably there is a better way to do it, but this works and shuts VSCode up
            if(monitoringOnlyVal == null) return null; //not supposed to happen
            if(monitoringOnlyVal == false && pumpArrayForm){
                let valid = false;
                Object.keys(pumpArrayVal).forEach(name => {
                    if(!pumpArrayForm.get(name).value){//val exists and is null, replace with 0
                        pumpArrayForm.controls[name].setValue(0, {onlySelf: true});
                    }
                })
                for(var elem in pumpArrayVal){
                    let value = pumpArrayVal[elem];
                    if(value && value > 0)
                        valid = true;
                }
                return (valid? null : {"ecPumpZero": true});
            }else{
                return null; //is monitoringonly, it's fine
            }
        }
    }
}