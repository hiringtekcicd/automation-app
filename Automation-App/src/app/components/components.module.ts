import { NgModule, Component } from '@angular/core';
import { SensorDisplayComponent } from './sensor-display/sensor-display.component';
import { IonicModule } from '@ionic/angular';
import { PhComponent } from './ph/ph.component';

@NgModule({
    declarations: [SensorDisplayComponent, PhComponent],
    imports: [IonicModule],
    exports: [SensorDisplayComponent, PhComponent]
})

export class ComponentsModule {}