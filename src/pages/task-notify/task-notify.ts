import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { LoginPage } from '../login/login';

import { Task } from '../../components/task/task';
import { IUser, User } from '../../components/user/user';

import { Toast } from '../../providers/toast';
import { TaskService } from '../../providers/task.service';
import { UserService } from '../../providers/user.service';
import { PushService } from '../../providers/push.service';

/*
  Generated class for the TaskNotify page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-notify',
  templateUrl: 'task-notify.html',
  providers: [PushService, TaskService, Toast]
})
export class TaskNotifyPage implements OnInit, OnDestroy {
  public authSubscription: Subscription;
  public selectedTask: Task;
  public loggedUser: User;
  public users: FirebaseListObservable<User[]>;
  public selectedUsers: User[] = new Array();
  public allSelected: boolean = false;
  public checked: boolean[] = new Array();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public pushService: PushService,
    public taskService: TaskService,
    public userService: UserService,
    public af: AngularFire) {
  }

  ngOnInit() {
    this.authSubscription = this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedTask = this.navParams.get('selectedTask');
        this.loggedUser = this.navParams.get('loggedUser');
        this.users = this.userService.getAll();
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }


  ionViewDidLoad() {
    console.log('Hello TaskNotifyPage Page');
  }

  isChecked(user: User): boolean {
    let checked: boolean = false;
    if (user.uid in this.selectedUsers) {
      checked = true;
    }
    return checked;
  }

  isDisabled(user: User): boolean {
    const disabled: boolean = (user.pushToken == null);
    return disabled;
  }

  forward(): void {
    let tokens: string[] = [];
    let sentTo: string[] = [];
    for (let token in this.checked) {
      if (this.checked[token]) {
        tokens.push(token);
        const uss = this.userService.findByPushToken(token).subscribe(snapshot => {
          if (snapshot.length > 0) {
            const user: User = new User(snapshot[0]);
            sentTo.push(user.fullname);
            uss.unsubscribe();
          }
        });
      }
    }

    this.pushService.sendPushNotification(tokens, this.selectedTask, this.loggedUser).then(outcome => {
      if (outcome) {
        this.taskService.markAsSent(sentTo, this.selectedTask, this.loggedUser);
        this.navCtrl.popToRoot();
      } else {
        this.toast.showToastWithCloseButton(
          'Invio notifica non riuscito!', 'Riprovare');
      }
    });
  }

  loadUser(user: IUser) {
    return new User(user);
  }

  onSelectAll() {
    console.log(this.allSelected);
    this.users.forEach((users: User[]) => {
      users.forEach((user: User) => {
        if (!this.isDisabled(user))
          if (this.allSelected) {
            this.checked[user.pushToken] = true;
          } else {
            this.checked[user.pushToken] = false;
          }
      });
    });
  }

  /**
   * @deprecated no more used
   */
  onUserCheckedOld(user: User) {
    if (this.selectedUsers[user.pushToken] != null) {
      delete this.selectedUsers[user.pushToken];
      this.allSelected = false;
    } else {
      this.selectedUsers[user.pushToken] = user;
    }
  }


}
