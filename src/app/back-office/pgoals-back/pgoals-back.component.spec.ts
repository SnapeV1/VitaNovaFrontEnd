import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgoalsBackComponent } from './pgoals-back.component';

describe('PgoalsBackComponent', () => {
  let component: PgoalsBackComponent;
  let fixture: ComponentFixture<PgoalsBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgoalsBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgoalsBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
