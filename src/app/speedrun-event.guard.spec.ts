import { TestBed, async, inject } from '@angular/core/testing';

import { SpeedrunEventGuard } from './speedrun-event.guard';

describe('EventGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeedrunEventGuard]
    });
  });

  it('should ...', inject([SpeedrunEventGuard], (guard: SpeedrunEventGuard) => {
    expect(guard).toBeTruthy();
  }));
});
