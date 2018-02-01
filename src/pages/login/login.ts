import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { MyApp } from '../../app/app.component';

// import { DashboardPage } from '../dashboard/dashboard';
// import { DashboardTechnicianPage } from '../dashboard-technician/dashboard-technician';

// import { User } from '../../components/user/user';

import { UserService } from '../../providers/user.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserService]
})
export class LoginPage {
  public email: string;
  public password: string;
  //public loggedUser: User;

  constructor(public af: AngularFire,
    public navCtrl: NavController,
    public userService: UserService) {
    this.af.auth.subscribe(auth => {
      if (auth != null && auth.uid) {
        // If logged in, they redirect them to the home page
        navCtrl.setRoot(MyApp);
      }
    });
  }

  login(): void {
    this.af.auth.login({ email: this.email, password: this.password });
  }

  // logout(): void {
  //   this.af.auth.logout();
  // }
}
