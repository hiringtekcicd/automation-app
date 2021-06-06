import { FormGroup, ValidatorFn } from '@angular/forms';
import { Injectable } from "@angular/core";


@Injectable({providedIn: 'root'})
export class DayNightTargetValidator{
    public dayNightTarget(target: string, dayTarget: string, nightTarget: string, dnEnabled: string): ValidatorFn{
        return (form: FormGroup) => {
            const dnEnableVal: boolean = form.get(dnEnabled).value; //bool
            const targetVal = form.get(target).value;
            const dayVal = form.get(dayTarget).value;
            const nightVal = form.get(nightTarget).value;
            if(dnEnableVal === null) return null; //not supposed to happen
            if(dnEnableVal){
                if(dayVal === null || nightVal === null){
                    if(dayVal == null){
                        form.controls[dayTarget].setErrors({'incorrect': true});
                    }
                    if(nightVal == null){
                        form.controls[nightTarget].setErrors({'incorrect': true});
                    }
                    return {"dnReq": true};
                }
                if(form.controls[target].hasError('incorrect')){
                    form.controls[target].setErrors(null);
                }
                return null;//need to clear error for other side (dn --> remove target err, vice versa)
                /*
                If one of these has 'incorrect' and we need to clear it, we can just set all errors to null
                All possible errors are max, min, and this (incorrect) which only happens when it is empty
                */
            }else{
                if(targetVal === null) {
                    form.controls[target].setErrors({'incorrect': true});
                    return {"targetReq": true};
                }
                if(form.controls[dayTarget].hasError('incorrect')){
                    form.controls[dayTarget].setErrors(null);
                }
                if(form.controls[nightTarget].hasError('incorrect')){
                    form.controls[nightTarget].setErrors(null);
                }
                return null;//need to clear error for other side (dn --> remove target err, vice versa)
            }
        }
    }
}