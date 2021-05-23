import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CamerasPage } from './cameras.page';

describe('CamerasPage', () => {
  let component: CamerasPage;
  let fixture: ComponentFixture<CamerasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamerasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CamerasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
