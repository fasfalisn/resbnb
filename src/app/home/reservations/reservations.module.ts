import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationsPageRoutingModule } from './reservations-routing.module';

import { ReservationsPage } from './reservations.page';
import { UpdateBookingComponent } from './update-booking/update-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationsPageRoutingModule
  ],
  declarations: [ReservationsPage, UpdateBookingComponent]
})
export class ReservationsPageModule {}
