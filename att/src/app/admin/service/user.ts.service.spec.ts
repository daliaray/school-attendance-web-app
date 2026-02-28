import { TestBed } from '@angular/core/testing';

import { UserTsService } from './user.ts.service';

describe('UserTsService', () => {
  let service: UserTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
