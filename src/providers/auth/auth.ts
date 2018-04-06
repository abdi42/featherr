import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(private db: AngularFireDatabase) {
    console.log('Hello AuthProvider Provider');
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string,username: string,image:String): Promise<any> {
    console.log(username,email)
    return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then( newUser => {
      this.addToGroup(username,newUser.uid).then((key) => {
        firebase
        .database()
        .ref('/userProfile')
        .child(newUser.uid)
        .set({ email: email , username:username, groupId: key, avatar:image});
      });
    });
  }

  addToGroup(username: string, uid: string): Promise<string> {
    return new Promise(resolve => {
      const groupSub = this.db.object('/groups').valueChanges().subscribe(groups => {
        if(!groups){
          groupSub.unsubscribe()
          this.db.list('/groups').push({
            groupName:'Group 1',
            users: [{
              username:username,
              uid:uid
            }],
            count:1
          }).then((group) => {
            resolve(group.key)
          });
        }
        else {
          console.log("sddsfsd")

          var foundGroup = false;

          for (var key in groups) {
            var group = groups[key]
            if(foundGroup) {break}
            if(group.count < 3 && foundGroup == false){
              foundGroup = true
              groupSub.unsubscribe()
              this.db.list('/groups/' + key + '/users').push({
                username:username,
                uid:uid
              }).then((user) => {
                this.db.object('groups/' + key).update({count:group.count + 1})
                resolve(key)
              })
            }
          }

          if(foundGroup === false){
            groupSub.unsubscribe()
            this.db.list('/groups').push({
              groupName:'Group 1',
              users: [{
                username:username,
                uid:uid,
                count:1
              }]
            }).then((group) => {
              resolve(group.key)
            });
          }

        }
      })
    })
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

}
