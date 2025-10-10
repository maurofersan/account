import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MountPathService {
  private mountPathSubject = new BehaviorSubject<string>('/');
  public mountPath$ = this.mountPathSubject.asObservable();

  constructor() {
    // Inicializar con el path base del microfrontend
    this.initializeMountPath();
  }

  private initializeMountPath(): void {
    // Obtener el path base del microfrontend desde window o configuración
    const basePath = this.getBasePath();
    this.mountPathSubject.next(basePath);
  }

  private getBasePath(): string {
    // En desarrollo, usar path relativo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '/';
    }
    
    // En producción, obtener el path del microfrontend
    // Esto puede venir de una variable de entorno o configuración
    const currentPath = window.location.pathname;
    const microfrontendPath = currentPath.split('/')[1]; // Asumiendo estructura /mf-name/...
    
    return microfrontendPath ? `/${microfrontendPath}/` : '/';
  }

  /**
   * Gets the current mount path
   */
  getCurrentMountPath(): string {
    return this.mountPathSubject.value;
  }

  /**
   * Sets a new mount path
   */
  setMountPath(path: string): void {
    this.mountPathSubject.next(path);
  }
}
