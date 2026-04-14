import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Http } from '../../services/http';
import { Common } from '../../services/common';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { CompanyPipe } from '../../common/company-pipe';
import { CurrencyDirective } from '../../common/currency.directive';
import { UpperDirective } from '../../common/upper.directive';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TimeDirective } from '../../common/time.directive';
import { CargoService } from '../../services/cargo-service';

@Component({
  selector: 'app-cargo-input',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    CompanyPipe,
    CurrencyDirective,
    UpperDirective,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    TimeDirective,
  ],
  templateUrl: './cargo-input.html',
  styleUrl: './cargo-input.scss',
})
export class CargoInput {

  private fb = inject(FormBuilder);
  cargoService: CargoService = inject(CargoService);

  cargo: any = {};
  cheongguList:any[] = [];
  cheongguOptions!: Observable<any[] | string[]>;

  ownerList:any[] = [];
  ownerOptions!: Observable<any[] | string[]>;

  areaList:any[] = [];
  areaOptions!: Observable<any[] | string[]>;

  putPlaceList:any[] = [];
  putPlaceOptions1!: Observable<any[] | string[]>;
  putPlaceOptions2!: Observable<any[] | string[]>;

  carList:any[] = [];
  carOptions!: Observable<any[] | string[]>;

  workTypeList:any[] = [];
  workTypeOptions!: Observable<any[] | string[]>;

  form = this.fb.group({
    inDate: [new Date(), Validators.compose([Validators.required, ]), ],    
    inTime: [null, [] ],  
    cheongguObj: new FormControl(),  
    cargoOwnerObj: new FormControl(),  
    area: new FormControl(),  
    damdang: ["", [] ],  
    addr: [null, Validators.compose([]), ],
    cargoType: ['수입', [] ], 
    container: [null, [] ], 
    caravan: new FormControl(),
    quit: new FormControl(),
    youngcha: ['자차', [] ], 
    car: new FormControl(),
    carNum: new FormControl(),  
    transComp: new FormControl(),
    cargoSize: new FormControl(null, Validators.compose([])),
    weight: [null, Validators.compose([]), ],
    workType: new FormControl(""),
    departType: new FormControl(""),
    price: ['', [] ],
    etcPrice: ['', [] ],
    fallPrice: ['', Validators.compose([]), ],
    status: ["접수", [] ],
    carRemark: [null, [] ],
    priceRemark: [null, [] ],
    blno: [null, [] ], 
    houseBlno: [null, [] ], 
    
    dono: [null, [] ],
    bkno: [null, [] ], 
    sealNo: [null, [] ],


  });

  digitFlag = false;
  status: any[] = ["접수","배차완료","전송완료", "배차취소","작업완료"]; 

