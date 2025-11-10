import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAlphanumericOnly]',
  standalone: true,
})
export class AlphanumericOnlyDirective implements OnInit, OnDestroy {
  @Input() allowSpaces: boolean = false; // Opción para permitir espacios si es necesario

  private inputElement: HTMLInputElement | null = null;
  private stdInputElement: HTMLElement | null = null;
  private listeners: (() => void)[] = [];
  private isUpdating: boolean = false; // Flag para evitar bucles infinitos

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Para std-input, necesitamos escuchar eventos del componente
    if (this.el.nativeElement.tagName === 'STD-INPUT') {
      this.stdInputElement = this.el.nativeElement;
      this.setupStdInputListeners();
    } else if (this.el.nativeElement.tagName === 'INPUT') {
      this.inputElement = this.el.nativeElement;
    }
  }

  ngOnDestroy(): void {
    // Limpiar listeners
    this.listeners.forEach((unlisten) => unlisten());
    this.listeners = [];
  }

  private setupStdInputListeners(): void {
    if (!this.stdInputElement) return;

    // Escuchar eventos del componente std-input
    const keydownListener = this.renderer.listen(
      this.stdInputElement,
      'keydown',
      (event: KeyboardEvent) => this.onKeyDown(event)
    );
    this.listeners.push(keydownListener);

    // Escuchar el keydownEvent del std-input (evento personalizado)
    const keydownEventListener = this.renderer.listen(
      this.stdInputElement,
      'keydownEvent',
      (event: CustomEvent) => {
        const keyboardEvent = event.detail;
        if (keyboardEvent) {
          this.onKeyDown(keyboardEvent);
        }
      }
    );
    this.listeners.push(keydownEventListener);

    // Escuchar el evento changeEvent del std-input
    const changeListener = this.renderer.listen(
      this.stdInputElement,
      'changeEvent',
      (event: CustomEvent) => this.onStdInputChange(event)
    );
    this.listeners.push(changeListener);

    // Escuchar eventos de pegado
    const pasteListener = this.renderer.listen(
      this.stdInputElement,
      'paste',
      (event: ClipboardEvent) => this.onPaste(event)
    );
    this.listeners.push(pasteListener);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Permitir teclas de control
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
      'Insert',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Permitir atajos de teclado (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z)
    if (event.ctrlKey || event.metaKey) {
      const allowedCtrlKeys = ['a', 'c', 'v', 'x', 'z'];
      if (allowedCtrlKeys.includes(event.key.toLowerCase())) {
        // Si es Ctrl+V, el evento paste se encargará de filtrar
        return;
      }
    }

    // Permitir espacios si está configurado
    if (this.allowSpaces && event.key === ' ') {
      return;
    }

    // Validar que sea alfanumérico
    const alphanumericPattern = /^[a-zA-Z0-9]$/;
    if (!alphanumericPattern.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    // Solo procesar si no es un std-input (para std-input usamos changeEvent)
    if (this.stdInputElement) {
      return;
    }

    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    this.filterValue(target);
  }

  private onStdInputChange(event: CustomEvent): void {
    // Evitar bucles infinitos
    if (this.isUpdating) {
      return;
    }

    // Extraer el valor del evento - puede venir en event.detail o como el evento mismo
    let value: any = '';
    
    if (event && event.detail !== undefined) {
      // Si event.detail es un string, usarlo directamente
      if (typeof event.detail === 'string') {
        value = event.detail;
      } 
      // Si event.detail es un objeto con una propiedad value
      else if (event.detail && typeof event.detail === 'object' && 'value' in event.detail) {
        value = event.detail.value;
      }
      // Si event.detail es un CustomEvent, extraer su detail
      else if (event.detail && event.detail.detail !== undefined) {
        value = event.detail.detail;
      }
    }

    // Asegurarse de que value sea un string
    if (typeof value !== 'string') {
      // Intentar obtener el valor del componente directamente
      if (this.stdInputElement) {
        value = (this.stdInputElement as any).value || '';
      } else {
        value = String(value || '');
      }
    }

    const filteredValue = this.filterAlphanumeric(value);

    // Si el valor cambió, actualizar el componente
    if (value !== filteredValue && this.stdInputElement) {
      this.isUpdating = true;

      // Actualizar el valor del componente
      (this.stdInputElement as any).value = filteredValue;

      // Disparar un nuevo changeEvent con el valor filtrado
      setTimeout(() => {
        const changeEvent = new CustomEvent('changeEvent', {
          detail: filteredValue,
          bubbles: true,
        });
        this.stdInputElement?.dispatchEvent(changeEvent);
        this.isUpdating = false;
      }, 0);
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    let pastedText = clipboardData.getData('text') || '';

    // Filtrar solo caracteres alfanuméricos
    const filteredText = this.filterAlphanumeric(pastedText);

    // Si estamos trabajando con std-input
    if (this.stdInputElement) {
      const currentValue = (this.stdInputElement as any).value || '';
      const newValue = currentValue + filteredText;

      // Actualizar el valor del componente
      (this.stdInputElement as any).value = newValue;

      // Disparar changeEvent
      const changeEvent = new CustomEvent('changeEvent', {
        detail: newValue,
        bubbles: true,
      });
      this.stdInputElement.dispatchEvent(changeEvent);
    } else if (this.inputElement) {
      // Para input normal
      const start = this.inputElement.selectionStart || 0;
      const end = this.inputElement.selectionEnd || 0;
      const currentValue = this.inputElement.value || '';
      const newValue =
        currentValue.substring(0, start) +
        filteredText +
        currentValue.substring(end);

      this.inputElement.value = newValue;

      // Disparar eventos
      const inputEvent = new Event('input', { bubbles: true });
      this.inputElement.dispatchEvent(inputEvent);

      // Restaurar la posición del cursor
      setTimeout(() => {
        const newCursorPos = start + filteredText.length;
        this.inputElement?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  }

  private filterValue(target: HTMLInputElement): void {
    if (!target || !target.value) return;
    
    const value = String(target.value || '');
    const filteredValue = this.filterAlphanumeric(value);

    if (value !== filteredValue) {
      target.value = filteredValue;

      // Disparar evento de cambio
      const inputEvent = new Event('input', { bubbles: true });
      target.dispatchEvent(inputEvent);
    }
  }

  private filterAlphanumeric(value: any): string {
    // Asegurarse de que value sea un string
    if (typeof value !== 'string') {
      // Si es null o undefined, retornar string vacío
      if (value == null) {
        return '';
      }
      // Si es un objeto, intentar convertirlo a string
      if (typeof value === 'object') {
        // Si tiene una propiedad value, usarla
        if ('value' in value && typeof value.value === 'string') {
          value = value.value;
        } else if ('detail' in value && typeof value.detail === 'string') {
          value = value.detail;
        } else {
          // Si no, convertir a string
          value = String(value);
        }
      } else {
        value = String(value);
      }
    }

    const pattern = this.allowSpaces ? /[^a-zA-Z0-9 ]/g : /[^a-zA-Z0-9]/g;
    return value.replace(pattern, '');
  }
}

