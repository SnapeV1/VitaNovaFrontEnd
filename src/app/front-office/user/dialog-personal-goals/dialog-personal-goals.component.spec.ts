import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPersonalGoalsComponent } from './dialog-personal-goals.component';

describe('DialogPersonalGoalsComponent', () => {
  let component: DialogPersonalGoalsComponent;
  let fixture: ComponentFixture<DialogPersonalGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPersonalGoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPersonalGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
