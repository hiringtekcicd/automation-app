import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableManagementService } from '../Services/variable-management.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  navigateToTab(tabName : string){
    this.router.navigate(['/dashboard/'+tabName], { queryParamsHandling: "preserve" });
  }
}

   

  

