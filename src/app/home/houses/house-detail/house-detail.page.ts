import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";


import { Storage } from "@ionic/storage";

import { House } from "src/app/models/house.model";
import { Rating } from "src/app/models/rating.model";
import { Item } from "src/app/models/item.model";

import { HousesService } from "../../../services/houses.service";
import { RatingsService } from "../../../services/ratings.service";
import { ItemsService } from "../../../services/items.service";

import { CreateBookingComponent } from "../create-booking/create-booking.component";
import { ReservationsService } from "src/app/services/reservations.service";
import { OrdersService } from "src/app/services/orders.service";
import { UpdateHouseComponent } from "../update-house/update-house.component";
import { AddItemComponent } from "../add-item/add-item.component"; 

@Component({
  selector: "app-house-detail",
  templateUrl: "./house-detail.page.html",
  styleUrls: ["./house-detail.page.scss"],
})
export class HouseDetailPage implements OnInit, OnDestroy {
  private housesSub: Subscription;
  private ratingsSub: Subscription;
  private itemsSub: Subscription;

  house = new House(0, "", "", "", "", 0, "", 0);
  ratings: Rating[] = [];
  items: Item[] = [];
  houseid: string;
  userid: any;
  isHost: boolean;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private housesService: HousesService,
    private reservationsService: ReservationsService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private ratingsService: RatingsService,
    private loadingCtrl: LoadingController,
    private itemsService: ItemsService,
    private ordersService: OrdersService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.storage.get("userid").then((userid) => {
      this.userid = userid;
    });
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("houseid")) {
        this.navCtrl.back();
        return;
      }
      this.houseid = paramMap.get("houseid");
      this.housesSub = this.housesService
        .getHouse(paramMap.get("houseid"))
        .subscribe((houses) => {
          this.house = houses;
          this.isHost = this.house.hostid === this.userid;
          console.log(houses);
        });
      this.ratingsSub = this.ratingsService
        .getRatingsByHouse(paramMap.get("houseid"))
        .subscribe((ratings) => {
          this.ratings = ratings;
          console.log(ratings);
        });
      this.itemsSub = this.itemsService
        .getItemsByHouse(paramMap.get("houseid"))
        .subscribe((items) => {
          this.items = items;
          console.log(items);
        });
        
    });
  }

  openBookingModal() {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.house,
          selectedReservation: null,
          selectedMode: "book",
          houseid: this.houseid
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData)
        if (resultData.role === "confirm") {
          this.loadingCtrl
            .create({
              message: "Booking Place...",
            })
            .then(async (loadingEl) => {
              loadingEl.present();
              let data = resultData.data.bookingData;
              const resid = await this.reservationsService.addReservation(
                this.userid,
                this.house.houseid,
                "Pending",
                "Valid",
                data.guests,
                50,
                data.date
              );
              data = resultData.data.order;
              for(let item of this.items){
                const id = item.itemid;
                this.ordersService.addOrder(
                  resid,
                  id,
                  data[id]
                )
              }
              loadingEl.dismiss();
            });
        }
      });
  }

  openUpdateModal() {
    this.modalCtrl
      .create({
        component: UpdateHouseComponent,
        componentProps: {
          house: this.house
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData)
        if (resultData.role === "confirm") {
          this.loadingCtrl
            .create({
              message: "Booking Place...",
            })
            .then(async (loadingEl) => {
              loadingEl.present();
              let data = resultData.data.bookingData;
              const resid = await this.housesService.updateHouse(
                this.houseid,
                data.description,
                data.name,
                data.type,
                data.street,
                data.zip,
                data.city,
                this.userid
              );
              // data = resultData.data.order;
              // for(let item of this.items){
              //   const id = item.itemid;
              //   this.ordersService.addOrder(
              //     resid,
              //     id,
              //     data[id]
              //   )
              // }
              loadingEl.dismiss();
            });
        }
      });
  }

  goToConversation() {
    let hostId;
    this.httpClient.get('https://node-resbnb.herokuapp.com/api/houses/' + this.houseid).subscribe(async (res: any) => {
        console.log(res);
        hostId = res.HostID;

        this.storage.get('token').then((token) => {
          this.httpClient.get('https://node-resbnb.herokuapp.com/api/users/' + hostId,{
            headers: {
              Authorization: 'Bearer ' + token
            }
          }).subscribe((res2: any) => {
            let navigationExtras: NavigationExtras = { 
              state: { 
                externalUser: { 
                  name: res2.Name, 
                  id: hostId
                }, 
                internalUser: {
                  id: this.userid,
                  token: 'token'
                }
              }
            };
            console.log(navigationExtras)
            this.router.navigate(['home/tabs/messages/conversation'], navigationExtras);
          })
        })
    });
  }

  addItems(){
    this.modalCtrl
      .create({
        component: AddItemComponent,
        // componentProps: {
        //   houseid: this.house.houseid,
        //   userid: this.userid
        // },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData)
        if (resultData.role === "confirm") {
          this.loadingCtrl
            .create({
              message: "Adding Item...",
            })
            .then(async (loadingEl) => {
              loadingEl.present();
              let data = resultData.data.bookingData;
              const resid = await this.itemsService.addItem(
                data.type,
                data.description,
                data.name,
                data.price,
                this.houseid
              );
              // data = resultData.data.order;
              // for(let item of this.items){
              //   const id = item.itemid;
              //   this.ordersService.addOrder(
              //     resid,
              //     id,
              //     data[id]
              //   )
              // }
              loadingEl.dismiss();
            });
        }
      });
  }

  goBack(){
    this.navCtrl.back();
  }

  ngOnDestroy() {
    if (this.housesSub) {
      this.housesSub.unsubscribe();
    }

    if (this.ratingsSub) {
      this.ratingsSub.unsubscribe();
    }
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

  
}
