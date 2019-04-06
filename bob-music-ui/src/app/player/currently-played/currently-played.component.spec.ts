import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentlyPlayedComponent } from './currently-played.component';

describe('CurrentlyPlayedComponent', () => {
  let component: CurrentlyPlayedComponent;
  let fixture: ComponentFixture<CurrentlyPlayedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentlyPlayedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentlyPlayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
