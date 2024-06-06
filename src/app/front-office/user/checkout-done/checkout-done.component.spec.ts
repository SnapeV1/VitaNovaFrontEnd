import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDoneComponent } from './checkout-done.component';

describe('CheckoutDoneComponent', () => {
  let component: CheckoutDoneComponent;
  let fixture: ComponentFixture<CheckoutDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
