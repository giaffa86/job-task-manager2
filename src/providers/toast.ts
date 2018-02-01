import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the Toast provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Toast {

  constructor(public toastCtrl: ToastController) { }

  showToast(position: string, message: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present(toast);
  }

  showToastWithCloseButton(message: string, closeButtonText: string) {
    const toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      position: 'top',
      closeButtonText: closeButtonText
    });
    toast.present();
  }



}
