import { FormGroup, ValidatorFn } from "@angular/forms";
import { Injectable } from "@angular/core";

//Move this into ecForm, etc.
@Injectable({ providedIn: "root" })
export class DayNightTargetValidator {
  public dayNightTarget(
    monitOnly: string,
    subForm: string,
    target: string,
    dayTarget: string,
    nightTarget: string,
    dnEnabled: string
  ): ValidatorFn {
    return (form: FormGroup) => {
      const monitVal: boolean = form.get(monitOnly).value;
      const subFormVal = form.get(subForm) as FormGroup;
      if (monitVal) {
        //monit only, don't care
        //subFormVal.controls[target].setErrors(null);
        //subFormVal.controls[dayTarget].setErrors(null);
        //subFormVal.controls[nightTarget].setErrors(null);
        //we also want to get rid of any 'required' error that is not alarm min or max
        Object.keys(subFormVal.controls).forEach((name) => {
          subFormVal.controls[name].setErrors(null); //clear all the errors and spawns a console error
        });
        return null;
      }
      const dnEnableVal: boolean = subFormVal.get(dnEnabled).value;
      const targetVal = subFormVal.get(target).value;
      const dayVal = subFormVal.get(dayTarget).value;
      const nightVal = subFormVal.get(nightTarget).value;
      if (dnEnableVal === null) return null;
      if (dnEnableVal) {
        if (dayVal === null || nightVal === null) {
          if (dayVal == null) {
            subFormVal.controls[dayTarget].setErrors({ incorrect: true });
          }
          if (nightVal == null) {
            subFormVal.controls[nightTarget].setErrors({ incorrect: true });
          }
          return { dnReq: true };
        }
        if (subFormVal.controls[target].hasError("incorrect")) {
          subFormVal.controls[target].setErrors(null);
        }
        return null; //need to clear error for other side (dn --> remove target err, vice versa)

        //If one of these has 'incorrect' and we need to clear it, we can just set all errors to null
        //All possible errors are max, min, and this (incorrect) which only happens when it is empty
      } else {
        if (targetVal === null) {
          subFormVal.controls[target].setErrors({ incorrect: true });
          return { targetReq: true };
        }
        if (subFormVal.controls[dayTarget].hasError("incorrect")) {
          subFormVal.controls[dayTarget].setErrors(null);
        }
        if (subFormVal.controls[nightTarget].hasError("incorrect")) {
          subFormVal.controls[nightTarget].setErrors(null);
        }
        return null; //need to clear error for other side (dn --> remove target err, vice versa)
      }
    };
  }
}
