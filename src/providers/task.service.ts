import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Task } from '../components/task/task';
import { User } from '../components/user/user';

import { Toast } from './toast';
import { UserTaskService } from './usertask.service';
import { ConstantService } from './constant.service';
import { ArrayUtils } from './array.utils';

import { Client } from 'elasticsearch';


/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TaskService {
  tasks: FirebaseListObservable<Task[]>;
  filteredTasksByStatus: FirebaseListObservable<Task[]>;
  filteredTasksByInCharge: FirebaseListObservable<Task[]>;
  statusSubject: Subject<any>;
  inChargeSubject: Subject<any>;
  esClient: Client;

  constructor(public http: Http,
    public af: AngularFire,
    public toast: Toast,
    public arrayUtils: ArrayUtils,
    public userTaskService: UserTaskService,
    public global: ConstantService) {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        this.tasks = this.af.database.list('/tasks');
      }
    });

    this.statusSubject = new Subject();
    this.inChargeSubject = new Subject();
    this.filteredTasksByStatus = af.database.list('/tasks', {
      query: {
        orderByChild: 'status',
        equalTo: this.statusSubject
      }
    });
    this.filteredTasksByInCharge = af.database.list('/tasks', {
      query: {
        orderByChild: 'takenChargeBy/userId',
        equalTo: this.inChargeSubject
      }
    });

    this.esClient = new Client({
      host: global.ELASTIC_SEARCH_BASE_URL,
      log: 'trace'
    });

    this.esClient.search({
      index: 'firebase',
      type: 'task',
      body: {
        'query': {
          'query_string': {
            'fields': ['title', 'description', 'place', 'address', 'activity', 'customer'],
            'query': 'attività'
          }
        }
      }
    }).then(function (body) {
      var hits = body.hits.hits;
      console.trace(hits);
    }, function (error) {
      console.trace(error.message);
    });

  }

  search(keyword: string): PromiseLike<Task[]> {
    let tasks: Task[] = [];
    
    let elasticReq = {
      index: 'firebase',
      type: 'task',
      body: {
        'query': {
          'query_string': {
            'fields': ['title', 'description', 'place', 'address', 'activity', 'customer'],
            'query': 'attività'
          }
        }
      }
    };


    return this.esClient.search(elasticReq).then(function (body) {
      var hits = body.hits.hits;
      for (let h of hits) {
        tasks.push(<Task> h._source) //Produces Observables with an "order" in it.
      }
      console.trace(hits);
      return tasks;
    }, function (error) {
      console.trace(error.message);
      return tasks;
    });

  }

  createNewTask(task: Task, user: User): void {
    console.log(task);
    task.status = this.global.DRAFT;
    task.createdBy = user.fullname;
    task.createdDate = new Date();
    this.tasks.push(task)
      .then(() => {
        this.toast.showToastWithCloseButton(
          'Il rapportino è stato creato con successo!', 'OK')
      })
      .catch(error => {
        this.toast.showToastWithCloseButton
          ('Un errore è accaduto durente il tentativo di creazione del rapportino!', 'Riprova')
      });
  }

  filterByStatus(status: number): void {
    this.statusSubject.next(status);
  }

  filterByInCharge(userId: string): void {
    this.inChargeSubject.next(userId);
  }

  getById(taskId: string): Observable<Task> {
    return this.af.database.object('task/' + taskId, { preserveSnapshot: true }).take(1);
  }

  getFromKeys(userTasks: Observable<any[]>): Observable<Task>[] {
    let tasks: Observable<Task>[] = [];

    userTasks.subscribe(ut => {
      for (let userTask of ut) {
        tasks.push(this.getById(userTask.$key)) //Produces Observables with an "order" in it.
      }
    });

    return tasks;
  };

  getAllTask(): FirebaseListObservable<Task[]> {
    return this.tasks;
  }

  getFilteredTaskByStatus(): FirebaseListObservable<Task[]> {
    return this.filteredTasksByStatus;
  }

  getFilteredTaskByStatusCount(): Observable<number> {
    return this.filteredTasksByStatus.map(list => list.length as number);
  }

  getFilteredTaskByInCharge(): FirebaseListObservable<Task[]> {
    return this.filteredTasksByInCharge;
  }

  getFilteredTaskByInChargeCount(): Observable<number> {
    return this.filteredTasksByInCharge.map(list => list.length as number);
  }

  markAsSent(sentTo: string[], task: Task, userWorker: User) {
    if (task.id != null) {
      if (task.status == this.global.DRAFT) {
        task.status = this.global.SENT;
      }
      if (!task.sentTo) {
        task.sentTo = new Array();
      }
      task.sentTo = this.arrayUtils.unique(task.sentTo.concat(sentTo));
      task.sentBy = userWorker.fullname;
      task.sentDate = new Date();
      this.saveTask(task.id, task, userWorker).then(() => {
        this.toast.showToastWithCloseButton(
          'L\'attività è stata notificata correttamente!', 'OK');
        return true;
      }).catch(error => {
        this.toast.showToastWithCloseButton(
          'Un errore è accaduto durante il tentativo di aggiornamento del rapportino!', 'Riprova');
      });
    } else {
      this.toast.showToastWithCloseButton(
        'L\'attività da inoltrare non è valida!', 'Errore');
    }
  }

  markAsTakenInCharge(task: Task, userWorker: User) {
    if (task.id != null) {
      if (task.status == this.global.SENT) {
        task.status = this.global.ONGOING;
        task.takenChargeBy = {
          userFullname: userWorker.fullname,
          userId: userWorker.uid,
          date: new Date()
        };
        this.saveTask(task.id, task, userWorker).then(() => {
          this.userTaskService.linkTaskToUser(userWorker, task);
          this.toast.showToastWithCloseButton(
            'L\'attività è stata presa in carico correttamente!', 'OK');
          return true;
        }).catch(error => {
          this.toast.showToastWithCloseButton(
            'Un errore è accaduto durante il tentativo di aggiornamento del rapportino!', 'Riprova');
        });
      } else {
        this.toast.showToastWithCloseButton(
          'Lo stato attuale dell\'attività non permette la presa in carico!', 'Errore');
      }
    } else {
      this.toast.showToastWithCloseButton(
        'L\'attività da prendere in carico non è valida!', 'Errore');
    }
  }

  markAsCompleted(task: Task, userWorker: User):void {
    if (task.id != null) {
      if (task.status == this.global.ONGOING) {
        task.status = this.global.COMPLETED;
        task.completedDate = new Date();
        this.saveTask(task.id, task, userWorker).then(() => {
          this.userTaskService.linkTaskToUser(userWorker, task);
          this.toast.showToastWithCloseButton(
            'L\'attività è stata completata!', 'OK');
          return true;
        }).catch(error => {
          this.toast.showToastWithCloseButton(
            'Un errore è accaduto durante il tentativo di completamento del rapportino!', 'Riprova');
        });
      } else {
        this.toast.showToastWithCloseButton(
          'Lo stato attuale dell\'attività non permette la conclusione!', 'Errore');
      }
    } else {
      this.toast.showToastWithCloseButton(
        'L\'attività da concludere non è valida!', 'Errore');
    }
  }

  updateTask(key: string, task: Task, userWorker: User): firebase.Promise<void> {
    return this.saveTask(key, task, userWorker)
      .then(() => {
        this.toast.showToastWithCloseButton(
          'Il rapportino è stato aggiornato!', 'OK');
      })
      .catch(error => {
        this.toast.showToastWithCloseButton(
          'Un errore è accaduto durante il tentativo di aggiornamento del rapportino!', 'Riprova');
      });
  }

  private saveTask(key: string, task: Task, userWorker: User): firebase.Promise<void> {
    const taskToUpdate = Object.assign(new Object(), task.initData);
    delete taskToUpdate['$key'];
    delete taskToUpdate['$exists'];

    //update null values
    // task.id = key;
    task.status = task.status != null ? task.status : this.global.DRAFT;
    task.createdBy = task.createdBy != null ? task.createdBy : userWorker.fullname;
    task.createdDate = task.createdDate != null ? task.createdDate : new Date();
    task.lastModifiedDate = new Date();

    return this.tasks.update(key, taskToUpdate)
      .then(() => {
        return true;
      })
      .catch(error => {
        return false;
      });
  }

}
