import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

//see https://offering.solutions/blog/articles/2020/05/03/cross-field-validation-using-angular-reactive-forms/#passing-the-age-threshold-into-the-validator
//compares small and big, small must be smaller than big, otherwise compareError is set
@Injectable({providedIn: 'root'})
export class TwoValCompareValidator{
    public twoValCompare(small: string, big: string): ValidatorFn{
        return (form: FormGroup) => {
            const smallVal = form.get(small).value;
            const bigVal = form.get(big).value;
            if(smallVal === null || bigVal === null) return null;
            return smallVal < bigVal ? null : {'compareError': true};
        }
    }
}