import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


const { StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // this.statusBar.styleDefault();
      StatusBar.hide();
      this.splashScreen.hide();
      await this.autoLogin();
    });
  }

  async autoLogin() {
    this.storage.get('email').then((email) => {
      if (email) {
        this.storage.get('password').then((password) => {
          if (password) {
            let credentials = {
              "email": email,
              "password": password
            }
            this.httpClient.post('https://node-resbnb.herokuapp.com/api/users/login',credentials).subscribe((result: any) => {
              this.storage.set('token', result.token);
              this.storage.set('userid',result.userid);
              this.router.navigateByUrl('/home');
            }, (error) => {
              this.router.navigateByUrl('/auth');
            })
          } else {
            this.router.navigateByUrl('/auth');
          }
        })
      } else {
        this.router.navigateByUrl('/auth');
      }
    })
  }
}
