import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodlistaddedComponent } from './foodlistadded.component';

describe('FoodlistaddedComponent', () => {
  let component: FoodlistaddedComponent;
  let fixture: ComponentFixture<FoodlistaddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodlistaddedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodlistaddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
