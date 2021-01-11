import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnhousesPageRoutingModule } from './ownhouses-routing.module';

import { OwnhousesPage } from './ownhouses.page';
import { AddHouseComponent } from './add-house/add-house.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnhousesPageRoutingModule
  ],
  declarations: [OwnhousesPage, AddHouseComponent]
})
export class OwnhousesPageModule {}
