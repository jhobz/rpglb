import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEventHomePageComponent } from './pre-event-home-page.component';

describe('PreEventHomePageComponent', () => {
  let component: PreEventHomePageComponent;
  let fixture: ComponentFixture<PreEventHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreEventHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreEventHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
