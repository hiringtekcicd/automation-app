import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MointerPage } from './mointer.page';

describe('MointerPage', () => {
  let component: MointerPage;
  let fixture: ComponentFixture<MointerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MointerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MointerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
