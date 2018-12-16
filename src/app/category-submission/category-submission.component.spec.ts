import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySubmissionComponent } from './category-submission.component';

describe('CategorySubmissionComponent', () => {
  let component: CategorySubmissionComponent;
  let fixture: ComponentFixture<CategorySubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
