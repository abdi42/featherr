import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: Observable<any[]>;
  user: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;
  msgListRef;

  constructor(navParams: NavParams,
              private chatService: ChatService,
              private events: Events,private db: AngularFireDatabase) {
    // Get mock user information
  }

  ionViewWillLeave() {
    // unsubscribe
    console.log(this.db.list('/groups').valueChanges())
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
      this.msgListRef = this.db.list('groups/' + this.user.groupId + '/messages');
      this.getMsg();
      this.scrollToBottom();
    });

  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    this.msgList = this.msgListRef.valueChanges();
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = Date.now().toString();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.user.id,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      time: Date.now(),
      message: this.editorMsg,
      status: 'pending'
    };

    //this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg,this.user.groupId)
    this.scrollToBottom()
  }

  /**
   * @name pushNewMsg
   * @param msg
   */

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}
