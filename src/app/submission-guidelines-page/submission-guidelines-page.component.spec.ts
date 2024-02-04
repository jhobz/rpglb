import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionGuidelinesPageComponent } from './submission-guidelines-page.component';

describe('SubmissionGuidelinesPageComponent', () => {
  let component: SubmissionGuidelinesPageComponent;
  let fixture: ComponentFixture<SubmissionGuidelinesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionGuidelinesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionGuidelinesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
