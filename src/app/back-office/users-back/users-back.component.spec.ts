import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersBackComponent } from './users-back.component';

describe('UsersBackComponent', () => {
  let component: UsersBackComponent;
  let fixture: ComponentFixture<UsersBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
