import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarPlanillaComponent } from './importar-planilla.component';

describe('ImportarPlanillaComponent', () => {
  let component: ImportarPlanillaComponent;
  let fixture: ComponentFixture<ImportarPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarPlanillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
