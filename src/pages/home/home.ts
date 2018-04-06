import { Component } from '@angular/core';
import { IonicPage,NavController, } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: UserInfo;
  group;

  constructor(public navCtrl: NavController,private db: AngularFireDatabase,private chatService: ChatService) {

  }

  ionViewDidEnter() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res

      this.db.object('groups/' + res.groupId).valueChanges().subscribe((res) => {
        console.log(res)
        this.group = res
        if(this.group.messages){
          this.group.messages = Object.values(this.group.messages)
        }
      })

    });
  }



}
