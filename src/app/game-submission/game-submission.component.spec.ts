import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSubmissionComponent } from './game-submission.component';

describe('GameSubmissionComponent', () => {
  let component: GameSubmissionComponent;
  let fixture: ComponentFixture<GameSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
