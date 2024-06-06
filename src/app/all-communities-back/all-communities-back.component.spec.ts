import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCommunitiesBackComponent } from './all-communities-back.component';

describe('AllCommunitiesBackComponent', () => {
  let component: AllCommunitiesBackComponent;
  let fixture: ComponentFixture<AllCommunitiesBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCommunitiesBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCommunitiesBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
