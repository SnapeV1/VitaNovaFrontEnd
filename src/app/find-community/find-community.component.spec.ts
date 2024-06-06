import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCommunityComponent } from './find-community.component';

describe('FindCommunityComponent', () => {
  let component: FindCommunityComponent;
  let fixture: ComponentFixture<FindCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindCommunityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
