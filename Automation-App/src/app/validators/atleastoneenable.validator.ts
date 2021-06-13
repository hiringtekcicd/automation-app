import { ValidatorFn, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class AtLeastOneEnableValidator{
    public atLeastOneEnable(monitoringOnly: string, abFormName: string, a: string, b: string): ValidatorFn{
        return (form: FormGroup) => {
            let abForm = form.get(abFormName) as FormGroup;
            if(!abForm || abForm === null) 
            {
                if(abForm.controls[a].hasError('incorrect')){
                    abForm.controls[a].setErrors(null);
                }
                if(abForm.controls[b].hasError('incorrect')){
                    abForm.controls[b].setErrors(null);
                }
                return null;//not supposed to happen
            }
            const monitoringOnlyVal: boolean = form.get(monitoringOnly).value;
            const aVal: boolean = abForm.get(a).value;
            const bVal: boolean = abForm.get(b).value;
            
            if(monitoringOnlyVal === null) 
            {
                if(abForm.controls[a].hasError('incorrect')){
                    abForm.controls[a].setErrors(null);
                }
                if(abForm.controls[b].hasError('incorrect')){
                    abForm.controls[b].setErrors(null);
                }
                return null; //not supposed to happen
            }
            if(!monitoringOnlyVal){
                if(aVal === null || bVal === null) return null; //not supposed to happen
                if(!aVal && !bVal){
                    abForm.controls[a].setErrors({'incorrect': true});
                    abForm.controls[b].setErrors({'incorrect': true});
                    return {"noneEnabled": true};
                }
            }else{
                if(abForm.controls[a].hasError('incorrect')){
                    abForm.controls[a].setErrors(null);
                }
                if(abForm.controls[b].hasError('incorrect')){
                    abForm.controls[b].setErrors(null);
                }
                return null; //is monitoringonly, it's fine
            }
        }
    }
}