import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidPolicyComponent } from './covid-policy.component';

describe('CovidPolicyComponent', () => {
  let component: CovidPolicyComponent;
  let fixture: ComponentFixture<CovidPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
