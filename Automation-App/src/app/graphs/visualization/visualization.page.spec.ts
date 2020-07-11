import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisualizationPage } from './visualization.page';

describe('VisualizationPage', () => {
  let component: VisualizationPage;
  let fixture: ComponentFixture<VisualizationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
