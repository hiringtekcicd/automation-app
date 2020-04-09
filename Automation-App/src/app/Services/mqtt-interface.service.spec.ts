import { TestBed } from '@angular/core/testing';

import { MqttInterfaceService } from './mqtt-interface.service';

describe('MqttInterfaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqttInterfaceService = TestBed.get(MqttInterfaceService);
    expect(service).toBeTruthy();
  });
});
