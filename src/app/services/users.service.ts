import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { User } from '../models/user.model';
import { map, tap } from 'rxjs/operators';


const usersUrl = "https://node-resbnb.herokuapp.com/api/users/";
const hostsUrl = "https://node-resbnb.herokuapp.com/api/hosts/";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _user = new BehaviorSubject(new User(0, "", ""));


  constructor(
    private http: HttpClient,
    ) { }

    get user() {
      return this._user.asObservable();
    }

    addHost(hostid: string){
      this.http.post(hostsUrl,{
        hostid: hostid
      }).subscribe((data) => {
        console.log(data);
      });
    }

    getUser(userid: string, token: string) {
      
      return this.http.get(usersUrl + userid, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).pipe(
        map((resData: any) => {
          const user = new User(
            resData.UserID,
            resData.Email,
            resData.Name,
          );
          return user;
        }),
        tap((user) => {
          this._user.next(user);
        })
      );
    }
}
