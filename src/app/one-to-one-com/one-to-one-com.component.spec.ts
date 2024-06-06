import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneToOneComComponent } from './one-to-one-com.component';

describe('OneToOneComComponent', () => {
  let component: OneToOneComComponent;
  let fixture: ComponentFixture<OneToOneComComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneToOneComComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneToOneComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
