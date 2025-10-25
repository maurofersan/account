import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
// import { MountPathService } from '@ng-darwin-wmf/microfront';
// import { ConfigService } from '@ng-darwin/config';

export interface Texts {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TextService {
  private _texts: Texts = {};
  private _currentLanguage = 'es';
  // private _configService = inject(ConfigService);

  constructor(private _http: HttpClient,
    /* private mountPathService: MountPathService, */
  ) {}

  /**
   * Gets text by key with fallback support
   */
  getText(key: string, params?: { [key: string]: string | number }): string {
    const text = this._getNestedProperty(this._texts, key) || key;
    return this._interpolateParams(text, params);
  }

  /**
   * Loads texts from API with fallback to local assets
   */
  loadTexts(language: string = 'es'): Observable<any> {
    this._currentLanguage = language;
    // const technicalGrouping = this._configService.config.technicalGrouping;
    // const url = `${technicalGrouping}/assets/i18n/${language}.json`;
    const url = `/assets/i18n/${language}.json`;

    return this._http.get<any>(url).pipe(
      map((texts) => {
        this._texts = { ...this._texts, ...texts };
        console.log(texts, 'ttessssx');
        return this._texts;
      })
    );
  }

  /**
   * Sets current language
   */
  setLanguage(language: string): void {
    this._currentLanguage = language;
    this.loadTexts(language);
  }

  /**
   * Gets current language
   */
  getCurrentLanguage(): string {
    return this._currentLanguage;
  }

  private _getNestedProperty(obj: any, path: string): string {
    const result = path.split('.').reduce((current, key) => current?.[key], obj);
    // Ensure we always return a string
    return typeof result === 'string' ? result : path;
  }

  private _interpolateParams(
    text: string,
    params?: { [key: string]: string | number; }
  ): string {
    // Ensure text is a string before calling replace
    if (typeof text !== 'string') {
      return typeof text === 'object' ? JSON.stringify(text) : String(text);
    }

    if (!params) {
      return text;
    }

    return text.replace(/\{(\w+)\}/g, (match, key) =>
      params[key]?.toString() || match
    );
  }
}
