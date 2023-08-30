import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpIndexComponent } from './emp-index.component';

describe('EmpIndexComponent', () => {
  let component: EmpIndexComponent;
  let fixture: ComponentFixture<EmpIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
