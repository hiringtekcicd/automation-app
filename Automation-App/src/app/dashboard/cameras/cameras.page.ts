import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.page.html',
  styleUrls: ['./cameras.page.scss'],
})
export class CamerasPage implements OnInit {
  cameras: string[]; //this is NOT CORRECT! find a way to stream stuff and change this type
  noCameras: boolean; //in case there are no cameras

  constructor() { }

  ngOnInit() {
    //cameras = something
    //get streams somehow
  }

}
