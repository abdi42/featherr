import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersListPage } from './users-list';
import { ChatService } from "../../providers/chat-service";

@NgModule({
  declarations: [
    UsersListPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersListPage),
  ],
  providers: [
      ChatService,
  ]
})
export class UsersListPageModule {}
