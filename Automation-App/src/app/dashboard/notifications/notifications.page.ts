import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, ViewChild  } from "@angular/core";
import { Notification } from 'src/app/models/notification.model';
import { IonInfiniteScroll } from '@ionic/angular';



@Component({
  selector: "app-notification",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit {
  noNotifs: boolean = false;
  notifs: Notification[] = [];
  notifs2: Notification[] = [];
  notifsAmount: number;
  unopenedCounter: number;
  @Output() newItemEvent = new EventEmitter<number>();
  numTimesLeft = 5;  
  fun = 0;

  


  //see control page - ngOnInit about getting device settings and then getting topicID
  constructor(
    public router: Router,

  ) {}



  ngOnInit() {
    this.notifs = [{"date": new Date().toLocaleString(), "buttonColor": '#bbdefb', "opened": false, "notifHeader": "Plant Health", "notifBody": "Your plant may have covid", "notifText": "To test for the COVID-19 virus, a health care provider takes a sample from the nose (nasopharyngeal swab), throat (throat swab) or saliva. The samples are then sent to a lab for testing. If you're coughing up sputum, that may be sent for testing. The FDA has authorized at-home tests for the COVID-19 virus."}, {"date": new Date().toLocaleString(), "buttonColor": '#bbdefb', "opened": false, "notifHeader": "Plant Health", "notifBody": "Your plant may have covid", "notifText": "To test for the COVID-19 virus, a health care provider takes a sample from the nose (nasopharyngeal swab), throat (throat swab) or saliva. The samples are then sent to a lab for testing. If you're coughing up sputum, that may be sent for testing. The FDA has authorized at-home tests for the COVID-19 virus."}, {"date": new Date().toLocaleString(), "buttonColor": '#bbdefb', "opened": false, "notifHeader": "Plant Health", "notifBody": "Your plant may have covid", "notifText": "To test for the COVID-19 virus, a health care provider takes a sample from the nose (nasopharyngeal swab), throat (throat swab) or saliva. The samples are then sent to a lab for testing. If you're coughing up sputum, that may be sent for testing. The FDA has authorized at-home tests for the COVID-19 virus."}, {"date": new Date().toLocaleString(), "buttonColor": '#bbdefb', "opened": false, "notifHeader": "Plant Health", "notifBody": "Your plant may have covid", "notifText": "To test for the COVID-19 virus, a health care provider takes a sample from the nose (nasopharyngeal swab), throat (throat swab) or saliva. The samples are then sent to a lab for testing. If you're coughing up sputum, that may be sent for testing. The FDA has authorized at-home tests for the COVID-19 virus."}, {"date": new Date().toLocaleString(), "buttonColor": '#bbdefb', "opened": false, "notifHeader": "Plant Health", "notifBody": "Your plant may have covid", "notifText": "To test for the COVID-19 virus, a health care provider takes a sample from the nose (nasopharyngeal swab), throat (throat swab) or saliva. The samples are then sent to a lab for testing. If you're coughing up sputum, that may be sent for testing. The FDA has authorized at-home tests for the COVID-19 virus."}]
    this.notifsAmount = this.notifs.length;
    console.log('ngoninit')
    console.log(this.notifsAmount)
    if(this.notifsAmount == 0){
      this.noNotifs = true;
    }

    let counter: number = 0;
    for(let i = 0; i < this.notifs.length; i++){
      if(this.notifs[i].opened == false){
        counter++;
      }
    }
    this.unopenedCounter = counter;
    
  }




  addNewItem(event: MouseEvent) {
    this.fun++;
    for(let i = 0; i < this.notifs.length; i++){
      if(this.notifs[i].opened == false){
        this.newItemEvent.emit(8);
        break;
      }
      
    }
    console.log('before notifs'+' '+this.notifsAmount+' '+'fun'+' '+this.fun);
    this.newItemEvent.emit(this.notifsAmount-this.fun);
    console.log('notifs'+' '+this.notifsAmount+' '+'fun'+' '+this.fun);
  }

  navigateToTab2(tabName : string, notifArray: Notification[], notification: Notification){     
    notification.buttonColor = '#FFFFFF';
    
    notification.opened = true;
    let counter: number = 0;
    for(let i = 0; i < notifArray.length; i++){
      if(notifArray[i].opened == false){
        counter++;
      }
    }
    this.unopenedCounter = counter;
    console.log('this is fun'+' '+this.unopenedCounter);
    
    
    
    
    
    this.router.navigate(['/dashboard/notifications/clickedNotifications'], { 
      state: { example: notification} });
      
  }

  loadData(event) {  
    setTimeout(() => {  
      console.log('Done');  
      this.addMoreItems();  
      this.numTimesLeft -= 1;  
      event.target.complete();  
    }, 500);  
  }  
  addMoreItems() {  
    for (let i = 0; i < 10; i++) {  
      this.notifs.push({"date": new Date().toLocaleString(), "buttonColor": '#bbdefb', "opened": false, "notifHeader": "Plant Health", "notifBody": "Your plant may have covid", "notifText": "To test for the COVID-19 virus, a health care provider takes a sample from the nose (nasopharyngeal swab), throat (throat swab) or saliva. The samples are then sent to a lab for testing. If you're coughing up sputum, that may be sent for testing. The FDA has authorized at-home tests for the COVID-19 virus."});  
    }  
  
}
}
