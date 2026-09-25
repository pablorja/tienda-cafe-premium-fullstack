import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CafeService } from './cafe.service';
import { Cafe } from '../Models/cafe';

describe('CafeService', () => {
  let service: CafeService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CafeService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const savedCafe: Cafe = {
    id: 12,
    cafe: 'Huila de prueba',
    especialidad: 'Castillo lavado',
    presentacion: 'Bolsa de 340 g',
    origen: 'Huila, Colombia',
    cantidad: 8,
    valor: 32000,
    descripcion: 'Registro para probar el servicio',
  };

  it('gets the coffee list from the API', () => {
    service.getCafes().subscribe((cafes) => expect(cafes).toEqual([savedCafe]));
    const request = httpTesting.expectOne('http://localhost:5031/api/cafe');
    expect(request.request.method).toBe('GET');
    request.flush([savedCafe]);
  });

  it('creates a coffee with the API field names', () => {
    const { id: _id, ...newCafe } = savedCafe;
    service.createCafe(newCafe).subscribe((created) => expect(created).toEqual(savedCafe));
    const request = httpTesting.expectOne('http://localhost:5031/api/cafe');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newCafe);
    request.flush(savedCafe, { status: 201, statusText: 'Created' });
  });

  it('updates the coffee at its id endpoint', () => {
    service.updateCafe(savedCafe.id, savedCafe).subscribe();
    const request = httpTesting.expectOne(`http://localhost:5031/api/cafe/${savedCafe.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(savedCafe);
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('deletes the coffee at its id endpoint', () => {
    service.deleteCafe(savedCafe.id).subscribe();
    const request = httpTesting.expectOne(`http://localhost:5031/api/cafe/${savedCafe.id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });
});
