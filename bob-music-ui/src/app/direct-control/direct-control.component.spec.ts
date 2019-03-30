import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectControlComponent } from './direct-control.component';

describe('DirectControlComponent', () => {
  let component: DirectControlComponent;
  let fixture: ComponentFixture<DirectControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
