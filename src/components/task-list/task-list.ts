import { Component, Input } from '@angular/core';

import { AngularFire/*, FirebaseListObservable*/ } from 'angularfire2';

import { NavController, Platform } from 'ionic-angular';
import { TaskEditorPage } from '../../pages/task-editor/task-editor';
import { TaskViewerPage } from '../../pages/task-viewer/task-viewer';

import { MapPage } from '../../pages/map/map';
import { MapBrowserPage } from '../../pages/map/map-browser';

import { UserService } from '../../providers/user.service';

import { ITask, Task } from '../task/task';
import { User } from '../user/user';


@Component({
  selector: 'task-list',
  templateUrl: 'task-list.html',
})
export class TaskList {
  @Input() tasks: Task[];
  @Input() editable: boolean = false;
  @Input() viewable: boolean = false;
  public loggedUser: User;


  constructor(
    public af: AngularFire,
    public platform: Platform,
    public navCtrl: NavController,
    public userService: UserService) {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        const us = userService.getById(auth.uid).subscribe(snapshot => {
          this.loggedUser = new User(snapshot);
        });
        us.unsubscribe();
      }
    });
  }

  openEditTaskPage(event, selectedTask: ITask): void {
    this.navCtrl.push(TaskEditorPage, {
      tasks: this.tasks,
      loggedUser: this.loggedUser,
      selectedTask: new Task(selectedTask)
    });
  }

  openViewTaskPage(event, selectedTask: ITask): void {
    this.navCtrl.push(TaskViewerPage, {
      tasks: this.tasks,
      loggedUser: this.loggedUser,
      selectedTask: new Task(selectedTask)
    });
  }

  openMapPage(event, selectedTask): void {
    const params = {
      selectedTask: selectedTask
    };

    if (this.platform.is('core')) {
      this.navCtrl.push(MapBrowserPage, params);
    }
    else {
      this.navCtrl.push(MapPage, params);
    }
  }
}
