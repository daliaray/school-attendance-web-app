import { TestBed } from '@angular/core/testing';

import { ErrorHandlerTsService } from './error-handler.ts.service';

describe('ErrorHandlerTsService', () => {
  let service: ErrorHandlerTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
