import { TestBed } from '@angular/core/testing';

import { PersonalGoalsService } from './personal-goals.service';

describe('PersonalGoalsService', () => {
  let service: PersonalGoalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalGoalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
