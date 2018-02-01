import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map-browser',
  templateUrl: 'map-browser.html'
})
export class MapBrowserPage {
  lat: number = 37.5;
  lng: number = 15.1;

  constructor(public navCtrl: NavController, public platform: Platform) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {


  }

  ionViewDidLoad() {
    console.log('Hello MapBrowserPage Page');
  }

}