  priceValue1 = 0;
  priceValue2 = 0;
  priceValue3 = 0;
  priceValue4 = 0;
  priceValue5 = 0;
  priceValue6 = 0;
  feeFlag2 = false;
  feeFlag3:any = null;
  feeFlag4:any = null;
  licenseType = false;
  selfType = false;
  franchises:any = {};

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private common: Common,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private router: Router,
  ) {

  }

  get f () {
    return this.form.controls;
  }

  ngOnInit(): void {
    let user = this.common.getMember();

    this.f.youngcha.valueChanges.subscribe((data) => {
      if (data == '자차') {
        this.f.transComp.setValue(null);
      } else if (data == '용차') {
        this.f.car.setValue(null);
      } else {
        this.f.transComp.setValue(null);
        this.f.car.setValue(null);
        this.f.carNum.setValue(null);
      }
    });

    this.http.getObject('/franchises/getOne.do/' + user.franchisesId).subscribe((data) => {
      this.franchises = data;
      if (data && data.cargoEndDay) {
        this.franchises.cargoEndDay = this.datePipe.transform(data.cargoEndDay, 'yyyy-MM-dd');
      } 
    });

    let obj:any = {};
    obj.franchisesId = user.franchisesId;
    obj.useYn = "Y";    
    
    this.http.postObject(obj, '/partner/getAllParam.do').subscribe(results => {
      this.cheongguList = results; 
      this.cheongguOptions = this.f.cheongguObj.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.cheongguList.slice();
        }),
      ); 
    });  

    this.http.postObject(obj, '/cargoOwner/getAllParam.do').subscribe(results => {  
      this.ownerList = results; 
      this.ownerOptions = this.f.cargoOwnerObj.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.company;
          return name ? this._filter(name as string) : this.ownerList.slice();
        }),
      ); 
    });  

    this.http.postObject(obj, '/area/getAllParam.do').subscribe(results => {
      this.areaList = results; 
      this.areaOptions = this.f.area.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.areaName;
          return name ? this._filter3(name as string) : this.areaList.slice();
        }),
      ); 
    });  

    this.http.postList(obj, '/putPlace/getAllParam.do').subscribe((data) => {
      this.putPlaceList = data; 
      this.putPlaceOptions1 = this.f.caravan.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.placeName;
          return name ? this._filter4(name as string) : this.putPlaceList.slice();
        }),
      );
      this.putPlaceOptions2 = this.f.quit.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.placeName;
          return name ? this._filter4(name as string) : this.putPlaceList.slice();
        }),
      );
    }); 

    this.http.postList(obj, '/car/getAllParam.do').subscribe((data) => {
      this.carList = data; 
      this.carOptions = this.f.car.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.carNum;
          return name ? this._filter5(name as string) : this.carList.slice();
        }),
      );
    });

    this.http.postList(obj, '/workType/getAllParam.do').subscribe((data) => {
      this.workTypeList = data;       
    });

    let id = this.route.snapshot.paramMap.get('id');
    this.http.getObject('/cargo/getOne.do/' + id).subscribe((data) => {
      this.cargo = data; 
      this.form.patchValue(this.cargo);
      if (this.cargo.damdangTel) {
        if (this.cargo.damdang) this.f.damdang.setValue(this.cargo.damdang + ' ' + this.cargo.damdangTel);
        else this.f.damdang.setValue(this.cargo.damdangTel);
      }
      if (this.cargo.inDate) {
        let inDate = new Date(this.cargo.inDate);
        this.f.inDate.setValue(inDate);
      } 

      const weight:any = this.decimalPipe.transform(this.cargo.weight);
      this.f.weight.setValue(weight);
      const price:any = this.decimalPipe.transform(this.cargo.price);
      this.f.price.setValue(price);
      const etcPrice:any = this.decimalPipe.transform(this.cargo.etcPrice);
      this.f.etcPrice.setValue(etcPrice);
      const fallPrice:any = this.decimalPipe.transform(this.cargo.fallPrice);
      this.f.fallPrice.setValue(fallPrice);

       if (this.cargo.caravan && this.cargo.quit) {
        let obj1 = this.http.postObject({placeName: this.cargo.caravan}, '/putPlace/getPlace.do');
        let obj2 = this.http.postObject({placeName: this.cargo.quit}, '/putPlace/getPlace.do');
        forkJoin([obj1, obj2]).subscribe(results => {
          if (results[0]) {
            this.f.caravan.setValue(results[0]);
          } else {
            this.f.caravan.setValue(this.cargo.caravan);
          }
          if (results[1]) {
             this.f.quit.setValue(results[1]);
          } else {
            this.f.quit.setValue(this.cargo.quit);
          }
          if (  (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산') > -1) && (this.form.value.quit?.groupName?.indexOf('부산') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) )  {
            this.feeFlag4 = this.form.value.caravan?.groupName;
          }
          if (  (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산신항') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('부산신항') > -1)) )  {
            this.feeFlag4 = '신항의왕';
          }
          if (  (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산북항') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('부산북항') > -1)) )  {
            this.feeFlag4 = '북항의왕';          
          }
          this.calFee();
        });
      }

      if (this.cargo?.cargoOwnerObject) {
        this.f.cargoOwnerObj.setValue(this.cargo?.cargoOwnerObject);
      } else {
        this.f.cargoOwnerObj.setValue(this.cargo?.cargoOwner);
      }

      if (this.cargo?.area) {
        this.f.area.setValue(this.cargo?.area);
      }

      if (this.cargo?.cargoType=='수입') {
        this.f.blno.setValue(this.cargo?.cargoInbound?.blno);
        this.f.houseBlno.setValue(this.cargo?.cargoInbound?.houseBlno);
        this.f.dono.setValue(this.cargo?.cargoInbound?.dono);
        if (this.cargo?.workType == '셔틀') {
          this.f.sealNo.setValue(this.cargo?.cargoOutbound?.sealNo);
          this.f.bkno.setValue(this.cargo?.cargoOutbound?.bkno);
        }
      } else  if (this.cargo?.cargoType=='수출') {
        this.f.bkno.setValue(this.cargo?.cargoOutbound?.bkno);
        this.f.sealNo.setValue(this.cargo?.cargoOutbound?.sealNo);        
      } else {
        this.f.bkno.setValue(this.cargo?.cargoInland?.bkno);
      }

      if (this.cargo?.carId) {
        this.f.car.setValue(this.cargo?.car);
      } else {        
        this.f.carNum.setValue(this.cargo?.carNum);
        this.f.car.setValue(null);
      }

      if ('면허' == this.cargo?.licenseType) {
        this.licenseType = true;
      } else {
        this.licenseType = false;
      }
      if ('자가' == this.cargo?.selfType) {
        this.selfType = true;
      } else {
        this.selfType = false;
      }
    }); 
     
  }

  onSave() {
    const value:any =  this.form.value;
    if (value.cheonggu && !value.cheonggu?.id) {
      alert("청구처는 반드시 검색 후 선택 입력하셔야 됩니다.");
      return;
    }
    if (this.form.value.inDate && this.endCheck()) {
      alert('현황에 마감 이전 데이터는 수정 불가 입니다.관리자에게 문의 바랍니다.');
      return;
    }
    let user = this.common.getMember();
    let d = new Date();
    Object.assign(this.cargo, value);
    this.cargo.updateId = user.id;
    this.cargo.updateDate = d;
    this.cargo.inDate = this.datePipe.transform(value.inDate, 'yyyy-MM-dd');

    if (value.cheongguObj) {
      this.cargo.cheonggu = value.cheongguObj?.name;
      this.cargo.cheongguId = value.cheongguObj?.id;
    }
    if (value.cargoOwnerObj) {
      if (value.cargoOwnerObj.id) {
        this.cargo.cargoOwner = value.cargoOwnerObj.company;
        this.cargo.cargoOwnerId = value.cargoOwnerObj.id;
      } else {
        this.cargo.cargoOwner = value.cargoOwnerObj;
        this.cargo.cargoOwnerId = null;
        this.cargo.cargoOwnerObj = null;
      }
    } else {
      this.cargo.cargoOwner = null;
      this.cargo.cargoOwnerId = null;
      this.cargo.cargoOwnerObj = null;
    }
    if (value.transComp) {
      this.cargo.transCompId = value.transComp.id;
    } else {
      this.cargo.transCompId = null;
    }
    
    if (value.area) {
      if (value.area.id) {
        this.cargo.area = value.area.areaName;
      } else {
        this.cargo.area = value.area;
      }
    }
    if (value.caravan) {
      if (value.caravan.id) {
        this.cargo.caravan = value.caravan.groupName + " " + value.caravan.placeName;
      } else {
        this.cargo.caravan = value.caravan;
      }
    }
    if (value.quit) {
      if (value.quit.id) {
        this.cargo.quit = value.quit.groupName + " " +  value.quit.placeName;
      } else {
        this.cargo.quit = value.quit;
      }
    }

    if (value.youngcha == '자차') {
      if (value.car) {
        if (value.car.id) {
          this.cargo.carId = value.car.id;
          this.cargo.carNum = value.car.carNum;
        } else {
          this.cargo.carId = null;
          this.cargo.carNum = null;
        }
      } else {
        this.cargo.carId = null;
        this.cargo.carNum = null;
      }
      this.cargo.transCompId = null;
    } else if (value.youngcha == '용차') {
      if (value.carNum) {
        this.cargo.carId = null;
        this.cargo.carNum = value.carNum;
      } else {
        this.cargo.carId = null;
        this.cargo.carNum = null;
      }      
    } else { // 공유
      if (!value.carNum) {
        this.cargo.carId = null;
      }      
    }

    this.cargo.car = null;
    this.cargo.transComp = null;

    if (value.price) this.cargo.price = Number(value.price.replace(/,/gi, ""));
    if (value.etcPrice) this.cargo.etcPrice = Number(value.etcPrice.replace(/,/gi, ""));
    if (value.weight) this.cargo.weight = Number(value.weight.replace(/,/gi, ""));
    if (value.fallPrice) this.cargo.fallPrice = Number(value.fallPrice.replace(/,/gi, ""));  

    if (value.cargoType == '수입') {
      let cargoInbound:any = {};
      if (this.cargo?.cargoInboundId) cargoInbound.id = this.cargo?.cargoInboundId;
      cargoInbound.blno = value.blno;
      cargoInbound.houseBlno = value.houseBlno;
      if(value.line) cargoInbound.line = value.line.toUpperCase();
      cargoInbound.dono = value.dono;
      this.cargo.cargoInbound = cargoInbound;
      if (this.cargo.workType != '셔틀') {
        this.cargo.cargoOutbound = null;
        this.cargo.cargoOutboundId = null;
      }
      this.cargo.cargoInland = null;
      this.cargo.cargoInlandId = null;
    } else if (value.cargoType == '수출') {
      let cargoOutbound:any = {};
      if (this.cargo?.cargoOutboundId) cargoOutbound.id = this.cargo?.cargoOutboundId;
      cargoOutbound.bkno = value.bkno;
      cargoOutbound.sealNo = value.sealNo;
      this.cargo.cargoOutbound = cargoOutbound;
      this.cargo.cargoInbound = null;
      this.cargo.cargoInboundId = null;
      this.cargo.cargoInland = null;
      this.cargo.cargoInlandId = null;
    } else {
      let cargoInland:any = {};
      if (this.cargo?.cargoInlandId) cargoInland.id = this.cargo?.cargoInlandId;
      cargoInland.bkno = value.bkno;
      this.cargo.cargoInland = cargoInland;
      this.cargo.cargoInbound = null;
      this.cargo.cargoInboundId = null;
      this.cargo.cargoOutbound = null;
      this.cargo.cargoOutboundId = null;
    }
    if (this.licenseType) {
      this.cargo.licenseType = '면허';
    } else {
      this.cargo.licenseType = '';
    }
    if (this.selfType) {
      this.cargo.selfType = '자가';
    } else {
      this.cargo.selfType = '';
    }

    if (!this.cargo.createId || this.cargo.createId == 'f7e3790e-b843-4a90-8eac-1d25ba659717') {
      this.cargo.createId = user.id;
      this.cargo.createDate = d;
    }
    if (!this.cargo.priceDate) {
      let lastDayOfMonth;
      d = new Date(this.cargo.inDate);
      lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      this.cargo.priceDate = this.datePipe.transform(lastDayOfMonth, 'yyyy-MM-dd');
      this.cargo.pricetwoDate = this.datePipe.transform(lastDayOfMonth, 'yyyy-MM-dd');
    }      
    this.cargo.damdangTel = '';
    let lastDayOfMonth;
    d = new Date(this.cargo.inDate);
    lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    this.cargo.priceDate = this.datePipe.transform(lastDayOfMonth, 'yyyy-MM-dd');
    this.cargo.pricetwoDate = this.datePipe.transform(lastDayOfMonth, 'yyyy-MM-dd');
    this.http.postObject(this.cargo, '/cargo/update.do').subscribe(obj => { 
      this.cargoService.setCargoDataSignal();
      this.router.navigate(['/pages/cargo-list/' + this.datePipe.transform(new Date(this.cargo.inDate), 'yyyy-MM-dd')]);
    });
  }

   endCheck():boolean {
    let flag = false;
    if (this.franchises.cargoEndDay) {
      let endDay = null; 
      if (this.franchises.cargoEndDay._d) {
        endDay = this.datePipe.transform(this.franchises.cargoEndDay._d, 'yyyyMMdd');
      } else {
        endDay = this.franchises.cargoEndDay.replace(/-/gi, "");
      }      
      let inDate:any = this.datePipe.transform(this.form.value.inDate, 'yyyyMMdd');
      if(Number(inDate) <= Number(endDay)) {          
        flag = true;
      }
    }
    return flag;
  } 

   _filter(value: string): any[] {
    return this.cheongguList.filter(option => option.name?.includes(value));
  }

  _filter2(value: string): any[] {
    return this.ownerList.filter(option => option.company?.includes(value));
  }

  _filter3(value: string): any[] {
    return this.areaList.filter(option => option.areaName?.includes(value));
  }

  _filter4(value: string): any[] {
    return this.putPlaceList.filter(option => option.placeName.includes(value));
  }

  _filter5(value: string): any[] {
    return this.carList.filter(option => option.carNum.includes(value));
  }
  

  displayFn(partner: any): string {
    if (partner) {
      if (partner.name) {
        return partner.name;
      } else {
        return partner;
      }
    } else {
      return "";
    }
  }

  displayOwner(cargoOwner: any): string {
    return cargoOwner && cargoOwner.company ? cargoOwner.company : cargoOwner;
  }

  displayArea(area: any): string {
    return area && area.areaName ? area.areaName : area;
  }

  displayPutPlace(putPlace: any): string {
    return putPlace && putPlace.placeName ? putPlace.groupName + " " + putPlace.placeName : putPlace;
  }

  displayCar(car: any): string {
    return car && car.carNum ? car.carNum : '';
  }

  checkDigit() {
    setTimeout(() => {
      let contno:any = this.f.container.value;
      if (contno) {
        if (contno.length == 11) {
          this.digitFlag = false;
          this.http.getObject('/cargo/checkDigit.do/' + contno).subscribe(obj => {
            if (!obj) {              
              this.digitFlag = true;
            } 
          });
        } else {        
          this.digitFlag = true;
        }
      } else {
        this.digitFlag = false;
      }
    }, 500);
  }

  calFee() {    
    const value:any =  this.form.value;
    this.priceValue1 = 0;
    this.priceValue2 = 0;
    this.priceValue3 = 0;
    this.priceValue4 = 0;
    this.priceValue5 = 0;
    this.priceValue6 = 0;    
    if (value.area && value.cargoSize) {
      let user = this.common.getMember();
      let obj: any = {};  
      obj.franchisesId = user.franchisesId;
      obj.cargoSize = value.cargoSize;
      if (value.area.id) {
        obj.area = value.area.areaName;
      } else {
        obj.area = value.area;
      }
      if (value.caravan) {
        if (value.caravan.id) {
          obj.caravan = value.caravan.groupName;
        } else {
          obj.caravan = value.caravan;
        }        
      } else {
        obj.caravan = '';
      }

      if (value.quit) {
        if (value.quit.id) {
          obj.quit = value.quit.groupName;
        } else {
          obj.quit = value.quit;
        }        
      } else {
        obj.quit = '';
      }
      obj.carPriceKindId = "39c1ef16-53f4-4e6f-811e-4fd4317143e2";
      if ( ((this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산') > -1) && (this.form.value.quit?.groupName?.indexOf('부산') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)))  ||
         ((this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산신항') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('부산신항') > -1)))  ||
         ((this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산북항') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('부산북항') > -1))) ) {
        if (this.feeFlag4) {
          obj.placeDiff = this.feeFlag4;        
        } else {
          if (  (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산') > -1) && (this.form.value.quit?.groupName?.indexOf('부산') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) )  {
            this.feeFlag4 = this.form.value.caravan?.groupName;
          }
          if (  (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산신항') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('부산신항') > -1)) )  {
            this.feeFlag4 = '신항의왕';
          }
          if (  (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('부산북항') > -1) && (this.form.value.quit?.groupName?.indexOf('인천') > -1)) 
                 || (this.form.value.caravan?.groupName != this.form.value.quit?.groupName && (this.form.value.caravan?.groupName?.indexOf('인천') > -1) && (this.form.value.quit?.groupName?.indexOf('부산북항') > -1)) )  {
            this.feeFlag4 = '북항의왕';          
          }
          obj.placeDiff = this.feeFlag4;
        } 
      } else {
        this.feeFlag4 = '';        
      }

      this.http.postObject(obj, '/carPrice/getFee.do').subscribe(data => {
        console.log('표준요금:', data);
        if (data) {
          if (this.feeFlag3 > 0 && this.feeFlag2) {
            let v1 = data.priceTwoFit40 * (this.feeFlag3 / 100);
            v1 = Math.round(v1 / 100) * 100;
            let v2 = data.priceThreeFit40 * (this.feeFlag3 / 100);
            v2 = Math.round(v2 / 100) * 100;
            let v3 = data.priceOneFit40 * (this.feeFlag3 / 100);
            v3 = Math.round(v3 / 100) * 100;

            this.priceValue1 = data.priceTwoFit40 + v1;
            this.priceValue2 = data.priceThreeFit40 + v2;
            this.priceValue3 = data.priceOneFit40 + v3;
            this.priceValue4 = 0;
            this.priceValue5 = 0;
            this.priceValue6 = 0;

          } else if (this.feeFlag3 > 0 && !this.feeFlag2) {
            this.priceValue4 = data.priceTwoFit40 * (this.feeFlag3 / 100);
            this.priceValue4 = Math.round(this.priceValue4 / 100) * 100;
            this.priceValue5 = data.priceThreeFit40 * (this.feeFlag3 / 100);
            this.priceValue5 = Math.round(this.priceValue5 / 100) * 100;
            this.priceValue6 = data.priceOneFit40 * (this.feeFlag3 / 100);
            this.priceValue6 = Math.round(this.priceValue6 / 100) * 100;

            this.priceValue1 = data.priceTwoFit40 ;
            this.priceValue2 = data.priceThreeFit40;
            this.priceValue3 = data.priceOneFit40;
          } else {
            this.priceValue1 = data.priceTwoFit40;
            this.priceValue2 = data.priceThreeFit40;
            this.priceValue3 = data.priceOneFit40;
            this.priceValue4 = 0;
            this.priceValue5 = 0;
            this.priceValue6 = 0;
          }
        }
      });  
    }
  }

  setPrice(value: any) {
    this.f.price.setValue(this.decimalPipe.transform(value));
    this.f.fallPrice.setValue(this.decimalPipe.transform(this.priceValue3));
  }

  setPrice2(value: any) {
    this.f.fallPrice.setValue(this.decimalPipe.transform(value));
  }

}
