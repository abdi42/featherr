import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import 'rxjs/add/operator/take';
/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupsProvider {

  currentGroup: any;

  constructor(public http: HttpClient,private db: AngularFireDatabase,private chatService: ChatService) {
    console.log('Hello GroupsProvider Provider');
    this.currentGroup = null;
  }

  addToGroup(username: string, uid: string,groupsList:any[]): Promise<string> {
    return new Promise(resolve => {
      const groupSub = this.db.object('/groups').valueChanges().take(1).subscribe(groups => {

        let newMsg: ChatMessage = {
          messageId: Date.now().toString(),
          userId: "zjqpx71PksfsVbYJB4J6Eqh3WZT2",
          userName: "Featherr",
          userAvatar: "",
          time: Date.now(),
          message: username + " joined the group!",
          status: 'pending'
        };

        var groupCount = groupsList.length + 1
        if(!groups){
          this.db.list('/groups').push({
            count:1,
            groupName:'Group ' + groupCount,
            users: [{
              username:username,
              uid:uid
            }],
          }).then((group) => {
            console.log("FIRST")
            this.addUser(uid,group.key,groupsList.length)
            this.chatService.sendMsg(newMsg,group.key)
            resolve(group.key)
          });
        }
        else {
          console.log("sddsfsd")

          var foundGroup = false;
          for(var key in groups){
            console.log(this.joinedGroup(groupsList,key),"LIST")
          }
          for (var key in groups) {
            var group = groups[key]
            if(foundGroup) {break}
            if(group.count < 3 && foundGroup == false){
              if(this.joinedGroup(groupsList,key) == false){
                console.log(key,"SDFSDFDSFDSF")
                foundGroup = true
                this.addUser(uid,key,groupsList.length)
                this.chatService.sendMsg(newMsg,key)
                this.db.list('/groups/' + key + '/users').push({
                  username:username,
                  uid:uid
                }).then((user) => {
                  this.db.object('groups/' + key).update({count:group.count + 1})
                  //console.log(key,"HSDSDSD","SECOND")
                  resolve(key)
                })
              }
            }
          }

          if(foundGroup === false){
            this.db.list('/groups').push({
              count:1,
              groupName:'Group ' + groupCount,
              users: [{
                username:username,
                uid:uid,
              }]
            }).then((group) => {
              console.log("THIRD")
              this.addUser(uid,group.key,groupsList.length)
              this.chatService.sendMsg(newMsg,group.key)
              resolve(group.key)
            });
          }
        }
      })
    })
  }

  addUser(uid,groupKey,groupCount){
    console.log(groupCount)
    this.chatService.getUserInfo().then((res) => {
      this.db.object('/userProfile/' + uid).update({groupCount: (res.groupCount + 1)});
      console.log(groupKey)
      this.db.list('/userProfile/' + uid + '/groups').push({
        groupId:groupKey,
        leftGroup:false
      })
    })
  }

  joinedGroup(groupsList,groupKey){
    console.log(groupsList,groupKey,'HELOOOOO')
    for(var i=0;i<groupsList.length;i++){
      var group = groupsList[i]
      if(group.groupId == groupKey){
        return true
      }
    }

    return false
  }

  getGroup(groupId) : Promise<any>{
    console.log(groupId)
    return new Promise((resolve,reject) => {

        this.db.object('/groups/' + groupId).valueChanges().subscribe((res) => {
          if(!res) reject("Could not find record");

          this.currentGroup = res
          this.currentGroup.groupId = groupId
          if(this.currentGroup.messages){
            this.currentGroup.messages = Object.values(this.currentGroup.messages)
          }
          console.log(this.currentGroup)
          return resolve(this.currentGroup)
        })

    })
  }

  leaveGroup(uid,groupKey,groupCount,username,currentGroupCount){
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: "zjqpx71PksfsVbYJB4J6Eqh3WZT2",
      userName: "Featherr",
      userAvatar: "",
      time: Date.now(),
      message: username + " left the group!",
      status: 'pending'
    };    
    
    return new Promise((resolve) => {
      this.db.object('/groups/' + groupKey + '/users').valueChanges().take(1).subscribe((users:any) => {
        console.log(users)
        for (var key in users) {
          var user = users[key]
          console.log(key)
          if(user.uid == uid){
            this.chatService.sendMsg(newMsg,groupKey)
            this.db.object('/groups/' + groupKey + '/users/' + key).remove().then(_ => {
              this.db.object('/groups/' + groupKey).update({count: groupCount-1});
              resolve()
            });
            var object = {}
            object[groupKey] = "NULL";
            console.log(object,'sdsfs');
            this.db.object('/userProfile/' + uid + '/groups/').valueChanges().take(1).subscribe((groups:any) => {
              for(var key in groups) {
                console.log(key,groupKey,groups[key])
                if(groupKey == groups[key].groupId ){
                  var object = {}
                  object[key] = "NULL";
                  this.db.object('/userProfile/' + uid + '/groups/' + key).update({leftGroup:true});
                  this.chatService.getUserInfo()
                  .then((res) => {
                    this.db.object('/userProfile/' + uid).update({groupCount:res.groupCount-1});
                  });
                }
              }
              console.log(groups,"HELLOOO")
            })

          }
        }
      })
    })
  }



}
