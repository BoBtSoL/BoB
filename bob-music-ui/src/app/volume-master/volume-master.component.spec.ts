import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeMasterComponent } from './volume-master.component';

describe('VolumeMasterComponent', () => {
  let component: VolumeMasterComponent;
  let fixture: ComponentFixture<VolumeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
