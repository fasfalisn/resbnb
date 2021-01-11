import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Reservation } from "../models/reservation.model";
import { map, take, tap } from "rxjs/operators";
import { HouseDetailPage } from "../home/houses/house-detail/house-detail.page";

const reservationsUrl = "https://node-resbnb.herokuapp.com/api/reservations/";

@Injectable({
  providedIn: "root",
})
export class ReservationsService {
  private _reservations = new BehaviorSubject<Reservation[]>([]);

  constructor(private http: HttpClient) {}

  get reservations() {
    return this._reservations.asObservable();
  }

  async addReservation(
    userid: number,
    houseid: number,
    paymentstatus: string,
    status: string,
    guests: number,
    bill: number,
    date: string
  ) {
    var resid;
    await this.postOne(
      userid,
      houseid,
      paymentstatus,
      status,
      guests,
      bill,
      date
    ).then((data: any) => {
      resid = data;
    });
    return resid;
  }

  postOne(
    userid: number,
    houseid: number,
    paymentstatus: string,
    status: string,
    guests: number,
    bill: number,
    date: string
  ) {
    return new Promise((resolve) => {
      this.http
        .post(reservationsUrl, {
          userid: userid,
          houseid: houseid,
          paymentstatus: paymentstatus,
          status: status,
          numguests: guests,
          bill: bill,
          date: date,
        })
        .pipe(take(1))
        .subscribe((responseData: any) => {
          resolve(responseData.resid);
        });
    });
  }

  updateReservation(resid: number, guests: number, date: Date) {
    this.http.put(reservationsUrl + resid, { "numguests": guests, "date": date }).subscribe((data) => {
      console.log(data);
    });
  }

  getReservationsByUserId(userid: string) {
    return this.http.get(reservationsUrl + "user/" + userid).pipe(
      map((resData) => {
        const reservations = [];
        for (const resid in resData) {
          reservations.push(
            new Reservation(
              resData[resid].ResID,
              resData[resid].UserID,
              resData[resid].HouseID,
              resData[resid].PaymentStatus,
              resData[resid].Status,
              resData[resid].NumGuests,
              resData[resid].Bill,
              resData[resid].Date,
              resData[resid].Name
            )
          );
        }
        return reservations;
      }),
      tap((reservations) => {
        this._reservations.next(reservations);
      })
    );
  }
}
