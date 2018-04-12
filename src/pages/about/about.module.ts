/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { ChatService } from "../../providers/chat-service";

@NgModule({
    declarations: [
        AboutPage,
    ],
    imports: [
        IonicPageModule.forChild(AboutPage),
    ],
    providers: [
      ChatService
    ],
    exports: [
        AboutPage
    ]
})
export class AboutPageModule {}
