import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibosIngresoComponent } from './recibos-ingreso.component';

describe('RecibosIngresoComponent', () => {
  let component: RecibosIngresoComponent;
  let fixture: ComponentFixture<RecibosIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecibosIngresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibosIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
