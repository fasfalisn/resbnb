import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Order } from "../models/order.model";

const ordersUrl = "https://node-resbnb.herokuapp.com/api/orders/";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private _orders = new BehaviorSubject<Order[]>([]);

  constructor(private http: HttpClient) {}

  get orders() {
    return this._orders.asObservable();
  }

  getOrder(resid: string) {
    return this.http.get(ordersUrl + resid).pipe(
      map((resData: any) => {
        const orders = [];
        for (const resid in resData) {
          orders.push(new Order(
            resData[resid].ResID,
            resData[resid].ItemID,
            resData[resid].Quantity));
        }
        return orders
      }),tap((orders) => {
        this._orders.next(orders);
      })
    );
  }

  addOrder(resid: number, itemid: number, quantity: number) {
    this.http
      .post(ordersUrl, {
        resid: resid,
        itemid: itemid,
        quantity: quantity,
      })
      .subscribe((responseData: any) => {
        console.log(responseData);
      });
  }

  updateOrder(resid: number, itemid: number, quan: number) {
    this.http
      .put(ordersUrl + "res/" + resid + "/item/" + itemid, {
        quantity: quan,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
