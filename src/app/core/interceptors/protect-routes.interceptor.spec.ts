import { TestBed } from '@angular/core/testing';

import { ProtectRoutesInterceptor } from './protect-routes.interceptor';

describe('ProtectRoutesInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ProtectRoutesInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ProtectRoutesInterceptor = TestBed.inject(ProtectRoutesInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
