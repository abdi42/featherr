import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatService, UserInfo } from "../../providers/chat-service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the UsersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-list',
  templateUrl: 'users-list.html',
})
export class UsersListPage {

  users: Observable<any[]>;

  constructor(public navCtrl: NavController,private db: AngularFireDatabase,public navParams: NavParams,private chatService: ChatService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersListPage');
  }

  ionViewDidEnter() {
    this.chatService.getUserInfo()
    .then((res) => {
      this.users = this.db.list('groups/' + res.groupId + '/users').valueChanges();
    });
  }

  goToHome(){
    this.navCtrl.setRoot('TabsPage')
  }

}
