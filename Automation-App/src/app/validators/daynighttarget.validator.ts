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
                return null;
            }else{
                if(targetVal === null) {
                    form.controls[target].setErrors({'incorrect': true});
                    return {"targetReq": true};
                }
                return null;
            }
        }
    }
}