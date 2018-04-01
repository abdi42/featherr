import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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
  
  constructor(private db: AngularFireDatabase,private chatService: ChatService) {
    this.toUser = {
      toUserId:'210000198410281948',
      toUserName:'Hancock'
    }
  }
  
  ionViewDidEnter() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
      console.log(res)
      this.user = res
      
      this.db.object('groups/' + res.groupId).valueChanges().subscribe((res) => {
        console.log(res)
        this.group = res
        this.group.messages = Object.values(this.group.messages)
      })

    });
  }



}
