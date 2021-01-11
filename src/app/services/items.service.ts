import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map, take } from "rxjs/operators";

import { Item } from "../models/item.model";


const itemsUrl = "https://node-resbnb.herokuapp.com/api/items/";

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private _items = new BehaviorSubject<Item[]>([]);

  constructor(private http: HttpClient) { }

  get ratings(){
    return this._items.asObservable();
  }

  getItemsByHouse(houseid: string) {
    return this.http.get(itemsUrl + "house/" + houseid).pipe(
      map((resData) => {
        const items = [];
        for (const houseid in resData) {
          items.push(
            new Item(
              resData[houseid].ItemID,
              resData[houseid].Type,
              resData[houseid].Description,
              resData[houseid].Name,
              resData[houseid].Price,
              resData[houseid].HouseID
            )
          );
        }
        return items;
      }),
      tap((items) => {
        this._items.next(items);
      })
    );
  }

  async addItem(
    type: string,
    description: string,
    name: string,
    price: number,
    houseid: string
  ) {
    this.http
      .post(itemsUrl, {
        type: type,
        description: description,
        name: name,
        price: price,
        houseid: houseid,
      })
      .subscribe((responseData: any) => {
        console.log(responseData);
      });
  }

}
