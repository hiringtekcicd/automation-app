import { ValidatorFn, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class AtLeastOneEnableValidator{
    public atLeastOneEnable(monitoringOnly: string, abFormName: string, a: string, b: string): ValidatorFn{
        return (form: FormGroup) => {
            let abForm = form.get(abFormName);
            if(!abForm || abForm === null) return null;//not supposed to happen
            const monitoringOnlyVal: boolean = form.get(monitoringOnly).value;
            const aVal: boolean = abForm.get(a).value;
            const bVal: boolean = abForm.get(b).value;
            
            if(monitoringOnlyVal === null) return null; //not supposed to happen
            if(!monitoringOnlyVal){
                if(aVal === null || bVal === null) return null; //not supposed to happen
                if(!aVal && !bVal) return {"noneEnabled": true};
            }else{
                return null; //is monitoringonly, it's fine
            }
        }
    }
}