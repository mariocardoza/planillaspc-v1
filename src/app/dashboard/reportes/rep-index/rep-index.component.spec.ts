import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepIndexComponent } from './rep-index.component';

describe('RepIndexComponent', () => {
  let component: RepIndexComponent;
  let fixture: ComponentFixture<RepIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
