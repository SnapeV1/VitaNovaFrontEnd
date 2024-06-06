import { TestBed } from '@angular/core/testing';

import { PgoalsServicesService } from './pgoals-services.service';

describe('PgoalsServicesService', () => {
  let service: PgoalsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PgoalsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
