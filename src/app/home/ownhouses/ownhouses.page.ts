import { Component, OnInit } from '@angular/core';
import { House } from 'src/app/models/house.model';
import { HousesService } from 'src/app/services/houses.service';
import { Storage } from "@ionic/storage";
import { LoadingController, ModalController } from '@ionic/angular';

import { AddHouseComponent } from './add-house/add-house.component';

@Component({
  selector: 'app-ownhouses',
  templateUrl: './ownhouses.page.html',
  styleUrls: ['./ownhouses.page.scss'],
})
export class OwnhousesPage implements OnInit {
  
  houses: House[] = [];
  userid: any;
  isLoading = false;

  constructor(private housesService: HousesService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storage: Storage) { }

  ngOnInit() {
    this.storage.get("userid").then((userid) => {
      this.userid = userid;
    }).then(()=>{
      this.retrieveHouses();
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.storage.get("userid").then((userid) => {
      this.userid = userid;
    }).then(()=>{
      this.housesService.getAllHousesByUserId(this.userid).subscribe(
        (data) => {
          // this.houses = data;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    });
    
  }


  retrieveHouses() {
    this.housesService.housesByLocation.subscribe(
      (data) => {
        this.houses = data;
        console.log(this.houses);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openAddModal() {
    this.modalCtrl
      .create({
        component: AddHouseComponent,
        // componentProps: {
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
              message: "Booking Place...",
            })
            .then(async (loadingEl) => {
              loadingEl.present();
              let data = resultData.data.bookingData;
              const resid = await this.housesService.addHouse(
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
}
