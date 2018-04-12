import { Component } from '@angular/core';
import { IonicPage,NavController,Loading,LoadingController} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ChatService, UserInfo } from "../../providers/chat-service";

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  loading: Loading;
  user: UserInfo;

  constructor(public navCtrl: NavController,public authProvider: AuthProvider,private chatService: ChatService,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
    });
  }

  logOut(){

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.loading.dismiss().then( () => {
      this.authProvider.logoutUser()
    });

  }

  resetPassword(){
    this.navCtrl.push('reset-password');
  }
}
