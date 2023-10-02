import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillasPagadasComponent } from './planillas-pagadas.component';

describe('PlanillasPagadasComponent', () => {
  let component: PlanillasPagadasComponent;
  let fixture: ComponentFixture<PlanillasPagadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanillasPagadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillasPagadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
