import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map, take } from "rxjs/operators";

import { Rating } from "../models/rating.model";


const ratingsUrl = "https://node-resbnb.herokuapp.com/api/user-rates-house/";

@Injectable({
  providedIn: 'root'
})
export class RatingsService {

  private _ratings = new BehaviorSubject<Rating[]>([]);

  constructor(private http: HttpClient) { }

  get ratings(){
    return this._ratings.asObservable();
  }

  getRatingsByHouse(houseid: string) {
    return this.http.get(ratingsUrl + "house/" + houseid).pipe(
      map((resData) => {
        const ratings = [];
        for (const houseid in resData) {
          ratings.push(
            new Rating(
              resData[houseid].UserID,
              resData[houseid].HouseID,
              resData[houseid].Description,
              resData[houseid].Rating,
              resData[houseid].Date
            )
          );
        }
        return ratings;
      }),
      tap((ratings) => {
        this._ratings.next(ratings);
      })
    );
  }

  getRatingsByUser(userid: string) {
    return this.http.get(ratingsUrl + "user/" + userid).pipe(
      map((resData) => {
        const ratings = [];
        for (const userid in resData) {
          ratings.push(
            new Rating(
              resData[userid].UserID,
              resData[userid].HouseID,
              resData[userid].Description,
              resData[userid].Rating,
              resData[userid].Date
            )
          );
        }
        return ratings;
      }),
      tap((ratings) => {
        this._ratings.next(ratings);
      })
    );
  }
}
