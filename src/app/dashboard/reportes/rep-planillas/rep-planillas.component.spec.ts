import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepPlanillasComponent } from './rep-planillas.component';

describe('RepPlanillasComponent', () => {
  let component: RepPlanillasComponent;
  let fixture: ComponentFixture<RepPlanillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepPlanillasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepPlanillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
