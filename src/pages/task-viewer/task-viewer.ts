import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { LoginPage } from '../login/login';

import { Task } from '../../components/task/task';
import { User } from '../../components/user/user';

import { Toast } from '../../providers/toast';
import { TaskService } from '../../providers/task.service';
import { UserService } from '../../providers/user.service';
import { ConstantService } from '../../providers/constant.service';
/*
  Generated class for the TaskViewer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-viewer',
  templateUrl: 'task-viewer.html',
  providers: [TaskService, UserService, Toast]
})
export class TaskViewerPage implements OnInit, OnDestroy {
  public authSubscription: Subscription;
  public selectedTask: Task;
  public loggedUser: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public global: ConstantService,
    public taskService: TaskService,
    public userService: UserService,
    public af: AngularFire) {
  }

  ngOnInit() {
    this.authSubscription = this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        // If we navigated to this page, we will have an item available as a nav param
        //this.tasks = this.navParams.get('tasks');
        this.selectedTask = this.navParams.get('selectedTask');
        this.loggedUser = this.navParams.get('loggedUser');
        
        this.userService.getById(auth.uid).subscribe(snapshot => {
          this.loggedUser = new User(snapshot);
        });
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('Hello TaskViewer Page');
  }

  isReportNotesReadOnly() {
    return (this.selectedTask.status != this.global.ONGOING);
  }

  canSeeReportNotes() {
    return (this.selectedTask.status == this.global.ONGOING || this.selectedTask.status == this.global.COMPLETED);
  }

  takeInCharge() {
    console.log("took in charge!");
    this.taskService.markAsTakenInCharge(this.selectedTask, this.loggedUser);
  }

  completeTask() {
    console.log("took in charge!");
    this.taskService.markAsCompleted(this.selectedTask, this.loggedUser);
  }

}
