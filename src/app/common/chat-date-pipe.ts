import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate',
})
export class ChatDatePipe implements PipeTransform {

  constructor(        
    private datePipe: DatePipe,
  ) {
  }

  transform(inputDate: Date): string | null {
    let ret:string | null = "";
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if (inputDate >= startOfToday && inputDate < startOfTomorrow) {
      // 오늘 작성된 글
      return this.datePipe.transform(inputDate, "aaa hh:mm");
    } else if (inputDate >= startOfYesterday && inputDate < startOfToday) {
      // 어제 작성된 글
      return '어제';
    } else {
      // 그 이전에 작성된 글
      return this.datePipe.transform(inputDate, "yyyy-MM-dd");
    }
  }

}