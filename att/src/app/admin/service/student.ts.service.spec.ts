import { TestBed } from '@angular/core/testing';

import { StudentTsService } from './student.ts.service';

describe('StudentTsService', () => {
  let service: StudentTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
