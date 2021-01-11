import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  
  @ViewChild("f", { static: true }) form: NgForm;

  constructor(private modalCtrl: ModalController,) { }

  ngOnInit() {}

  onCancel() {
    // obj.push({id: 1, square:2});
    // var json = JSON.stringify(obj);
    this.modalCtrl.dismiss(null, "cancel");
  }

  onAddItem() {
    // if(!this.form.valid ){
    //    return;
    // }
    // console.log( new Date(this.form.value['date']).toISOString);
    this.modalCtrl.dismiss(
      {
        bookingData: {
          type: this.form.value['type'],
          description: this.form.value["description"],
          name: this.form.value['name'],
          price: this.form.value['price']
        }
      },
      "confirm"
    );
  }

}
