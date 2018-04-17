import { Component } from '@angular/core';
import { IonicPage,NavController,ModalController,Loading,LoadingController,AlertController } from 'ionic-angular';
import { ChatService, UserInfo } from "../../providers/chat-service";
import { AngularFireDatabase } from 'angularfire2/database';
import { GroupsProvider } from '../../providers/groups/groups';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: UserInfo;
  groupsList: any[] = [];
  loading: Loading;
  buttonClicked: any = false;
  
  constructor(
    public navCtrl: NavController,
    private db: AngularFireDatabase,
    private chatService: ChatService,
    public groups: GroupsProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
    });
    this.buttonClicked = false;
  }

  ionViewDidEnter() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
      this.getGroups();
    });
  }

  getGroups(){
    this.groupsList = []
    if(this.user.groups){
      for(var i=0;i<this.user.groups.length;i++){
        var currentGroup = this.user.groups[i]
        if(currentGroup.leftGroup == false){
          this.groups.getGroup(currentGroup.groupId).then((group) => {
            console.log(group.groupId,'eweeeeee')
            this.groupsList.push(group)
          })
        }
      }
    }
  }

  goToChat(group){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange:true
    });

    this.loading.dismiss().then( () => {
      this.navCtrl.push('Chat',group)
    });

    this.loading.present();
  }

  joinGroup(){
    this.buttonClicked = true
    if(this.user.groupCount < 3 || this.user.groupCount == 3){
      this.groups.addToGroup(this.user.name,this.user.uid,this.user.groups).then((groupId) => {
        let modal = this.modalCtrl.create('UsersListPage',{group: groupId});
        modal.present();
      })
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'I\'m sorry but you can join only 3 groups at a time. If you want to join another group. Head over to one of the group chats and click leave.',        buttons: ['Dismiss']
      });
      
      alert.present();
    }
  }


}
