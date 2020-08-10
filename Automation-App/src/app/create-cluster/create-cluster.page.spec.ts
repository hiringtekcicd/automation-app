import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateClusterPage } from './create-cluster.page';

describe('CreateClusterPage', () => {
  let component: CreateClusterPage;
  let fixture: ComponentFixture<CreateClusterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClusterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClusterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
