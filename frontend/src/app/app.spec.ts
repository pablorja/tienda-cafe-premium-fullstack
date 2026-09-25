import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show navigation for the store and administration', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const catalogLinks = Array.from(compiled.querySelectorAll('a[routerLink="/catalogo"]'));
    expect(catalogLinks.some((link) => link.textContent?.includes('Catálogo'))).toBe(true);
    expect(compiled.querySelector('a[routerLink="/admin"]')?.textContent).toContain('Administración');
  });
});
