import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { ChatService } from "../../providers/chat-service";
import { RelativeTime } from "../../pipes/relative-time";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";
import { TextAvatarDirective } from "../../directives/text-avatar/text-avatar";

@NgModule({
  declarations: [
    Chat,
    RelativeTime,
    TextAvatarDirective
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(Chat),
  ],
  exports: [
    Chat
  ],
  providers: [
    ChatService,
    EmojiProvider
  ]
})
export class ChatModule {
}
