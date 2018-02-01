import { Component } from '@angular/core';
import { Push, PushToken } from '@ionic/cloud-angular';


import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TaskEditorPage } from '../task-editor/task-editor';

import { ITask, Task } from '../../components/task/task';
import { User } from '../../components/user/user';
import { TabTasksComponent } from '../../components/tab-tasks/tab-tasks';


import { ConstantService } from '../../providers/constant.service';
import { TaskService } from '../../providers/task.service';
import { Toast } from '../../providers/toast';
import { UserService } from '../../providers/user.service';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [ConstantService, Toast, TaskService, UserService]
})
export class DashboardPage {
  public loggedUser: User;
  private tabs: any[] = new Array(3);
  private tabCount: number[] = new Array(3);
  public tasks: FirebaseListObservable<Task[]>;

  constructor(public af: AngularFire,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public platform: Platform,
    public push: Push,
    public toast: Toast,
    public global: ConstantService,
    public taskService: TaskService,
    public userService: UserService) {
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


        // this.tasks = this.af.database.list('/tasks');
        // this.tasks = this.taskService.getAllTask();

        if (this.platform.is('android') || this.platform.is('ios')) {
          this.push.register().then((t: PushToken) => {
            this.push.saveToken(t).then((t: PushToken) => {
              console.log('Token saved:', t.token);
              userService.savePushToken(this.loggedUser, t.token);
            });

          });

          this.push.rx.notification()
            .subscribe((data) => {
              //this.toast.showToastWithCloseButton(msg.title + ': ' + msg.text, 'Ok');

              console.log('message', data.text);
              let self = this;
              //if user using app and push notification comes
              if (!data.app.asleep && !data.app.closed) {
                // if application open, show popup
                let confirmAlert = this.alertCtrl.create({
                  title: 'New Notification',
                  message: data.text,
                  buttons: [{
                    text: 'Ignore',
                    role: 'cancel'
                  }, {
                    text: 'View',
                    handler: () => {
                      //TODO: Your logic here
                      self.navCtrl.push(TaskEditorPage, {
                        tasks: this.tasks,
                        selectedTask: new Task(new ITask())
                      });
                    }
                  }]
                });
                confirmAlert.present();
              } else {
                //if user NOT using app and push notification comes
                //TODO: Your logic on click of push notification directly
                self.navCtrl.push(TaskEditorPage, {
                  tasks: this.tasks,
                  selectedTask: new Task(new ITask())
                });
                console.log("Push notification clicked");
              }
            });
        }

      } else {
        // If logged out, they redirect them to the login page
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }


  buildTab() {
    this.tabs = new Array(3);
    this.navParams.data.tabs = new Array(3);
    
    this.tabs[0] = TabTasksComponent;
    this.tabs[1] = TabTasksComponent;
    this.tabs[2] = TabTasksComponent;
    this.tabs[3] = TabTasksComponent;

    this.navParams.data.tabs[0] = {
      'status': this.global.DRAFT,
      'title': 'In Bozza',
      'canEditTask': true,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };
    this.navParams.data.tabs[1] = {
      'status': this.global.SENT,
      'title': 'In attesa',
      'canEditTask': true,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };
    this.navParams.data.tabs[2] = {
      'status': this.global.ONGOING,
      'title': 'In lavorazione',
      'canEditTask': false,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };
    this.navParams.data.tabs[3] = {
      'status': this.global.COMPLETED,
      'title': 'Completate',
      'canEditTask': false,
      'canViewTask': true,
      'loggedUser': this.loggedUser
    };


    // conto il numero di attività per ogni tab
    this.navParams.data.tabs.forEach(element => {
      this.count(element);
    });
  }

  count(params: any): void {
    this.taskService.getFilteredTaskByStatusCount().take(1).subscribe(count => {
      this.tabCount[params.status] = count;
    });

    this.taskService.filterByStatus(params.status);
  }

  openAddTaskPage(event) {
    this.navCtrl.push(TaskEditorPage, {
      tasks: this.tasks,
      loggedUser: this.loggedUser,
      selectedTask: new Task(new ITask())
    });
  }

}
