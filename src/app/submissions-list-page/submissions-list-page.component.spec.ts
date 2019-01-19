import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsListPageComponent } from './submissions-list-page.component';

describe('SubmissionsListPageComponent', () => {
  let component: SubmissionsListPageComponent;
  let fixture: ComponentFixture<SubmissionsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
