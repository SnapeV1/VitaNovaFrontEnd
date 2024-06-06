import { TestBed } from '@angular/core/testing';

import { WebSocketNotifService } from './web-socket-notif.service';

describe('WebSocketNotifService', () => {
  let service: WebSocketNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
