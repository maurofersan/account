# Implementación de Account MFE

## Estructura del Proyecto

La implementación sigue la misma estructura que el proyecto OTP, aplicando principios SOLID y Clean Code.

### Servicios Core

#### 1. AccountStoreService

- **Ubicación**: `src/app/core/services/account-store.service.ts`
- **Descripción**: Servicio de estado global usando Angular Signals
- **Características**:
  - Manejo de estado reactivo con signals
  - Estado inmutable con computed properties
  - Acciones para actualizar el estado
  - Validaciones de completitud de pasos

#### 2. AccountApiService

- **Ubicación**: `src/app/core/services/account-api.service.ts`
- **Descripción**: Servicio para comunicación con el backend
- **Endpoints**:
  - `getAvailableAccounts()`: Obtiene cuentas disponibles
  - `getAvailableCurrencies()`: Obtiene monedas disponibles
  - `selectAccount()`: Selecciona una cuenta con moneda específica
  - `getAccountDetails()`: Obtiene detalles de una cuenta
  - `validateAccountSelection()`: Valida selección de cuenta

#### 3. TextService

- **Ubicación**: `src/app/core/services/text.service.ts`
- **Descripción**: Servicio para internacionalización
- **Características**:
  - Carga de textos desde archivos JSON
  - Interpolación de parámetros
  - Soporte para propiedades anidadas

### Interfaces

#### Account Interfaces

- **Ubicación**: `src/app/shared/interfaces/account.interfaces.ts`
- **Interfaces**:
  - `AccountState`: Estado global de la aplicación
  - `Account`: Información de una cuenta bancaria
  - `AccountFeature`: Características de una cuenta
  - `Currency`: Información de moneda
  - `AccountSelectionRequest`: Request para selección de cuenta
  - `AccountSelectionResponse`: Response de selección de cuenta

### Componentes Compartidos

#### 1. AccountNavigationComponent

- **Ubicación**: `src/app/shared/components/account-navigation/`
- **Descripción**: Componente de navegación con botón de retroceso
- **Características**:
  - Color del botón: #127277 (como especificado en Figma)
  - Metodología BEM

#### 2. AccountTitleSectionComponent

- **Ubicación**: `src/app/shared/components/account-title-section/`
- **Descripción**: Componente de título con soporte para prefix, highlight y suffix
- **Características**:
  - Soporte para highlight en color #dc3545
  - Estilos responsivos

#### 3. AccountCardComponent

- **Ubicación**: `src/app/shared/components/account-card/`
- **Descripción**: Tarjeta de cuenta con radio button personalizado
- **Características**:
  - Radio button personalizado con estado seleccionado
  - Imagen de fondo con badge
  - Lista de características con checkmarks
  - Animaciones y transiciones
  - Diseño mobile-first

#### 4. CurrencySelectorComponent

- **Ubicación**: `src/app/shared/components/currency-selector/`
- **Descripción**: Selector de moneda con botones
- **Características**:
  - Botones estilo segmented control
  - Estado seleccionado con color verde
  - Soporte para múltiples monedas

### Páginas

#### 1. SelectAccountPageComponent

- **Ruta**: `/cuenta/seleccionar-cuenta`
- **Descripción**: Pantalla de selección de cuenta
- **Características**:
  - Slider horizontal con tarjetas de cuenta
  - Radio buttons personalizados para selección
  - Selector de moneda
  - Botón de continuar habilitado solo cuando se selecciona cuenta y moneda
  - Datos mock para demostración

#### 2. AccountSummaryPageComponent

- **Ruta**: `/cuenta/resumen-cuenta`
- **Descripción**: Pantalla de resumen y confirmación
- **Características**:
  - Secciones organizadas: datos personales, domicilio, contacto, nueva cuenta
  - Campos de solo lectura y editables
  - Checkbox de consentimiento con links destacados
  - Toast notification para validaciones
  - Botón de continuar habilitado solo con consentimiento

### Directivas

#### 1. StdButtonDirective

- **Ubicación**: `src/app/shared/directives/std-button.directive.ts`
- **Descripción**: Directiva para integrar std-button con Angular Forms
- **Implementa**: ControlValueAccessor

#### 2. StdRadioGroupDirective

- **Ubicación**: `src/app/shared/directives/std-radio-group.directive.ts`
- **Descripción**: Directiva para integrar std-radio-group con Angular Forms
- **Implementa**: ControlValueAccessor

