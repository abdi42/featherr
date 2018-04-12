import { Component } from '@angular/core';
import { IonicPage,NavController,ModalController,Loading,LoadingController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    private db: AngularFireDatabase,
    private chatService: ChatService,
    public groups: GroupsProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
    });
  }

  ionViewDidEnter() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
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
    this.groups.addToGroup(this.user.name,this.user.uid,this.user.groups).then((groupId) => {
      let modal = this.modalCtrl.create('UsersListPage',{group: groupId});
      modal.present();
    })
  }


}
