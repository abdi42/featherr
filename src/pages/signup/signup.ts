import { Component } from '@angular/core';
import { IonicPage,
  NavController,
  Loading,
  LoadingController,
  AlertController,
  ModalController,
  ActionSheetController,
  Platform} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { GroupsProvider } from '../../providers/groups/groups';
import { EmailValidator } from '../../validators/emails';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage({
  name: 'signup'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;
  profilePic: string = "";

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public groups: GroupsProvider,
  ) {

    this.signupForm = formBuilder.group({
      username:['',Validators.compose([Validators.required])],
      email: ['',
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {

      this.authProvider.signupUser(this.signupForm.value.email,this.signupForm.value.password,this.signupForm.value.username,this.profilePic)
      .then((uid) => {
        this.groups.addToGroup(this.signupForm.value.username,uid,[]).then((groupId) => {
          this.loading.dismiss().then( () => {
            console.log(groupId)
            let modal = this.modalCtrl.create('UsersListPage',{group: groupId});
            modal.present();
          });
        })
      }, (error) => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });


      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  uploadPicture(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Choose photo from Gallery',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.captureImage(true);
          }
        },
      ]
    });
    actionSheet.present();
  }

  resizeImage(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
  }

  async captureImage(useAlbum: boolean){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? {sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM} : {}
    }

    let MAX_WIDTH = 45;
    let MAX_HEIGHT = 45;
    let ratio = 0;


    const imageData = await this.camera.getPicture(options);
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    var i = new Image();
    var canvas: any = document.createElement("canvas");
    let that = this;

    i.onload = function(){
     console.log( i.width+", "+i.height );
     var width = i.width;
     var height = i.height;

     if (width > height) {
       if (width > MAX_WIDTH) {
         height *= MAX_WIDTH / width;
         width = MAX_WIDTH;
       }
     } else {
       if (height > MAX_HEIGHT) {
         width *= MAX_HEIGHT / height;
         height = MAX_HEIGHT;
       }
     }

     canvas.width = width;
     canvas.height = height;

     var ctx = canvas.getContext("2d");

     ctx.drawImage(i, 0, 0, width, height);

     var dataUrl = canvas.toDataURL('image/jpeg', 1);

     that.profilePic = dataUrl;

    };

    i.src = base64Image;

  }



}
