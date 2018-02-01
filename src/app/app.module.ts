import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AgmCoreModule } from 'angular2-google-maps/core';

/* PAGES */
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DashboardTechnicianPage } from '../pages/dashboard-technician/dashboard-technician';
import { DashboardTechnicianTab1 } from '../pages/dashboard-technician/tab1/tab1';
import { TaskEditorPage } from '../pages/task-editor/task-editor';
import { TaskViewerPage } from '../pages/task-viewer/task-viewer';
import { TaskNotifyPage } from '../pages/task-notify/task-notify';
import { MapPage } from '../pages/map/map';
import { MapBrowserPage } from '../pages/map/map-browser';

import { TaskList } from '../components/task-list/task-list';
import { TabTasksComponent } from '../components/tab-tasks/tab-tasks';

/* SERVICES */
import { ArrayUtils } from '../providers/array.utils';
import { ConstantService } from '../providers/constant.service';
import { UserTaskService } from '../providers/usertask.service';

// FIREBASE CONFIG
export const firebaseConfig = {
  apiKey: 'xxx',
  authDomain: 'xxx.firebaseapp.com',
  databaseURL: 'https://xxx.firebaseio.com',
  storageBucket: 'xxx.appspot.com',
  messagingSenderId: 'xxx',
  serverKey: 'xxx'
};

// FIREBASE AUTH CONFIG
const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

// CloudModule CONFIG
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'a650f387'
  },
  'push': {
    'sender_id': '727927067070',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    DashboardPage,
    DashboardTechnicianPage,
    DashboardTechnicianTab1,
    DashboardPage,
    DashboardPage,
    DashboardPage,
    MapPage,
    MapBrowserPage,
    TaskEditorPage,
    TaskViewerPage,
    TaskNotifyPage,
    TaskList,
    TabTasksComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'xxx'
    }),
    IonicModule.forRoot(MyApp, {
      menuType: 'push'
    }),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    DashboardPage,
    DashboardTechnicianPage,
    DashboardTechnicianTab1,
    MapPage,
    MapBrowserPage,
    TaskEditorPage,
    TaskViewerPage,
    TaskNotifyPage,
    TaskList,
    TabTasksComponent
  ],
  providers: [
    ArrayUtils, ConstantService, UserTaskService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