### Componentes de Stencil Utilizados

#### 1. std-button

- **Uso**: Botones principales de acción
- **Características**: Soporte para loading, disabled, eventos click

#### 2. std-radio-group

- **Uso**: Grupos de radio buttons (si se necesita)
- **Características**: Manejo de selección múltiple

#### 3. std-toast

- **Uso**: Notificaciones de estado
- **Características**: Diferentes tipos de status (info, success, error)

### Internacionalización

#### Archivo de Textos

- **Ubicación**: `src/assets/i18n/es.json`
- **Estructura**:
  ```json
  {
    "account": {
      "select-account": {
        "title": {
          "prefix": "...",
          "highlight": "..."
        },
        "subtitle": "...",
        "currencyQuestion": "...",
        "continueButton": "..."
      },
      "account-summary": {
        "title": {
          "prefix": "...",
          "highlight": "..."
        },
        "personalData": {...},
        "address": {...},
        "contactData": {...},
        "newAccount": {...},
        "consent": {...}
      },
      "common": {...}
    }
  }
  ```

### Rutas

```typescript
/cuenta
  /seleccionar-cuenta
  /resumen-cuenta
```

### Estilos

#### Metodología BEM

Todos los componentes siguen la metodología BEM (Block Element Modifier):

- Block: `.select-account-page`
- Element: `.select-account-page__container`
- Modifier: `.select-account-page__continue-btn--disabled`

#### Colores

- Background principal: `#f8f9fa`
- Botón "Volver": `#127277` (como especificado en Figma)
- Texto highlight: `#dc3545`
- Éxito/selección: `#28a745`
- Error: `#dc3545`
- Información: `#007bff`

### Funcionalidad Implementada

#### Características de la Pantalla de Selección

1. **Slider horizontal**: Tarjetas de cuenta con scroll horizontal
2. **Radio buttons personalizados**: Con estado visual de selección
3. **Selector de moneda**: Botones estilo segmented control
4. **Validación de estado**: Botón habilitado solo con selección completa
5. **Datos mock**: Cuentas de ejemplo con características realistas

#### Características de la Pantalla de Resumen

1. **Secciones organizadas**: Datos personales, domicilio, contacto, nueva cuenta
2. **Campos mixtos**: Algunos de solo lectura, otros editables
3. **Consentimiento**: Checkbox con links destacados en azul
4. **Toast notification**: Para validaciones y feedback
5. **Validación**: Botón habilitado solo con consentimiento

### Principios Aplicados

#### SOLID

- **Single Responsibility**: Cada componente tiene una única responsabilidad
- **Open/Closed**: Los componentes son extensibles sin modificar el código existente
- **Liskov Substitution**: Los componentes pueden ser sustituidos por sus subtipos
- **Interface Segregation**: Interfaces específicas para cada necesidad
- **Dependency Inversion**: Dependencias inyectadas, no hardcodeadas

#### Clean Code

- Nombres descriptivos y significativos
- Funciones pequeñas y enfocadas
- Comentarios JSDoc para documentación
- Manejo de errores consistente
- Código DRY (Don't Repeat Yourself)

### Componentes de Stencil Disponibles

La librería de stencil incluye los siguientes componentes relevantes:

- `std-button`: Botón personalizado
- `std-radio-group`: Grupo de radio buttons
- `std-slider`: Slider básico
- `std-slider-large`: Slider grande
- `std-toast`: Notificaciones toast
- `ui-radio-button`: Radio button de UI

### Próximos Pasos

1. Integrar con el backend real
2. Implementar validaciones avanzadas
3. Agregar animaciones de transición
4. Implementar pruebas unitarias y e2e
5. Optimizar rendimiento
6. Agregar soporte para múltiples idiomas
7. Implementar funcionalidad de slider con radio buttons más avanzada

### Notas Importantes

- No se modificó nada del proyecto OTP
- Se siguió la misma estructura y convenciones
- Se utilizaron componentes de stencil-library sin modificarlos
- Se aplicó metodología BEM para todos los estilos
- Se implementó manejo de estado con Angular Signals
- Se siguieron las mejores prácticas de Angular standalone components
- Se eliminó la carpeta `account` dentro de `features` y se reorganizó la estructura
- Se crearon las carpetas `select-account` y `account-summary` como features separadas
