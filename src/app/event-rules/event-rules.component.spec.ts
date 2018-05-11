import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRulesComponent } from './event-rules.component';

describe('EventRulesComponent', () => {
  let component: EventRulesComponent;
  let fixture: ComponentFixture<EventRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
