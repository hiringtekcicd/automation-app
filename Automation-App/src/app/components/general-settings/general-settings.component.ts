import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent implements OnInit {
  isOpen: boolean = false;
  @Input() parentForm: FormGroup;
  generalSettingsForm: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.generalSettingsForm = this.fb.group({
      'name': this.fb.control(null)
    });

    this.parentForm.addControl('general_settings', this.generalSettingsForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('general_settings');
  }
}
