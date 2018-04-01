/**
 * Created by hsuanlee on 2017/4/4.
 */
import { NgModule} from '@angular/core';
import { HomePage} from './home';
import { IonicPageModule } from 'ionic-angular';
import { ChatService } from "../../providers/chat-service";

@NgModule({
    declarations: [HomePage],
    imports: [
        IonicPageModule.forChild(HomePage),

    ],
    providers: [
        ChatService,
    ]
})
export class HomePageModule { }