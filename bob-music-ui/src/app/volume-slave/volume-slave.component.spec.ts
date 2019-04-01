import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeSlaveComponent } from './volume-slave.component';

describe('VolumeSlaveComponent', () => {
  let component: VolumeSlaveComponent;
  let fixture: ComponentFixture<VolumeSlaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeSlaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeSlaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
