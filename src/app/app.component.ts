import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DashboardTechnicianPage } from '../pages/dashboard-technician/dashboard-technician';

import { UserService } from '../providers/user.service';

import { User } from '../components/user/user';



@Component({
  templateUrl: 'app.html',
  providers: [UserService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // ion-nav parameter
  rootPage: any;
  rootParams: any; //doesn't work

  pages: Array<{ title: string, component: any }>;

  dashboard: any;

  isMenuEnabled: boolean = false;

  loggedUser: User;

  constructor(public platform: Platform,
    public af: AngularFire,
    public userService: UserService) {

    this.initializeApp();

    this.dashboard = { title: 'Dashboard', component: DashboardPage };

    // used for an example of ngFor and navigation
    this.pages = [
    ];

  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      // This will print an array of the current platforms
      console.log("Current Platform: " + this.platform.platforms());

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Splashscreen.hide();

      this.af.auth.subscribe((auth) => {
        // debugger;
        if (auth != null && auth.uid) {
          // this.rootPage = DashboardPage;
          // this.rootPage = LoginPage;
          //const userSubscription = 
          this.userService.getById(auth.uid).subscribe(snapshot => {
            console.log('Logged User email: ' + snapshot.email);
            if (snapshot.uid == null) {
              this.userService.getRemoteUserFromLogin(auth);
            }
            this.loggedUser = new User(snapshot);
            this.setRoot();
            //userSubscription.unsubscribe();
          });

        } else {
          this.rootPage = LoginPage;
          this.isMenuEnabled = false;
        }

      });

      StatusBar.styleDefault();
    });
  }

  welcomeMessage(): string {
    let welcomeMessage = "Benventuto ";
    if (this.loggedUser != null) {
      welcomeMessage = this.loggedUser.fullname;
    }
    return welcomeMessage;
  }

  setRoot() {
    if (this.userService.isAdmin(this.loggedUser)) {
      this.rootPage = DashboardPage;
      this.rootParams = { loggedUser: this.loggedUser };
      this.isMenuEnabled = true;
    }
    else if (this.userService.isOperator(this.loggedUser)) {
      this.rootPage = DashboardPage;
      this.rootParams = { loggedUser: this.loggedUser };
      this.isMenuEnabled = true;
    }
    else if (this.userService.isTechnician(this.loggedUser)) {
      this.rootPage = DashboardTechnicianPage;
      this.rootParams = { loggedUser: this.loggedUser };
      this.isMenuEnabled = true;
    } else {
      // user not recognized, forced logout
      this.af.auth.logout();
      this.rootPage = LoginPage;
    }
  }

  openDashboard(): void {
    this.setRoot();
    this.nav.setRoot(this.rootPage, this.rootParams);
  }

  openPage(page): void {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, this.rootParams);
  }

  logout(): void {
    this.af.auth.logout();
    this.nav.setRoot(LoginPage);
  }
}
