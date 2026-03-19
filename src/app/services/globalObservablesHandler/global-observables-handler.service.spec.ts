import { TestBed } from '@angular/core/testing';

import { GlobalObservablesHandlerService } from './global-observables-handler.service';

describe('GlobalObservablesHandlerService', () => {
  let service: GlobalObservablesHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalObservablesHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
