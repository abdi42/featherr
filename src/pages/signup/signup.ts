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
import { EmailValidator } from '../../validators/emails';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

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
    private db: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
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
      .then(() => {
        this.loading.dismiss().then( () => {
          let modal = this.modalCtrl.create('UsersListPage');
          modal.present();
        });
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
          text: 'Take photo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.captureImage(false);
          }
        },
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

  async captureImage(useAlbum: boolean){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? {sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM} : {}
    }

    const imageData = await this.camera.getPicture(options);
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    this.profilePic = base64Image;

  }



}
