import { TestBed } from '@angular/core/testing';

import { ParentTsService } from './parent.ts.service';

describe('ParentTsService', () => {
  let service: ParentTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
