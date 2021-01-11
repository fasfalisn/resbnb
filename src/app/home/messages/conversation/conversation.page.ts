import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {

  @ViewChild('content') content: IonContent;

  msgList: any;
  externalUser: any;
  internalUser: any;
  inpText: any;
  loading: boolean;
  interval: any;


  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) {}

  ngOnInit() {
    this.msgList = [];
    this.loading = true;
    if (this.router.getCurrentNavigation().extras.state) {
      this.externalUser = this.router.getCurrentNavigation().extras.state.externalUser;
      this.internalUser = this.router.getCurrentNavigation().extras.state.internalUser;
    }
    
    if (this.externalUser == undefined && this.internalUser == undefined) {
      this.externalUser = {
        name: 'Username',
        id: 2
      };
      this.internalUser = {
        id: 6,
        token: 'token'
      };
    }

    this.getMessages();
    
  }

  ionViewDidEnter() {
    this.interval = setInterval(() => {
      this.getMessages();
      console.log("Conversation: interval\n\n");
    }, 3000);
  }

  ionViewWillLeave() {
    clearInterval(this.interval);
  }

  getMessages() {
    this.httpClient.get('https://node-resbnb.herokuapp.com/api/user-messages/user/' + this.internalUser.id + '/' + this.externalUser.id).subscribe((messages: any) => {
      if (this.msgList.length == 0) {
       this.msgList = messages;
       this.scrollToBottom();
      } else {
        if (this.msgList[this.msgList.length - 1].Date != messages[messages.length - 1].Date) {
         this.msgList = messages;
         this.scrollToBottom();
        }
      }
    }, (error) => {
      if (error.statusText == 'Not Found') {
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (this.inpText) {
      let currentDate = new Date().toISOString();
      let newMessagePost = {
        "from_userid": this.internalUser.id,
        "to_userid": this.externalUser.id,
        "text": this.inpText,
        "date": currentDate
      };
            
      this.httpClient.post('https://node-resbnb.herokuapp.com/api/user-messages/', newMessagePost).subscribe((response) => {        
      }, (error) => {
        if (error.statusText == 'Created') {
          let newMessage = {
            "From_UserID": this.internalUser.id,
            "To_UserID": this.externalUser.id,
            "Text": this.inpText,
            "Date": currentDate
          }
          this.msgList.push(newMessage);
          this.inpText = '';

          this.scrollToBottom();
        }
      })
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(100).then(() => {
      this.loading = false;
    });
  }
}
