import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodRecommendationsComponent } from './period-recommendations.component';

describe('PeriodRecommendationsComponent', () => {
  let component: PeriodRecommendationsComponent;
  let fixture: ComponentFixture<PeriodRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodRecommendationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
