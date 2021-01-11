import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { Reservation } from 'src/app/models/reservation.model';
import { ItemsService } from 'src/app/services/items.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ReservationsService } from '../../services/reservations.service';
import { UpdateBookingComponent } from './update-booking/update-booking.component';


@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit, OnDestroy {
  private itemsSub: Subscription;
  private ordersSub: Subscription

  reservations: Reservation[] = [];
  userid: any;
  orders: Order[] = [];
  items: Item[] = [];
  reservation: Reservation[] = [];
  isLoading = false;
  
  constructor(
    private storage: Storage,
    private reservationsService: ReservationsService,
    private ordersService: OrdersService,
    private loadingCtrl: LoadingController,
    private itemsService: ItemsService,
    private modalCtrl: ModalController,) { }

  ngOnInit() {
    this.storage.get('userid').then((userid) => {
      this.userid = userid;
    }).then(()=>{
      this.retrieveReservations();
    })
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.storage.get('userid').then((userid) => {
      this.userid = userid;
    }).then(() => {
      this.reservationsService.getReservationsByUserId(this.userid).subscribe(
      (data) => {
        // this.houses = data;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
    })
    
  }

  retrieveReservations() {
    this.reservationsService.reservations.subscribe(
      (data) => {
        this.reservations = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async openBookingModal(resid: number) {
    this.reservation = await this.reservations.filter(res => {
      return res.resid == resid;
    });
    this.itemsSub = await this.itemsService.getItemsByHouse(this.reservation[0].houseid.toString()).subscribe((items)=>{
      console.log(items);
      this.items = items;
    });
    this.ordersSub = await this.ordersService.getOrder(this.reservation[0].resid.toString()).subscribe((data) => {
      console.log(data);
      this.orders = data;
    })
    this.modalCtrl
      .create({
        component: UpdateBookingComponent,
        componentProps: {
          selectedReservation: this.reservation[0],
          items: this.items,
          orders: this.orders
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
              message: "Updating Booking...",
            })
            .then(async (loadingEl) => {
              loadingEl.present();
              let data = resultData.data.bookingData;
              await this.reservationsService.updateReservation(
                resid,
                data.guests,
                data.date
              );
              data = resultData.data.order;
              for(let item of this.items){
                const id = item.itemid;
                this.ordersService.updateOrder(
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

  

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
    if (this.ordersSub) {
      this.ordersSub.unsubscribe();
    }
  }

}
