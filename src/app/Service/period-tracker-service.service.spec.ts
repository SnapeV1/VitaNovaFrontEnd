import { TestBed } from '@angular/core/testing';

import { PeriodTrackerServiceService } from './period-tracker-service.service';

describe('PeriodTrackerServiceService', () => {
  let service: PeriodTrackerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodTrackerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
