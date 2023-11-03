import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPage404Component } from './dash-page404.component';

describe('DashPage404Component', () => {
  let component: DashPage404Component;
  let fixture: ComponentFixture<DashPage404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashPage404Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashPage404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
