import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTime]',
  standalone: true
})
export class TimeDirective {

  constructor() {
   }


  @HostListener('keydown',['$event']) onKeydown(event: any) { 
    if(['ArrowLeft','ArrowRight','ArrowUp','ArroDown','Backspace','Tab','Alt','Shift','Control','Enter','Delete','Meta'].includes(event.key)) return;
    let k = event.target.value + event.key;
    if (k.length > 5) {
      event.preventDefault();
    } else {
      var re = /^[0-9]+$/;
      if(!re.test(event.key)) {
        event.preventDefault();
      }
    }
    
  }

  @HostListener('keyup',['$event']) onKeyup(event: any) {   
    if(['ArrowLeft','ArrowRight','ArrowUp','ArroDown','Backspace','Tab','Alt','Shift','Control','Enter','Delete','Meta'].includes(event.key)) return; 
    let k=event.target.value;
    if (event.target.value.length == 2) {
      event.target.value = k + ':';
    }
  }

}
