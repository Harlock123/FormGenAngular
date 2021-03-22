import { TestBed } from '@angular/core/testing';

import { FormgenLibService } from './formgen-lib.service';

describe('FormgenLibService', () => {
  let service: FormgenLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormgenLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
