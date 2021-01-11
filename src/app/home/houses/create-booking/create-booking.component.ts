import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { House } from "../../../models/house.model";
import { ModalController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Reservation } from "src/app/models/reservation.model";
import { ItemsService } from "src/app/services/items.service";
import { Item } from "src/app/models/item.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: House;
  @Input() selectedReservation: Reservation;
  @Input() selectedMode: "book" | "update";
  @Input() houseid: string;
  @ViewChild("f", { static: true }) form: NgForm;
  thisDate = new Date();

  private itemsSub: Subscription;
  items: Item[] = [];

  constructor(
    private modalCtrl: ModalController,
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.itemsSub = this.itemsService
      .getItemsByHouse(this.houseid)
      .subscribe((items) => {
        this.items = items;
      });
  }

  onCancel() {
    // obj.push({id: 1, square:2});
    // var json = JSON.stringify(obj);
    this.modalCtrl.dismiss(null, "cancel");
  }

  onBookPlace() {
    // if(!this.form.valid ){
    //    return;
    // }
    var order = {};

    for(let item of this.items){
      var newItem = item.itemid;
      var newValue = this.form.value[item.itemid];
      order[newItem] = newValue ;
  }
    // console.log( new Date(this.form.value['date']).toISOString);
    this.modalCtrl.dismiss(
      {
        bookingData: {
          guests: this.form.value["guests"],
          date: new Date(this.form.value["date"])
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        },
        order
      },
      "confirm"
    );
  }

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }
}
