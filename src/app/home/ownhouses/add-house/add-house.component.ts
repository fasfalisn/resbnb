import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.scss'],
})
export class AddHouseComponent implements OnInit {
  @ViewChild("f", { static: true }) form: NgForm;

  constructor(
    private modalCtrl: ModalController,) { }

  ngOnInit() {}

  onCancel() {
    // obj.push({id: 1, square:2});
    // var json = JSON.stringify(obj);
    this.modalCtrl.dismiss(null, "cancel");
  }

  onAddHouse() {
    // if(!this.form.valid ){
    //    return;
    // }
    // console.log( new Date(this.form.value['date']).toISOString);
    this.modalCtrl.dismiss(
      {
        bookingData: {
          description: this.form.value["description"],
          name: this.form.value['name'],
          type: this.form.value['type'],
          street: this.form.value['street'],
          zip: this.form.value['zip'],
          city: this.form.value['city']
        }
      },
      "confirm"
    );
  }

}
