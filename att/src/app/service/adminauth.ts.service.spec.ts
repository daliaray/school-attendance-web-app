import { TestBed } from '@angular/core/testing';

import { AdminauthTsService } from './adminauth.ts.service';

describe('AdminauthTsService', () => {
  let service: AdminauthTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminauthTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
