import { Component, OnInit } from "@angular/core";
import { HousesService } from "../../services/houses.service";
import { HouseHasOffers } from "../../models/househasoffers.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-houses",
  templateUrl: "./houses.page.html",
  styleUrls: ["./houses.page.scss"],
})
export class HousesPage implements OnInit {
  houses: HouseHasOffers[] = [];
  private housesSub: Subscription;
  isLoading = false;

  public locations: Array<Object> = [
    { title: "Αθήνα" },
    { title: "Θεσσαλονίκη" },
    { title: "Λάρισα"},
    { title: "Πιερία"}
  ];

  public searchedLocations: any = [];

  constructor(private HousesService: HousesService) {}

  ngOnInit() {
    this.housesSub = this.HousesService.housesWithOffers.subscribe((data) => {
      this.houses = data;
    })
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.HousesService.getAllHousesWithOffers().subscribe(
      (data) => {
        // this.houses = data;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  options = {
    // centeredSlides: true,
    slidesPerView: 1.25,
    // spaceBetween: -60,
  };

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

  ngOnDestroy(){
    if(this.housesSub){
      this.housesSub.unsubscribe();
    }
  }
}
