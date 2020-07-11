import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { VariableManagementService } from 'src/app/variable-management.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.page.html',
  styleUrls: ['./visualization.page.scss'],
})
export class VisualizationPage implements OnInit {

  constructor(public variableManagentService: VariableManagementService) { 
    
  }

  
  ngOnInit() {
    //var time_labels = this.variableManagentService.sensorsTimeData;
    //var value_data =  this.variableManagentService.sensorsValueData;
    this.showChart()
  }

  showChart(){
    // var values_data = [];
    // for(var i=0;i<this.variableManagentService.sensorsValueData.length;i++)
    // {
    //   values_data.push(this.variableManagentService.sensorsValueData[i]);
    // }
    var sensor_data =[];  
    sensor_data = this.variableManagentService.getSensorData();
    var ctx = (<any>document.getElementById('lineChart')).getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
  data: {
    labels:sensor_data[1],
    //labels:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
    //labels:this.variableManagentService.sensorsTimeData,
    datasets: [{ 
        //data: [86,114,106,106,107,111,133,221,783,2478],
        //data:[7,7.3,7.5,7.1,7.6,7.9,7.2],
        data:sensor_data[0],
        label: "ph",
        borderColor: "#3e95cd",
        fill: false
       },
    ]
  },
  // options: {
  //   responsive: true,
  //   title: {
  //     display: true,
  //     text: 'World population per region (in millions)'
  //   }
  // }
});
}
}


// var dataFirst = {
//   label: "Car A - Speed (mph)",
//   data: [0, 59, 75, 20, 20, 55, 40],
//   lineTension: 0.3,
//   // Set More Options
// };
   
// var dataSecond = {
//   label: "Car B - Speed (mph)",
//   data: [20, 15, 60, 60, 65, 30, 70],
//   // Set More Options
// };

// var speedData = {
//   labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
//   datasets: [dataFirst]
// };


// var data1 = {
//   label: 's1',
//   borderColor: 'blue',
//   data: [
//           { x: '2017-01-06 18:39:30', y: 50 },
//           { x: '2017-01-15 18:39:28', y: 91 },
//           { x: '2017-03-07 18:39:28', y: 150 },
//       ]
// };



