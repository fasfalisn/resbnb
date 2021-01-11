import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HouseDetailPageRoutingModule } from './house-detail-routing.module';

import { HouseDetailPage } from './house-detail.page';
import { CreateBookingComponent } from '../create-booking/create-booking.component';
import { UpdateHouseComponent } from '../update-house/update-house.component';
import { AddItemComponent } from '../add-item/add-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HouseDetailPageRoutingModule
  ],
  declarations: [HouseDetailPage, CreateBookingComponent, UpdateHouseComponent, AddItemComponent]
})
export class HouseDetailPageModule {}
