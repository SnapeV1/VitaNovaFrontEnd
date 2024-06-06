import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerApiComponent } from './timer-api.component';

describe('TimerApiComponent', () => {
  let component: TimerApiComponent;
  let fixture: ComponentFixture<TimerApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
