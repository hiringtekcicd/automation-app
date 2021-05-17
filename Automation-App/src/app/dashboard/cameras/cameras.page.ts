import { Camera } from './../../models/camera.model';
import { VariableManagementService } from './../../Services/variable-management.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cameras',
  templateUrl: './cameras.page.html',
  styleUrls: ['./cameras.page.scss'],
})
export class CamerasPage implements OnInit {
  cameras: Camera[] = [];
  noCameras: boolean;

  constructor(private varman: VariableManagementService) {}

  ngOnInit() {
    this.varman.fertigationSystemSettings.subscribe( (devices) =>{
      
    });
    //cameras = something
    //get streams somehow
  }

}
