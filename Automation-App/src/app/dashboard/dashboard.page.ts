import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MqttInterfaceService } from '../Services/mqtt-interface.service';
import { VariableManagementService } from '../Services/variable-management.service';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  title: String;
  unOpened: number;
  correct = true;
  onNotification;
  notifs: Notification[] = [];
  constructor(private router: Router, public mqttService: MqttInterfaceService, public variableManagementService: VariableManagementService) { }

  ngOnInit() { //initial name
    if(this.variableManagementService.notifications.length == 0) {
      this.variableManagementService.getNotifications().subscribe(notificationsArray => {
        this.notifs = notificationsArray;
      });
    }

    let tempRoute = this.router.url.substr(11);
    if(tempRoute.indexOf('?') !== -1){ //if has query params, cut them out
      tempRoute = tempRoute.substr(0,tempRoute.indexOf('?'));
    }
    this.title = tempRoute[0].toUpperCase() + tempRoute.substr(1);
    this.onNotification = false;
  }

  navigateToTab(tabName : string){
console.log(this.notifs[0]);
    if(tabName == 'notifications'){
      this.router.navigate(['/dashboard/'+tabName], { state: { notifArray: this.notifs} });
      this.title = tabName[0].toUpperCase() + tabName.substr(1); // capitalize this
      this.onNotification = true;
    }
    
    else{
    this.router.navigate(['/dashboard/'+tabName], { queryParamsHandling: "preserve" });
    this.title = tabName[0].toUpperCase() + tabName.substr(1); // capitalize this
  }
  }


addItem(newItem: number) {
  this.unOpened = newItem;
  
}
}
   

  

