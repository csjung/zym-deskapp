import { effect, inject, Injectable, signal } from '@angular/core';
import { CargoInfo } from '../pages/cargo-list/cargo-info';
import { Observable } from 'rxjs';
import { Http } from './http';
import { Common } from './common';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CargoService {

  private common =inject(Common);
  private http =inject(Http);
  private datePipe=inject(DatePipe);  
  user = this.common.getMember();
  
  myFilterData = signal([] as any[]);
  cargoData = signal([] as any[]);

  inDate = signal(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  searchWord = signal('');
  searchLine = signal('');
  loading = signal(false);

  protected cargoList: CargoInfo[] = [
  ]

  constructor() {
    this.setMyFilterDataSignal().subscribe((data) => {
      this.myFilterData.set(data);       
    });

    effect(() => {
      if (this.myFilterData()) {        
        this.setCargoDataSignal();
      }   
    }, );
  }

  get CargoDataSignal():any[] {
    return this.cargoData();
  }

  setMyFilterDataSignal() {
    let param:any = {};
    param.carId = this.user.id;
    return this.http.postList(param, '/myFilter/getAllParam.do');
  }



  getCargoInfoById(id: string): CargoInfo | undefined {
    return this.cargoList.find((cargoInfo) => cargoInfo.id === id);
  }

  setCargoDataSignal() {
    this.loading.set(true);
    let user = this.common.getMember();
    let obj:any = {};
    obj.franchisesId = user.franchisesId;
    obj.inDateFrom = this.inDate();
    obj.inDateTo = this.inDate();
    obj.cargofilter = this.searchWord();
    obj.cargofilter = obj.cargofilter ? obj.cargofilter.toUpperCase() : '';
    obj.cargoFlag = 'FCL';
    obj.filterId = this.user.id;
    obj.line = this.searchLine();
    
    this.http.postList(obj,'/cargo/getAllParam.do').subscribe((data) => {
      this.cargoData.set(data);  
      // this.changeDetectorRef.markForCheck();  
      this.loading.set(false);
    });
  }

}
