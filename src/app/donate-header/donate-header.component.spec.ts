import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateHeaderComponent } from './donate-header.component';

describe('DonateHeaderComponent', () => {
  let component: DonateHeaderComponent;
  let fixture: ComponentFixture<DonateHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonateHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
