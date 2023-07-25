import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacorapjComponent } from './bitacorapj.component';

describe('BitacorapjComponent', () => {
  let component: BitacorapjComponent;
  let fixture: ComponentFixture<BitacorapjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitacorapjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitacorapjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
