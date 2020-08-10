import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSensorPage } from './add-sensor.page';

describe('AddSensorPage', () => {
  let component: AddSensorPage;
  let fixture: ComponentFixture<AddSensorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSensorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSensorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
