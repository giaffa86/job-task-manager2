import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
//import { Map } from 'rxjs/add/operator';
import { AngularFire, FirebaseAuthState, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { IUser, User } from '../components/user/user';

import { ConstantService } from './constant.service';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  public users: FirebaseListObservable<User[]>;

  constructor(public http: Http, public af: AngularFire, public global: ConstantService) {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        this.users = this.af.database.list('/users');
      }
    });
  }

  findByPushToken(pushToken: string): Observable<User[]> {
    const queryObservable = this.af.database.list('/users', {
      query: {
        orderByChild: 'pushToken',
        equalTo: pushToken
      }
    });

    // subscribe to changes
    return queryObservable.take(1);
  }

  generateUserFromAuth(authState: FirebaseAuthState) {
    const u: IUser = {
      uid: authState.uid,
      email: authState.auth.email,
      name: authState.auth.displayName,
      surname: null,
      roles: null,
      pushToken: null
    };

    return new User(u);
  }

  getAll(): FirebaseListObservable<User[]> {
    return this.users;
  }

  getById(uid: string): FirebaseObjectObservable<User> {
    let firebaseUser: FirebaseObjectObservable<User> = this.af.database.object('users/' + uid);
    return firebaseUser;
  }

  getFromAuth(auth: FirebaseAuthState): Observable<User> {
    return this.af.database.object('user/' + auth.uid, { preserveSnapshot: true }).take(1);
  }

  updateRemoteUser(remoteUser: FirebaseObjectObservable<User>, user: User): void {
    // create or update firebase object 
    remoteUser.update(user.data);
  }

  getRemoteUserFromLogin(auth: FirebaseAuthState): FirebaseObjectObservable<User> {
    const user = this.generateUserFromAuth(auth);
    const firebaseUser = this.getById(auth.uid);
    // if some login data has been changed, let's update remote data
    this.updateRemoteUser(firebaseUser, user);
    return firebaseUser;
  }

  savePushToken(user: User, pushToken: string): void {
    const firebaseUser = this.getById(user.uid);
    user.pushToken = pushToken;
    this.updateRemoteUser(firebaseUser, user);
  }

  isAdmin(user: User): boolean {
    let isAdmin: boolean = false;
    if (user != null && user.roles != null) {
      isAdmin = user.roles.includes(this.global.ADMIN_ROLE);
    }
    return isAdmin;
  }

  isOperator(user: User): boolean {
    let isOperator: boolean = false;
    if (user != null && user.roles != null) {
      isOperator = user.roles.includes(this.global.OPERATOR_ROLE);
    }
    return isOperator;
  }

  isTechnician(user: User): boolean {
    let isTechnician: boolean = false;
    if (user != null && user.roles != null) {
      isTechnician = user.roles.includes(this.global.TECHNICIAN_ROLE);
    }
    return isTechnician;
  }

  sendPushNotification(uids: string[]): void {
  }
}
