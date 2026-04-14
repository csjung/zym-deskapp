import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Common } from '../../services/common';
import { Http } from '../../services/http';
import { CargoService } from '../../services/cargo-service';

@Component({
  selector: 'app-my-filter',
  imports: [
      CommonModule,
      FlexLayoutModule,
      MatButtonToggleModule,
  ],
  templateUrl: './my-filter.html',
  styleUrl: './my-filter.scss',
})
export class MyFilter {

  filterRef =inject<MatBottomSheetRef<MyFilter>>(MatBottomSheetRef);
  private common =inject(Common);
  private http =inject(Http);
  private cargoService =inject(CargoService);
  user = this.common.getMember();

  cargoTypes:any[] = ['전체','수입','수출','카고'];
  sizeTypes:any[] = ['전체'];
  workTypes: any[] = []; //작업

  myCargoTypes:any[] = [];
  mySizeTypes:any[] = [];
  myAreaList:any[] = [];

  constructor(
  ) {
   
    let param:any = {};
    this.http.postList(param, '/cntrType/getAllParam.do').subscribe((data) => {
      data.forEach(element => {
        this.sizeTypes.push(element.typeName);
      });
      
    });

    let user = this.common.getMember();
    let obj:any = {};
    obj.franchisesId = user.franchisesId;
    this.http.postList(obj, '/workType/getAllParam.do').subscribe((data) => {
      this.workTypes = data;
    });

  }

  ngOnInit(): void { 
    
  }

  get myFilter() {
    return this.cargoService.myFilterData();
  }

  close(event: MouseEvent): void {
    this.filterRef.dismiss();
    event.preventDefault();
  }

  init() {
    const filter:any = {};
    filter.carId = this.user.id;
    this.http.postObject(filter, '/myFilter/delAll.do').subscribe(obj => { 
      this.cargoService.setMyFilterDataSignal().subscribe((data) => {
        this.cargoService.myFilterData.set(data);       
      });
    });
  }

  filterSave() {
    this.filterRef.dismiss();
  }

  getClassStr(type:any, item:any) {
    let str = 'sel_item';
    let find = false;
    let typeFind = false;
    this.myFilter.forEach(element => {
      if (element.filterStr == item) {
        find = true;
      }
      if (element.filterType == type) {
        typeFind = true;
      }
    });
    if ('전체' == item) {
      if (typeFind) {
        str = 'sel_item';
      } else {
        str = 'sel_item on';
      }
    } else {
      if (find) {
        str = 'sel_item on';
      } else {
        str = 'sel_item';
      }
    }
    return str;
  }

  saveFilter(event: MouseEvent, type:any, item:any) {
    const element = event.target as HTMLElement; // 이벤트가 발생한 요소
    const classNames = element.className; // 클래스명을 문자열로 얻기
    const filter:any = {};    
    filter.filterStr = item;
    filter.filterType = type;
    filter.carId = this.user.id;
    if ('전체' == item) { // 모
      if (classNames.indexOf('on') < 1) {
        //모두 삭제
        this.http.postObject(filter, '/myFilter/delTypeAll.do').subscribe(obj => { 
          this.cargoService.setMyFilterDataSignal().subscribe((data) => {
            this.cargoService.myFilterData.set(data);       
          });
        });
      }
    } else {
      if (classNames.indexOf('on') < 1) {
        console.log('저장');
        this.http.postObject(filter, '/myFilter/save.do').subscribe(obj => { 
          this.cargoService.setMyFilterDataSignal().subscribe((data) => {
            this.cargoService.myFilterData.set(data);
          });
        });
      } else {
        // 삭제       
        this.http.postObject(filter, '/myFilter/delObject.do').subscribe(obj => { 
          this.cargoService.setMyFilterDataSignal().subscribe((data) => {
            this.cargoService.myFilterData.set(data);       
          });
        });
      }
    }
  }


}
