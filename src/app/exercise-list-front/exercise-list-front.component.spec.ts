import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseListFrontComponent } from './exercise-list-front.component';

describe('ExerciseListFrontComponent', () => {
  let component: ExerciseListFrontComponent;
  let fixture: ComponentFixture<ExerciseListFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseListFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
