import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionFormComponent } from './submission-form.component';

describe('SubmissionFormComponent', () => {
  let component: SubmissionFormComponent;
  let fixture: ComponentFixture<SubmissionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
