import { TestBed } from '@angular/core/testing';

import { OpenCvService } from './open-cv.service';

describe('OpenCvService', () => {
  let service: OpenCvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenCvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
