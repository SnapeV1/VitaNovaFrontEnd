import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPlanComponent } from './dialog-plan.component';

describe('DialogPlanComponent', () => {
  let component: DialogPlanComponent;
  let fixture: ComponentFixture<DialogPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
