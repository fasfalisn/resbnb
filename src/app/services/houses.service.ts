import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map, take } from "rxjs/operators";

import { HouseHasOffers } from "../models/househasoffers.model";
import { House } from "src/app/models/house.model";

const offersUrl = "https://node-resbnb.herokuapp.com/api/house-has-offers/";
const housesUrl = "https://node-resbnb.herokuapp.com/api/houses/";

@Injectable({
  providedIn: "root",
})
export class HousesService {
  private _housesWithOffers = new BehaviorSubject<HouseHasOffers[]>([]);
  private _housesByLocation = new BehaviorSubject<House[]>([]);
  private _house = new BehaviorSubject(new House(0, "", "", "", "", 0, "", 0));

  constructor(private http: HttpClient) {}

  get house() {
    return this._house.asObservable();
  }

  get housesWithOffers() {
    return this._housesWithOffers.asObservable();
  }

  get housesByLocation() {
    return this._housesByLocation.asObservable();
  }

  getAllHousesWithOffers() {
    return this.http.get(offersUrl).pipe(
      map((resData) => {
        const houses = [];
        for (const houseid in resData) {
          houses.push(
            new HouseHasOffers(
              resData[houseid].HouseID,
              resData[houseid].Name,
              resData[houseid].Type
            )
          );
        }
        return houses;
      }),
      tap((houses) => {
        this._housesWithOffers.next(houses);
      })
    );
  }

  getAllHousesByUserId(userid: string) {
    return this.http.get(housesUrl + "host/" + userid).pipe(
      map((resData) => {
        const houses = [];
        for (const houseid in resData) {
          houses.push(
            new House(
              resData[houseid].HouseID,
              resData[houseid].Description,
              resData[houseid].Name,
              resData[houseid].Type,
              resData[houseid].Street,
              resData[houseid].Zip,
              resData[houseid].City,
              resData[houseid].HostID
            )
          );
        }
        return houses;
      }),
      tap((houses) => {
        this._housesByLocation.next(houses);
      })
    );
  }

  getHousesByLocation(location: string) {
    return this.http.get(housesUrl + "city/" + location).pipe(
      map((resData) => {
        const houses = [];
        for (const houseid in resData) {
          houses.push(
            new House(
              resData[houseid].HouseID,
              resData[houseid].Description,
              resData[houseid].Name,
              resData[houseid].Type,
              resData[houseid].Street,
              resData[houseid].Zip,
              resData[houseid].City,
              resData[houseid].HostID
            )
          );
        }
        return houses;
      }),
      tap((houses) => {
        this._housesByLocation.next(houses);
      })
    );
  }

  getHouse(houseid: string) {
    return this.http.get(housesUrl + houseid).pipe(
      map((resData: any) => {
        const house = new House(
          resData.HouseID,
          resData.Description,
          resData.Name,
          resData.Type,
          resData.Street,
          resData.Zip,
          resData.City,
          resData.HostID
        );
        return house;
      }),
      tap((houses) => {
        this._house.next(houses);
      })
    );
  }

  async addHouse(
    description: string,
    name: string,
    type: string,
    street: string,
    zip: number,
    city: string,
    hostid: number
  ) {
    this.http
      .post(housesUrl, {
        description: description,
        name: name,
        type: type,
        street: street,
        zip: zip,
        city: city,
        hostid: hostid,
      })
      .subscribe((responseData: any) => {
        console.log(responseData);
      });
  }

  updateHouse(
    houseid: string,
    description: string,
    name: string,
    type: string,
    street: string,
    zip: number,
    city: string,
    hostid: number
  ) {
    this.http
      .put(housesUrl+houseid, {
        description: description,
        name: name,
        type: type,
        street: street,
        zip: zip,
        city: city,
        hostid: hostid,
      })
      .subscribe((responseData: any) => {
        console.log(responseData);
      });
  }
}
