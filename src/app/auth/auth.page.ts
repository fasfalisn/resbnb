import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;
  showPassword = false;
  passwordIcon = 'eye-outline';
  authForm: NgForm;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private loadingCtrl: LoadingController,
    private httpClinet: HttpClient,
    private storage: Storage,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    
  }

  onSubmit(authForm: NgForm) {
    this.authForm = authForm;
    if (authForm.invalid) {
       return;
    }
    const email = authForm.value.email;
    const password = authForm.value.password;
    
    if (this.isLogin) {
      this.onLogin(email, password);
    } else {
      const username = authForm.value.username;
      const confirmPassword = authForm.value.confirmPassword;
      if (password != confirmPassword) {
        this.presentToast('Passwords don\'t match! Try again.');
      } else {
        this.onSignUp(username, email, password);
      }
    }
  }

  onLogin(email:string, password:string) {
    this.loadingCtrl
      .create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingEl => {
        loadingEl.present();
        let credentials = {
          "email": email,
          "password": password
        }
        this.httpClinet.post('https://node-resbnb.herokuapp.com/api/users/login', credentials).subscribe(async (response: any) => {
          await this.storage.set('email', email);
          await this.storage.set('password', password);
          await this.storage.set('token', response.token);
          await this.storage.set('userid',response.userid);
          loadingEl.dismiss();
          this.router.navigateByUrl('/home');
        },(error) => {
          loadingEl.dismiss();
          this.presentToast('Incorrect input data! Try again!');
        })
      });
  }

  onSignUp(username: string, email:string, password:string) {
    this.loadingCtrl
      .create({keyboardClose: true, message: 'Signing up...'})
      .then(async loadingEl => {
        loadingEl.present();
        let postData = {
          "name": username,
          "email": email,
          "password": password
        }
        await this.httpClinet.post('https://node-resbnb.herokuapp.com/api/users/',postData).subscribe(async (response: any) => {
          await this.storage.set('name', username);
          await this.storage.set('email', email);
          await this.storage.set('password', password);
          await this.storage.set('token', response.token);
          await this.storage.set('userid',response.userid);
          await this.usersService.addHost(response.userid);
          loadingEl.dismiss();
          this.router.navigateByUrl('/home');
        },(error) => {
          let errorMsg
          if (error.statusText == 'Conflict') {
            errorMsg = 'This email address is already being used!'
          } else {
            errorMsg = 'Something went wrong!'
          }
          loadingEl.dismiss();
          this.presentToast(errorMsg);
        })
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: 'danger'
    });
    toast.present();
  }

  ionViewDidLeave() {
    this.authForm.reset();
  }

  togglePasswordIcon() {
    this.showPassword = !this.showPassword;
    this.passwordIcon = this.showPassword ? 'eye-off-outline' : 'eye-outline';
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

}
