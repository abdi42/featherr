import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailPage } from './event-detail';
import { ChatService } from "../../providers/chat-service";

@NgModule({
  declarations: [
    EventDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailPage),
  ],
  providers: [
    ChatService,
  ]
})
export class EventDetailPageModule {}
