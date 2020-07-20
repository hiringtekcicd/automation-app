import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaterTempComponent } from './water-temp.component';

describe('WaterTempComponent', () => {
  let component: WaterTempComponent;
  let fixture: ComponentFixture<WaterTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterTempComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaterTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
