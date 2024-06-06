import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDetailsDialogComponent } from './food-details-dialog.component';

describe('FoodDetailsDialogComponent', () => {
  let component: FoodDetailsDialogComponent;
  let fixture: ComponentFixture<FoodDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
