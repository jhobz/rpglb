import { TestBed, inject } from '@angular/core/testing';

import { SpeedrunEventResolverService } from './speedrun-event-resolver.service';

describe('SpeedrunEventResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeedrunEventResolverService]
    });
  });

  it('should be created', inject([SpeedrunEventResolverService], (service: SpeedrunEventResolverService) => {
    expect(service).toBeTruthy();
  }));
});
