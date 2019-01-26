import { TestBed, inject } from '@angular/core/testing';

import { SpeedrunEventService } from './speedrun-event.service';

describe('SpeedrunEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeedrunEventService]
    });
  });

  it('should be created', inject([SpeedrunEventService], (service: SpeedrunEventService) => {
    expect(service).toBeTruthy();
  }));
});
