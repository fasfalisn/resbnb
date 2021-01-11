import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnhousesPage } from './ownhouses.page';

describe('OwnhousesPage', () => {
  let component: OwnhousesPage;
  let fixture: ComponentFixture<OwnhousesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnhousesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnhousesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
