import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { LoginPage } from '../login/login';
import { TaskNotifyPage } from '../task-notify/task-notify';

import { Task } from '../../components/task/task';
import { User } from '../../components/user/user';

import { Toast } from '../../providers/toast';
import { TaskService } from '../../providers/task.service';
/*
  Generated class for the TaskEditor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-editor',
  templateUrl: 'task-editor.html',
  providers: [TaskService, Toast]
})
export class TaskEditorPage implements OnInit, OnDestroy {
  public authSubscription: Subscription;
  //public tasks: FirebaseListObservable<Task[]>;
  public selectedTask: Task;
  public loggedUser: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public taskService: TaskService,
    public af: AngularFire) {
  }

  ngOnInit() {
    this.authSubscription = this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        // If we navigated to this page, we will have an item available as a nav param
        //this.tasks = this.navParams.get('tasks');
        this.selectedTask = this.navParams.get('selectedTask');
        this.loggedUser = this.navParams.get('loggedUser');
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('Hello TaskEditorPage Page');
  }

  saveAndForward(task): void {
    this.navCtrl.push(TaskNotifyPage, {
      loggedUser: this.loggedUser,
      selectedTask: task
    });
  }

  saveOrUpdate(task:Task): void {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        const id = task.id;
        if (id) {
          // update task
          this.taskService.updateTask(id, task, this.loggedUser); 1
        } else {
          // new task
          this.taskService.createNewTask(task, this.loggedUser);
        }
      }
    });
  }
}
