import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

//see https://offering.solutions/blog/articles/2020/05/03/cross-field-validation-using-angular-reactive-forms/#passing-the-age-threshold-into-the-validator
@Injectable({providedIn: 'root'})
export class TwoValCompareValidator{
    public twoValCompare(small: string, big: string): ValidatorFn{
        return (form: FormGroup) => {
            const smallVal = form.get(small).value;
            const bigVal = form.get(big).value;
            console.warn('2valcompare',smallVal,bigVal);
            if(smallVal === null || bigVal === null) return null;
            return smallVal < bigVal ? null : {'compareError': true};
        }
    }
}