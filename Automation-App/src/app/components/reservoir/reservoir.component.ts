import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'reservoir',
  templateUrl: './reservoir.component.html',
  styleUrls: ['./reservoir.component.scss'],
})
export class ReservoirComponent implements OnInit {
  isOpen: boolean = false;

  @Input() parentForm: FormGroup;
  reservoirForm: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.reservoirForm = this.fb.group({
      'reservoir_size': this.fb.control(null),
      'is_control': this.fb.control(true),
      'water_replacement_interval': this.fb.control(null)
    });

    this.parentForm.addControl('reservoir_control', this.reservoirForm);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(){
    this.parentForm.removeControl('reservoir_control');
  }
}
