import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesListPageComponent } from './games-list-page.component';

describe('GamesListPageComponent', () => {
  let component: GamesListPageComponent;
  let fixture: ComponentFixture<GamesListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
