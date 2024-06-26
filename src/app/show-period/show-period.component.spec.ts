import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPeriodComponent } from './show-period.component';

describe('ShowPeriodComponent', () => {
  let component: ShowPeriodComponent;
  let fixture: ComponentFixture<ShowPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
