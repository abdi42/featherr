import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
  groupId: string
}

@Injectable()
export class ChatService {
  msgListRef;

  constructor(private http: HttpClient,private events: Events,private db: AngularFireDatabase,private afAuth: AngularFireAuth,) {
    this.db = db;
    this.msgListRef = this.db.list('messages');
  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success'
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }

  getMsgList(): Observable<any[]> {
    return this.db.list('messages').valueChanges();
  }

  sendMsg(msg: ChatMessage,groupId: string) {
    return new Promise((resolve,reject) => {
      this.db.list('groups/' + groupId + '/messages').push(msg).then((item) => {
        const itemref = this.db.object('groups/' + groupId + '/messages/' + item.key);
        itemref.update({status:'success'});
        resolve(item);
      });
    })
  }

  getUserInfo(): Promise<UserInfo> {
    return new Promise(resolve => {
      this.afAuth.authState.subscribe(user => {
        console.log(user.uid)
        this.db.object('/userProfile/' + user.uid).valueChanges().subscribe(userProfile => {
          const userInfo: UserInfo = {
            id: user.uid,
            name: userProfile.username,
            avatar: './assets/user.jpg',
            groupId:userProfile.groupId
          };
          resolve(userInfo)
        })
      })
    })


  }

}
