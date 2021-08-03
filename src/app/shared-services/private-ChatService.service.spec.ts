/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrivateChatServiceService } from './private-ChatService.service';

describe('Service: PrivateChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateChatServiceService]
    });
  });

  it('should ...', inject([PrivateChatServiceService], (service: PrivateChatServiceService) => {
    expect(service).toBeTruthy();
  }));
});
