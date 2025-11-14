import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTestPageComponent } from './email-test-page.component';

describe('EmailTestPageComponent', () => {
  let component: EmailTestPageComponent;
  let fixture: ComponentFixture<EmailTestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
