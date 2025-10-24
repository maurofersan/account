import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefixAsset',
  standalone: true
})
export class PrefixAssetPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    
    // Si ya tiene el prefijo, lo devuelve tal como está
    if (value.startsWith('http') || value.startsWith('/')) {
      return value;
    }
    
    // Agrega el prefijo base para assets
    return `/${value}`;
  }
}
