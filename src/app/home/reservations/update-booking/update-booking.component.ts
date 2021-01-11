import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Item } from "src/app/models/item.model";
import { Order } from "src/app/models/order.model";
import { Reservation } from "src/app/models/reservation.model";

interface PlaceData {
  itemid: number;
  itemName: string;
  quantity: number;
}

@Component({
  selector: "app-update-booking",
  templateUrl: "./update-booking.component.html",
  styleUrls: ["./update-booking.component.scss"],
})
export class UpdateBookingComponent implements OnInit {
  @Input() selectedReservation: Reservation;
  @Input() items: Item[];
  @Input() orders: Order[];
  // @ViewChild("form", { static: true }) form: NgForm;

  thisDate = new Date();
  isLoading = false;
  public itemsOrders: PlaceData[] = [];

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    this.isLoading = true;
    await this.getItems();
    this.isLoading = false;

  }

  getItems() {
    for (let item of this.items) {
      for (let order of this.orders) {
        if (item.itemid === order.itemid) {
          this.itemsOrders.push({
            itemid: item.itemid,
            itemName: item.name,
            quantity: order.quantity,
          });
        }
      }
    }
  }

  onCancel() {
    // obj.push({id: 1, square:2});
    // var json = JSON.stringify(obj);
    this.modalCtrl.dismiss(null, "cancel");
  }

  onUpdatePlace(form: NgForm) {
    // if(!this.form.valid ){
    //    return;
    // }
    var order = {};

    for (let item of this.itemsOrders) {
      var newItem = item.itemid;
      var newValue = form.value[item.itemid];
      console.log(item.itemid);
      order[newItem] = newValue;
    }
    // console.log( new Date(this.form.value['date']).toISOString);
    this.modalCtrl.dismiss(
      {
        bookingData: {
          guests: form.value["guests"],
          date: new Date(form.value["date"])
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        },
        order,
      },
      "confirm"
    );
  }
}
