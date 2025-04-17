/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DepotService } from './Depot.service';

describe('Service: Depot', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepotService]
    });
  });

  it('should ...', inject([DepotService], (service: DepotService) => {
    expect(service).toBeTruthy();
  }));
});
