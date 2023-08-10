import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClonarPlanillaComponent } from './clonar-planilla.component';

describe('ClonarPlanillaComponent', () => {
  let component: ClonarPlanillaComponent;
  let fixture: ComponentFixture<ClonarPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClonarPlanillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClonarPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
