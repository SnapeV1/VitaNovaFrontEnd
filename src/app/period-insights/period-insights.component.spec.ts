import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodInsightsComponent } from './period-insights.component';

describe('PeriodInsightsComponent', () => {
  let component: PeriodInsightsComponent;
  let fixture: ComponentFixture<PeriodInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodInsightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
