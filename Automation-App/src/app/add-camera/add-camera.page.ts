import { ModalController } from '@ionic/angular';
import { VariableManagementService } from 'src/app/Services/variable-management.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'add-camera',
  templateUrl: './add-camera.page.html',
  styleUrls: ['./add-camera.page.scss'],
})
export class AddCameraPage implements OnInit {
  cameraForm: FormGroup = new FormGroup({});
  @Input() name: string;
  @Input() url: string;

  constructor(private fb : FormBuilder, private varman : VariableManagementService, public modalCtrl : ModalController) {}

  ngOnInit() {
    console.log(this.url);
    this.cameraForm = this.fb.group({
      'cam_name': this.fb.control(this.name),
      'cam_url': this.fb.control(this.url)
    });
  }

  onFormSubmit(){
    //validate and submit changes
    if(!this.cameraForm.valid){
      return;
    }
    console.log(this.cameraForm.value);
  }

}
