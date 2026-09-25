import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Cafe, CafeForm } from '../Models/cafe';
import { timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CafeService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.ApiUrl;
  private readonly endpoint = `${this.apiUrl}cafe`;

  getCafes() {
    return this.httpClient.get<Cafe[]>(this.endpoint).pipe(timeout({ first: 10000 }));
  }

  createCafe(cafe: CafeForm) {
    return this.httpClient.post<Cafe>(this.endpoint, cafe).pipe(timeout({ first: 10000 }));
  }

  updateCafe(id: number, cafe: Cafe) {
    return this.httpClient.put<void>(`${this.endpoint}/${id}`, cafe).pipe(timeout({ first: 10000 }));
  }

  deleteCafe(id: number) {
    return this.httpClient.delete<void>(`${this.endpoint}/${id}`).pipe(timeout({ first: 10000 }));
  }
}
