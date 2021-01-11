import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'houses',
        loadChildren: () => import('./houses/houses.module').then( m => m.HousesPageModule)
      },
      {
        path: 'reservations',
        loadChildren: () => import('./reservations/reservations.module').then( m => m.ReservationsPageModule)
      },
      {
        path: 'properties',
        loadChildren: () => import('./ownhouses/ownhouses.module').then( m => m.OwnhousesPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/houses',
    pathMatch: 'full'
  },
  {
    path: 'ownhouses',
    loadChildren: () => import('./ownhouses/ownhouses.module').then( m => m.OwnhousesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
