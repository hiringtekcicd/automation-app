import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'irrigation',
  templateUrl: './irrigation.component.html',
  styleUrls: ['./irrigation.component.scss'],
})
export class IrrigationComponent implements OnInit {
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  irrigationForm: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.irrigationForm = this.fb.group({
      'on_interval': this.fb.control(null),
      'off_interval': this.fb.control(null)
    });

    this.parentForm.addControl('irrigation', this.irrigationForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('irrigation');
  }
}
