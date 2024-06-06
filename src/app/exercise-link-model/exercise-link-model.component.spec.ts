import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseLinkModelComponent } from './exercise-link-model.component';

describe('ExerciseLinkModelComponent', () => {
  let component: ExerciseLinkModelComponent;
  let fixture: ComponentFixture<ExerciseLinkModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseLinkModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseLinkModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
