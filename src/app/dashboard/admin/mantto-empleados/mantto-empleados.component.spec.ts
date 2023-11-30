import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManttoEmpleadosComponent } from './mantto-empleados.component';

describe('ManttoEmpleadosComponent', () => {
  let component: ManttoEmpleadosComponent;
  let fixture: ComponentFixture<ManttoEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManttoEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManttoEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
