import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFire } from 'angularfire2';
import { LoginPage } from '../login/login';

import { DashboardTechnicianTab1 } from './tab1/tab1';
/*import { DashboardTechnicianTab2 } from './tab2/tab2';
import { DashboardTechnicianTab3 } from './tab3/tab3';*/

import { User } from '../../components/user/user';

import { Toast } from '../../providers/toast';
import { TaskService } from '../../providers/task.service';
import { ConstantService } from '../../providers/constant.service';
import { UserService } from '../../providers/user.service';


/*
  Generated class for the DashboardTechnician page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard-technician',
  templateUrl: 'dashboard-technician.html',
  providers: [Toast, TaskService, UserService]
})
export class DashboardTechnicianPage {
  private loggedUser: User;
  private tabs: any[] = new Array(3);
  private tabCount: number[] = new Array(3);


  constructor(
    public af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams,
    public taskService: TaskService,
    public userService: UserService,
    public global: ConstantService) {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {

        this.loggedUser = navParams.get('loggedUser');
        if (this.loggedUser == null) {
          //const us = 
          userService.getById(auth.uid).subscribe(snapshot => {
            this.loggedUser = new User(snapshot);
            // ricarica dei tab
            this.buildTab();
          });
        } 
          
        this.buildTab();

      } else {
        // If logged out, they redirect them to the login page
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
    console.log('Hello DashboardTechnicianPage');
  }

  /** 
   * @Deprecated
   */
  onTabChange(event) {
    console.log(event);
    switch (event.id) {
      case 't0-0':
        this.navParams.data = { 'status': 2 };
        break;

      default:
        break;
    }
  }

  count(params: any): void {
    this.taskService.getFilteredTaskByStatusCount().take(1).subscribe(count => {
      this.tabCount[params.status] = count;
    });

    this.taskService.filterByStatus(params.status);
  }

  buildTab() {
    this.tabs = new Array(3);
    this.navParams.data.tabs = new Array(3);
    
    this.tabs[0] = DashboardTechnicianTab1;
    this.tabs[1] = DashboardTechnicianTab1;
    this.tabs[2] = DashboardTechnicianTab1;
    
    this.navParams.data.tabs[0] = {
      'status': this.global.SENT,
      'title': 'Nuove attività',
      'canEditTask': false,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };
    this.navParams.data.tabs[1] = {
      'status': this.global.ONGOING,
      'title': 'Attività in corso',
      'canEditTask': false,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };
    this.navParams.data.tabs[2] = {
      'status': this.global.COMPLETED,
      'title': 'Attività completate',
      'canEditTask': false,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };


    // conto il numero di attività per ogni tab
    this.navParams.data.tabs.forEach(element => {
      this.count(element);
    });
  }

}
