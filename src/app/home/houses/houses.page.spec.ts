import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HousesPage } from './houses.page';

describe('HousesPage', () => {
  let component: HousesPage;
  let fixture: ComponentFixture<HousesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HousesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
