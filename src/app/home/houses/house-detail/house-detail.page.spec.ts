import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouseDetailPage } from './house-detail.page';

describe('HouseDetailPage', () => {
  let component: HouseDetailPage;
  let fixture: ComponentFixture<HouseDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
