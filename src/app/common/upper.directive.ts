import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUpper]',
  standalone: true
})
export class UpperDirective {

  constructor(private el: ElementRef) {}
  
  @HostListener('input',['$event']) 
  onInputChange(event: any) {    
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }

}
