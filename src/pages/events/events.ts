import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import * as FeedMe from "feedme";
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: HttpClient) {
  }

  ionViewDidEnter() {
    this.http.get('https://api.orgsync.com/api/v3/communities/618/events.rss',{
      params: {
        key:'vl9LjMx-9vawh8DStQ7HYZ5iJ8kAwlBKP-nXS9Spvsk',
        per_page:100,
        upcoming:true
      }
    }).subscribe(res => {
      if (res.statusCode != 200) {
        console.error(new Error(`status code ${res.statusCode}`));
        return;
      }
      var parser = new FeedMe();
      parser.on('item', (item) => {
        console.log();
        console.log('item:', item);
        console.log(item['event:startdate']);
      });
      res.pipe(parser);
    });
  }

}
