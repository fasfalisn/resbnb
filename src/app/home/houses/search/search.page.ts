import { IfStmt } from "@angular/compiler";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { House } from "src/app/models/house.model";

import { HousesService } from "../../../services/houses.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit, OnDestroy {

  public locations: Array<Object> = [
    { title: "Αθήνα" },
    { title: "Θεσσαλονίκη" },
    { title: "Λάρισα"},
    { title: "Πιερία"}
  ];
  
  public searchedLocations: any = [];

  private housesSub: Subscription;
  houses: House[] =  [];
  location: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private housesService: HousesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("location")) {
        this.navCtrl.navigateBack("/home/houses");
        return;
      }
      this.location = paramMap.get("location");
      this.housesSub = this.housesService
      .getHousesByLocation(paramMap.get("location"))
        .subscribe((houses) => {
        this.houses = houses;
        console.log(houses);
      });
    });
  }

  ionChange(event) {
    const val = event.target.value;
    this.searchedLocations = this.locations;
    if (val && val.trim() !=''){
      this.searchedLocations = this.searchedLocations.filter((location:any) => {
        return (location.title.toLowerCase().indexOf(val.toLowerCase())>-1);
      })
    }
    if(!val){
      this.searchedLocations = [];
    }
    // console.log(this.searchedLocations);
  }

  ngOnDestroy() {
    if(this.housesSub){
      this.housesSub.unsubscribe();
    }
  }
}
