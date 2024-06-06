import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipiesLowCarbComponent } from './recipies-low-carb.component';

describe('RecipiesLowCarbComponent', () => {
  let component: RecipiesLowCarbComponent;
  let fixture: ComponentFixture<RecipiesLowCarbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipiesLowCarbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipiesLowCarbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
