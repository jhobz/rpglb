import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSweepstakesComponent } from './event-sweepstakes.component';

describe('EventSweepstakesComponent', () => {
  let component: EventSweepstakesComponent;
  let fixture: ComponentFixture<EventSweepstakesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSweepstakesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSweepstakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
