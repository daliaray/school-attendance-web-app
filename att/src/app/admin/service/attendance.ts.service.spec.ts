import { TestBed } from '@angular/core/testing';

import { AttendanceTsService } from './attendance.ts.service';

describe('AttendanceTsService', () => {
  let service: AttendanceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
