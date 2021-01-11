import { IfStmt } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})


export class ProfilePage implements OnInit, OnDestroy {
  private usersSub: Subscription;

  userid: string;
  email: string;
  user= new User(0,"","");
  token: string;

  constructor(
    private storage: Storage,
    private router: Router,
    private usersService: UsersService,
  ) { }

  async ngOnInit() {
    this.storage.get("userid").then((userid) => {
      this.userid = userid;
    });
    this.storage.get("email").then((email) => {
      this.email = email;
    });
    await this.storage.get('token').then((token) => {
      this.token = token;
    });
    this.usersSub = this.usersService.getUser(this.userid, this.token)
        .subscribe((user) => {
          this.user = user;
        });
  }

  onLogOut() {
    this.storage.clear().then(() => {
      this.router.navigateByUrl('/auth');
    });
  }

  ngOnDestroy() {
    if(this.usersSub){
      this.usersSub.unsubscribe();
    }
  }

}
