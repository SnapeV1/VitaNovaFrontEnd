import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealCardsComponent } from './meal-cards.component';

describe('MealCardsComponent', () => {
  let component: MealCardsComponent;
  let fixture: ComponentFixture<MealCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
