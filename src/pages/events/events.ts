import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import * as FeedMe from "feedme";
import { EventsProvider } from "../../providers/events/events";
/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  events: any;
  eventLink : {eventId: string};

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: HttpClient,private eventService: EventsProvider) {
  }

  ionViewDidEnter() {
    this.eventService.load('https://api.orgsync.com/api/v3/communities/618/events.rss?key=vl9LjMx-9vawh8DStQ7HYZ5iJ8kAwlBKP-nXS9Spvsk&per_page=100&upcoming=true').then(rss => {
      this.events = rss.items 
    });
  }

}
