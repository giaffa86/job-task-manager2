import { /*Inject,*/ Injectable, } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { firebaseConfig } from '../app/app.module';
// import { FirebaseApp } from 'angularfire2';
//import * as firebase from 'firebase';

import { Toast } from './toast';

import { Task } from '../components/task/task';
import { User } from '../components/user/user';

/*
  Generated class for the PushService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PushService {

  //private _messaging: firebase.messaging.Messaging;

  constructor(public http: Http, public toast: Toast) {

    //, @Inject(FirebaseApp) public _firebaseApp: firebase.app.App) {

    // this._messaging = firebase.messaging(this._firebaseApp);
    // this._messaging.requestPermission()
    //   .then(() => { console.info('Firebase messaging initialized'); })
    //   .catch((error) => { console.error('Firebase messaging not initialized') });
  }



  sendPushNotification(pushToken: string[], task: Task, sentBy: User): Promise<boolean> {
    let url = 'https://fcm.googleapis.com/fcm/send';
    let body =
      {
        'registration_ids': pushToken,
        'priority': 'normal',
        'notification': {
          'body': task.fulladdress,
          'title': 'Intervento per ' + task.customer
        },
        'data': {
          'id': task.id,
          'sentBy': sentBy.uid,
          'sentDate': new Date()
        }
      };

    let headers: Headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'key=' + firebaseConfig.serverKey
    });
    let options = new RequestOptions({ headers: headers });

    // this.http.post(url, body, options).map(response => {
    //   return response;
    // }).subscribe(data => {
    //   //post doesn't fire if it doesn't get subscribed to
    //   console.log(data);
    // });
    return this.http.post(url, body, options).toPromise().then(response => (response.json().success === 1) as boolean)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    this.toast.showToastWithCloseButton(
      'Il servizio di notifica non è raggiungibile!', 'Errore');
    return Promise.reject(error.message || error);
  }

}
