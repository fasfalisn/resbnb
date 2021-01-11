import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Storage } from "@ionic/storage";
import { Rating } from 'src/app/models/rating.model';
import { RatingsService } from 'src/app/services/ratings.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.page.html',
  styleUrls: ['./ratings.page.scss'],
})
export class RatingsPage implements OnInit, OnDestroy {
  
  private ratingsSub: Subscription;
  
  ratings: Rating[] = [];

  constructor(
    private storage: Storage,
    private ratingsService: RatingsService,
    ) { }

  ngOnInit() {
    this.storage.get("userid").then((userid) => {
      this.ratingsSub = this.ratingsService
        .getRatingsByUser(userid)
        .subscribe((ratings) => {
          this.ratings = ratings;
          console.log(ratings);
        });
    });
  }

  ngOnDestroy() {
    if (this.ratingsSub) {
      this.ratingsSub.unsubscribe();
    }
  }

}
