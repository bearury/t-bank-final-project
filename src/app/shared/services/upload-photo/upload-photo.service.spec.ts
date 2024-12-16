import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TuiAlertService } from '@taiga-ui/core';
import { of } from 'rxjs';

import { UploadPhotoService } from './upload-photo.service';

describe('UploadPhotoService', () => {
  let service: UploadPhotoService;
  let httpMock: HttpTestingController;
  let alertService: TuiAlertService;

  beforeEach(() => {
    const alertServiceSpy = { open: jest.fn().mockReturnValue(of()) };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UploadPhotoService,
        { provide: TuiAlertService, useValue: alertServiceSpy },
      ],
    });

    service = TestBed.inject(UploadPhotoService);
    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(TuiAlertService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен успешно загрузить фото и вернуть secure_url', (done) => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = { secure_url: 'https://example.com/image.jpg' };

    service.setPhoto(file).subscribe((result) => {
      expect(result).toBe(mockResponse.secure_url);
      done();
    });

    const req = httpMock.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('должен вернуть null и вызвать TuiAlertService при ошибке загрузки', (done) => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    service.setPhoto(file).subscribe((result) => {
      expect(result).toBeNull();
      expect(alertService.open).toHaveBeenCalledWith(
        'Basic <strong class="alert">ошибка при загрузке фото</strong>',
        { appearance: 'negative' }
      );
      done();
    });

    const req = httpMock.expectOne(service['url']);
    req.error(new ErrorEvent('Network error'));
  });
});
