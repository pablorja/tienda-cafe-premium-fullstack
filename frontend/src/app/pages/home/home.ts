import { CurrencyPipe, isPlatformBrowser, registerLocaleData } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, TimeoutError } from 'rxjs';
import { Cafe, CafeForm } from '../../Models/cafe';
import { CafeService } from '../../Services/cafe.service';

registerLocaleData(localeEsCo);

@Component({
  imports: [CurrencyPipe, FormsModule],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly cafeService = inject(CafeService);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly isAdmin = inject(ActivatedRoute).snapshot.data['admin'] === true;

  public cafes: Cafe[] = [];
  public searchTerm = '';
  public isFormVisible = false;
  public editingId: number | null = null;
  public formModel: CafeForm = this.createEmptyCafe();
  public isLoading = false;
  public isSaving = false;
  public errorMessage = '';
  public successMessage = '';

  get visibleCafes(): Cafe[] {
    const query = this.searchTerm.trim().toLocaleLowerCase('es-CO');
    if (!query) return this.cafes;
    return this.cafes.filter((cafe) =>
      [cafe.cafe, cafe.especialidad, cafe.presentacion, cafe.origen, cafe.descripcion]
        .some((value) => value?.toLocaleLowerCase('es-CO').includes(query)),
    );
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this.loadCafes();
  }

  private createEmptyCafe(): CafeForm {
    return {
      cafe: '',
      especialidad: '',
      presentacion: '',
      origen: '',
      cantidad: 1,
      valor: 0,
      descripcion: '',
    };
  }

  private requestErrorMessage(error: unknown, action: string): string {
    if (error instanceof TimeoutError) {
      return `La solicitud para ${action} tardó demasiado. Comprueba que la API esté activa e inténtalo de nuevo.`;
    }

    if (!(error instanceof HttpErrorResponse)) {
      return `No se pudo ${action}. Inténtalo de nuevo.`;
    }

    if (error.status === 0) {
      return `No hay conexión con la API para ${action}. Confirma que esté activa en http://localhost:5031 y que el origen del frontend esté permitido.`;
    }

    const body = error.error as { title?: string; detail?: string; errors?: Record<string, string[]> } | null;
    const validationDetails = body?.errors ? Object.values(body.errors).flat().join(' ') : '';

    if (error.status === 400 && validationDetails) return validationDetails;
    if (error.status === 404) return 'El café ya no existe. Actualiza el catálogo e inténtalo de nuevo.';

    return body?.detail ?? body?.title ?? `La API respondió con HTTP ${error.status} al intentar ${action}.`;
  }

  private loadCafes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cafeService.getCafes().subscribe({
      next: (cafes) => {
        this.cafes = cafes;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar el catálogo de café:', error);
        this.cafes = [];
        this.isLoading = false;
        this.errorMessage = this.requestErrorMessage(error, 'cargar el catálogo');
      },
    });
  }

  refreshCafes(): void {
    this.successMessage = '';
    this.loadCafes();
  }

  openCreateForm(): void {
    this.formModel = this.createEmptyCafe();
    this.editingId = null;
    this.isFormVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitCafe(): void {
    const payload: CafeForm = {
      cafe: this.formModel.cafe.trim(),
      especialidad: this.formModel.especialidad.trim(),
      presentacion: this.formModel.presentacion.trim(),
      origen: this.formModel.origen.trim(),
      cantidad: Number(this.formModel.cantidad),
      valor: Number(this.formModel.valor),
      descripcion: this.formModel.descripcion?.trim() ?? '',
    };

    if (!payload.cafe || !payload.especialidad || !payload.presentacion || !payload.origen) {
      this.errorMessage = 'Completa el café, la especialidad, la presentación y el origen.';
      return;
    }
    if (!Number.isInteger(payload.cantidad) || payload.cantidad < 0) {
      this.errorMessage = 'La cantidad debe ser un número entero igual o mayor que cero.';
      return;
    }
    if (!Number.isFinite(payload.valor) || payload.valor < 0) {
      this.errorMessage = 'El valor debe ser un número igual o mayor que cero.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    const request: Observable<unknown> = this.editingId === null
      ? this.cafeService.createCafe(payload)
      : this.cafeService.updateCafe(this.editingId, { id: this.editingId, ...payload });

    request.subscribe({
      next: () => {
        this.successMessage = this.editingId === null
          ? 'Café guardado correctamente.'
          : 'Café actualizado correctamente.';
        this.resetForm();
        this.loadCafes();
      },
      error: (error: unknown) => {
        console.error('Error al guardar el café:', error);
        this.errorMessage = this.requestErrorMessage(error, this.editingId === null ? 'crear el café' : 'actualizar el café');
        this.isSaving = false;
      },
    });
  }

  editCafe(cafe: Cafe): void {
    this.isFormVisible = true;
    this.editingId = cafe.id;
    const { id: _id, ...form } = cafe;
    this.formModel = { ...form, descripcion: cafe.descripcion ?? '' };
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteCafe(id: number): void {
    if (!confirm('¿Deseas eliminar este café del catálogo?')) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cafeService.deleteCafe(id).subscribe({
      next: () => {
        this.successMessage = 'Café eliminado correctamente.';
        if (this.editingId === id) this.resetForm();
        this.loadCafes();
      },
      error: (error: unknown) => {
        console.error('Error al eliminar el café:', error);
        this.errorMessage = this.requestErrorMessage(error, 'eliminar el café');
        this.isLoading = false;
      },
    });
  }

  resetForm(): void {
    this.formModel = this.createEmptyCafe();
    this.editingId = null;
    this.isLoading = false;
    this.isSaving = false;
    this.isFormVisible = false;
  }
}
