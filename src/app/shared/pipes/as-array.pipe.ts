import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asArray',
  standalone: true
})
export class AsArrayPipe implements PipeTransform {
  transform<T = any>(value: any): T[] {
    if (Array.isArray(value)) return value as T[];
    if (Array.isArray(value?.data)) return value.data as T[];
    if (Array.isArray(value?.rows)) return value.rows as T[];
    return [] as T[];
  }
}
