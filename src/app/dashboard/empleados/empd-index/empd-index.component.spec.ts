import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpdIndexComponent } from './empd-index.component';

describe('EmpdIndexComponent', () => {
  let component: EmpdIndexComponent;
  let fixture: ComponentFixture<EmpdIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpdIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpdIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
