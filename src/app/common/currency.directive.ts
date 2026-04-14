import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCurrency]',
  standalone: true
})
export class CurrencyDirective {

  @Input() appCurrency?: string;
  
  constructor(private el: ElementRef,
    private decimalPipe: DecimalPipe,
    private renderer: Renderer2) {
    //this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'gray');
  }

  @HostListener('keydown',['$event']) onKeydown(event: any) {
    let k = event.key;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArroDown','Backspace','Tab','Alt','Shift','Control','Enter','Delete','Meta'].includes(event.key)) return;
    var re = /^[0-9 ()-]+$/;
    if(!re.test(k)) {
      event.preventDefault();
    }
  }

  @HostListener('keyup',['$event']) onKeyup(event: any) {    
    let k=event.target.value;
    k = k.replace(/,/gi, ""); 
    k = this.decimalPipe.transform(k);
    event.target.value = k;
  }
}
