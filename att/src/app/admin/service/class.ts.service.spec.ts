import { TestBed } from '@angular/core/testing';

import { ClassTsService } from './class.ts.service';

describe('ClassTsService', () => {
  let service: ClassTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
