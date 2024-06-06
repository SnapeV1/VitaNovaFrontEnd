import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodRecipesComponent } from './period-recipes.component';

describe('PeriodRecipesComponent', () => {
  let component: PeriodRecipesComponent;
  let fixture: ComponentFixture<PeriodRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodRecipesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
