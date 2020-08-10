import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddGrowroomPage } from './add-growroom.page';

describe('AddGrowroomPage', () => {
  let component: AddGrowroomPage;
  let fixture: ComponentFixture<AddGrowroomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrowroomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddGrowroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
