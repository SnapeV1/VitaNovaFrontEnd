import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChallengesBackComponent } from './all-challenges-back.component';

describe('AllChallengesBackComponent', () => {
  let component: AllChallengesBackComponent;
  let fixture: ComponentFixture<AllChallengesBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllChallengesBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllChallengesBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
