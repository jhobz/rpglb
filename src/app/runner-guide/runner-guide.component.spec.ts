import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerGuideComponent } from './runner-guide.component';

describe('RunnerGuideComponent', () => {
  let component: RunnerGuideComponent;
  let fixture: ComponentFixture<RunnerGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnerGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
