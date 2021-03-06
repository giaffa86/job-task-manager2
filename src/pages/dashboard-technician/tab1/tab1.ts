import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// import { Observable } from 'rxjs/Rx';
import { AngularFire, /*FirebaseListObservable*/ } from 'angularfire2';

import { User } from '../../../components/user/user';
import { /*ITask,*/ Task } from '../../../components/task/task';

import { Toast } from '../../../providers/toast';
import { ConstantService } from '../../../providers/constant.service';
import { UserService } from '../../../providers/user.service';
import { TaskService } from '../../../providers/task.service';
import { UserTaskService } from '../../../providers/usertask.service';

import { LoginPage } from '../../login/login';


/*
  Generated class for the DashboardTechnicianTab1 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'dashboard-technician-tab1',
  templateUrl: 'tab1.html',
  providers: [Toast, TaskService, UserService]
})
export class DashboardTechnicianTab1 {
  public tasks: Task[];
  public status: number;
  public title: string;
  public canEditTask = false;
  public canViewTask = false;
  public loggedUser: User;

  constructor(
    public af: AngularFire,
    public navCtrl: NavController,
    public params: NavParams,
    public global: ConstantService,
    public taskService: TaskService,
    public userService: UserService,
    public userTaskService: UserTaskService,
    public toast: Toast) {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {

        this.params = params;
        this.title = this.params.data.title;
        this.canEditTask = this.params.data.canEditTask;
        this.canViewTask = this.params.data.canViewTask;
        this.status = this.params.data.status;
        console.log('status: ' + this.status); // returns NavParams {data: Object}

        userService.getById(auth.uid).subscribe(snapshot => {
          this.loggedUser = new User(snapshot);
          this.loadTasks(this.status);
          // us.unsubscribe();
        });

      } else {
        // If logged out, they redirect them to the login page
        this.navCtrl.setRoot(LoginPage);
      }

    });
  }

  ionViewDidLoad() {
    console.log('Hello DashboardTechnicianTab1');
  }

  count(): number {
    return 3;
  }

  loadTasks(status) {
    if (status === this.global.SENT) {
      this.taskService.getFilteredTaskByStatus()
        // .map(each => each.filter((task: Task) => {
        //   const filter: boolean = task.takenChargeBy != null && task.takenChargeBy.userId === 'ooA7x13KRUgt5ABHEOVoP0WQiSs2'
        //   return filter;
        // }))
        .subscribe(tasks => {
          console.log(tasks);
          this.tasks = tasks;
        });
      this.taskService.filterByStatus(status);
    } else {
      this.taskService.getFilteredTaskByInCharge()
        .map(each => each.filter((task: Task) => {
          return task.status === this.status
        }))
        .subscribe(tasks => {
          console.log(tasks);
          this.tasks = tasks;
        });

      this.taskService.filterByInCharge(this.loggedUser.uid);
    }
  }

}
