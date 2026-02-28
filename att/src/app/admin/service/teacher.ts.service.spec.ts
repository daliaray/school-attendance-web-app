import { TestBed } from '@angular/core/testing';

import { TeacherTsService } from './teacher.ts.service';

describe('TeacherTsService', () => {
  let service: TeacherTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
