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
    return new Promise((resolve,reject) => {
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        //this.addToGroup(username,newUser.uid).then((key) => {
          firebase
          .database()
          .ref('/userProfile')
          .child(newUser.uid)
          .set({ email: email , username:username, avatar:image});
          resolve(newUser.uid);
        //});
      },(error) => {
        reject(error);
      });
    })
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

}
