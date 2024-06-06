import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexerciseComponent } from './addexercise.component';

describe('WorkoutComponent', () => {
  let component: AddexerciseComponent;
  let fixture: ComponentFixture<AddexerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddexerciseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddexerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
