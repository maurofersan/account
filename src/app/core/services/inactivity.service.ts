import { Injectable, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subject, fromEvent, merge } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

/**
 * Servicio global para manejar la inactividad del usuario.
 * Redirige a la página de inicio después de 15 minutos de inactividad.
 * Funciona globalmente para todas las páginas y microfrontends.
 */
@Injectable({
  providedIn: 'root',
})
export class InactivityService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  
  // Tiempo de inactividad en milisegundos (15 minutos)
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000;
  
  // Clave para sincronización entre pestañas
  private readonly STORAGE_KEY = 'lastActivityTimestamp';
  private readonly STORAGE_EVENT_KEY = 'inactivityCheck';
  
  private inactivityTimer: any = null;
  private destroy$ = new Subject<void>();
  private isInitialized = false;

  constructor() {
    // Inicializar automáticamente cuando se crea el servicio
    this.initialize();
  }

  /**
   * Inicializa el servicio de inactividad
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.setupActivityListeners();
    this.setupStorageSync();
    this.resetInactivityTimer();
  }

  /**
   * Configura los listeners de eventos de actividad
   */
  private setupActivityListeners(): void {
    // Eventos de actividad del usuario
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    // Crear observables para cada evento
    const activityObservables = activityEvents.map((event) =>
      fromEvent(this.document, event, { passive: true })
    );

    // Combinar todos los eventos y usar debounce para evitar demasiadas llamadas
    merge(...activityObservables)
      .pipe(
        debounceTime(1000), // Debounce de 1 segundo para optimizar
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.onUserActivity();
      });

    // Escuchar cambios de visibilidad de la pestaña
    fromEvent(this.document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.document.hidden) {
          // Cuando la pestaña vuelve a ser visible, verificar última actividad
          this.checkLastActivity();
        }
      });
  }

  /**
   * Configura la sincronización entre pestañas usando localStorage
   */
  private setupStorageSync(): void {
    // Escuchar cambios en localStorage desde otras pestañas
    fromEvent<StorageEvent>(window, 'storage')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.key === this.STORAGE_KEY) {
          // Otra pestaña actualizó la actividad, verificar si debemos redirigir
          this.checkLastActivity();
        } else if (event.key === this.STORAGE_EVENT_KEY) {
          // Otra pestaña detectó inactividad, redirigir también
          this.handleInactivity();
        }
      });
  }

  /**
   * Maneja la actividad del usuario
   */
  private onUserActivity(): void {
    const now = Date.now();
    
    // Guardar timestamp en localStorage para sincronización entre pestañas
    try {
      localStorage.setItem(this.STORAGE_KEY, now.toString());
    } catch (e) {
      // Si localStorage no está disponible, continuar sin sincronización
      console.warn('localStorage no disponible para sincronización de inactividad');
    }

    // Reiniciar el temporizador
    this.resetInactivityTimer();
  }

  /**
   * Reinicia el temporizador de inactividad
   */
  private resetInactivityTimer(): void {
    // Limpiar el temporizador anterior
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Crear nuevo temporizador
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Verifica la última actividad desde localStorage
   * Útil cuando la pestaña vuelve a ser visible
   */
  private checkLastActivity(): void {
    try {
      const lastActivityStr = localStorage.getItem(this.STORAGE_KEY);
      if (!lastActivityStr) {
        // No hay registro, reiniciar temporizador
        this.resetInactivityTimer();
        return;
      }

      const lastActivity = parseInt(lastActivityStr, 10);
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity >= this.INACTIVITY_TIMEOUT) {
        // Ya pasó el tiempo de inactividad, redirigir
        this.handleInactivity();
      } else {
        // Aún hay tiempo, ajustar el temporizador
        const remainingTime = this.INACTIVITY_TIMEOUT - timeSinceActivity;
        if (this.inactivityTimer) {
          clearTimeout(this.inactivityTimer);
        }
        this.inactivityTimer = setTimeout(() => {
          this.handleInactivity();
        }, remainingTime);
      }
    } catch (e) {
      // Si hay error, simplemente reiniciar el temporizador
      this.resetInactivityTimer();
    }
  }

  /**
   * Maneja el evento de inactividad
   */
  private handleInactivity(): void {
    // Notificar a otras pestañas
    try {
      localStorage.setItem(this.STORAGE_EVENT_KEY, Date.now().toString());
      // Limpiar inmediatamente para que el evento se dispare en otras pestañas
      localStorage.removeItem(this.STORAGE_EVENT_KEY);
    } catch (e) {
      // Continuar aunque no se pueda notificar
    }

    // Limpiar el temporizador
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    // Redirigir a la página de inicio
    // Usar '/' que es la ruta base según app.routes.ts
    this.router.navigate(['/'], { replaceUrl: true });
  }

  /**
   * Reinicia manualmente el temporizador de inactividad
   * Útil para acciones específicas que quieras considerar como actividad
   */
  resetTimer(): void {
    this.onUserActivity();
  }

  /**
   * Limpia recursos al destruir el servicio
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }
}

