import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSystemPage } from './add-system.page';

describe('AddSystemPage', () => {
  let component: AddSystemPage;
  let fixture: ComponentFixture<AddSystemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSystemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSystemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
