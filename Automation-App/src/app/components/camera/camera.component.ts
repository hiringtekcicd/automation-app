import { Camera } from './../../models/camera.model';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  @Input() cameraData: Camera;
   
  constructor() { }

  ngOnInit() {}

}
