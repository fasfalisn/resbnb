import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  userId: number;
  token: string;
  messages: any;
  loading: boolean;
  interval: any;

  constructor(
    private storage: Storage,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.messages = [];
    //this.testMessages();
  }

  testMessages() {
    let currentDate = new Date().toISOString();
      let newMessage = {
        "from_userid": 11,
        "to_userid": 211,
        "text": 'Λογικά',
        "date": currentDate
      };

      this.httpClient.post('https://node-resbnb.herokuapp.com/api/user-messages/', newMessage).subscribe((response) => {
        console.log(response);
      })
  }

  async ionViewWillEnter() {
    if (this.userId && this.token) {
      this.getMessages();
    } else {
      await this.storage.get('userid').then((userId) => {
        this.userId = userId;
      });
      await this.storage.get('token').then((token) => {
        this.token = token;
      });

      this.getMessages();
    }
  }

  ionViewDidEnter() {
    this.interval = setInterval(() => {
      this.getMessages();
      console.log("Messages: interval\n\n");
    }, 4000);
  }

  ionViewWillLeave() {
    clearInterval(this.interval);
  }

  getMessages() {
    this.httpClient.get('https://node-resbnb.herokuapp.com/api/user-messages/user/' + this.userId, {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    }).subscribe((messages: any) => {
      if (this.messages.length == 0) {
        this.messages = messages;
      } else {
        this.compareAndUpdateMessages(messages);
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
    })
  }

  compareAndUpdateMessages(messages: any) {
    if (this.messages[0].Date != messages[0].Date) {
      this.messages = messages;
    }
  }

  goToConversation(name: string, fromUserId: number, toUserId: number) {
    let navigationExtras: NavigationExtras = { 
      state: { 
        externalUser: { 
          name: name, 
          id: (fromUserId != this.userId ? fromUserId : toUserId)
        }, 
        internalUser: {
          id: (fromUserId == this.userId ? fromUserId : toUserId),
          token: this.token
        }
      }
    };
    this.router.navigate(['home/tabs/messages/conversation'], navigationExtras);
  }

}
