import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPlayedComponent } from './next-played.component';

describe('NextPlayedComponent', () => {
  let component: NextPlayedComponent;
  let fixture: ComponentFixture<NextPlayedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextPlayedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPlayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
