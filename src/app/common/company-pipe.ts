import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'company',
})
export class CompanyPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (value) {
      value = value.replace(/주식회사/gi, ""); 
      value = value.replace(/\(주\)/gi, ""); 
      value = value.replace( /(^\s*)|(\s*$)/g, "" );
    }
    return value;
  }
}
