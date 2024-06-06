import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPlanUserComponent } from './get-plan-user.component';

describe('GetPlanUserComponent', () => {
  let component: GetPlanUserComponent;
  let fixture: ComponentFixture<GetPlanUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetPlanUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPlanUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
