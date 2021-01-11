import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HousesPage } from './houses.page';

const routes: Routes = [
  {
    path: '',
    component: HousesPage
  },
  {
    path: 'location/:location',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'house/:houseid',
    loadChildren: () => import('./house-detail/house-detail.module').then( m => m.HouseDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HousesPageRoutingModule {}
