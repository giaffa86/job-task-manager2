import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
//import { Subject } from 'rxjs/Subject';
import { AngularFire } from 'angularfire2';
import { User } from '../components/user/user';
import { Task } from '../components/task/task';

import { ConstantService } from './constant.service';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserTaskService {
  //private userTasks: FirebaseListObservable<any[]>;

  constructor(public http: Http, public af: AngularFire, public global: ConstantService) {
  }

  findUserTaskByStatus(uid: string, status: number): Observable<any[]> {
    const queryObservable = this.af.database.list('user_tasks/' + uid, {
      query: {
        orderByChild: 'status',
        equalTo: status
      }
    });

    // subscribe to changes
    return queryObservable;
  }

  linkTaskToUser(user: User, task: Task): void {
    let taskUser: any = new Object();
    taskUser[task.id] = {
      'status': task.status
    }
    this.af.database.object('user_tasks/' + user.uid).set(taskUser);
  }

}
