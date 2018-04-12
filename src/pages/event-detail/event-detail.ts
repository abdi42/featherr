import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventsProvider } from "../../providers/events/events";
/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  event: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.event = {}
  }

  ionViewDidEnter() {
    this.event = this.navParams.data
    console.log(this.event)
    console.log('ionViewDidLoad EventDetailPage');
  }

}
