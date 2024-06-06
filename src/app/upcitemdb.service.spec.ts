import { TestBed } from '@angular/core/testing';

import { UpcitemdbService } from './upcitemdb.service';

describe('UpcitemdbService', () => {
  let service: UpcitemdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpcitemdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
