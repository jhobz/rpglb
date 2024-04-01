import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesPageComponent } from './user-roles-page.component';

describe('UserRolesPageComponent', () => {
  let component: UserRolesPageComponent;
  let fixture: ComponentFixture<UserRolesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
