import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Common } from '../../services/common';
import { Http } from '../../services/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

declare var kakao: any;

@Component({
  selector: 'app-loc-find',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  templateUrl: './loc-find.html',
  styleUrl: './loc-find.scss',
})
export class LocFind {

  private common = inject(Common);
  private http = inject(Http);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  map:any;
  marker: any;
  carCargo:any = {};
  carList:any[] = [];
  transMember:any = {};
  
  carControl = new FormControl('');
  carOptions!: Observable<any[] | string[]>;

  constructor(
  ) {

    let obj:any = {}; 
    obj.carControl = "Y";
    this.http.postList(obj, '/transMember/getAllParam.do').subscribe((data) => {
      this.carList = data;
      this.carOptions = this.carControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });

    setTimeout(() => {
      let mapContainer = document.getElementById('map'); // 지도를 표시할 div
      let mapOption = {
        center: new kakao.maps.LatLng(36.135462527, 128.33884735200027), // 지도의 중심좌표
        level: 12, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(mapContainer, mapOption);   
     }, 1000); 
  }

  ngOnInit(): void { 
    
  }

  search() {
    this.carCargo = {};
    this.transMember = {};
    if (this.marker)  this.marker.setMap(null);
    const car:any = this.carControl.value;
    if (car && car.id) {
      this.http.postList({carNum:car.carNum}, '/cargo/ingJob.do').subscribe(obj => {      
        this.carCargo = obj;
        this.changeDetectorRef.markForCheck();  
      });
      this.http.getObject('/transMember/getOne.do/' + car.id).subscribe((data) => {
        this.transMember = data;    
        this.setMarkList();  
      });
    }
    
  }

  setMarkList() {
      let imageSrc = '/img/common/car.png';
      let imageSize = new kakao.maps.Size(50, 50);
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, new kakao.maps.Point(27, 69));

      let position = new kakao.maps.LatLng(this.transMember.latitude, this.transMember.longitude);
      this.marker = new kakao.maps.Marker({
        map: this.map,
        position: position,
        image: markerImage,
        clickable: true,
      });
      this.marker.setMap(this.map);
    }

  _filter(value: string): any[] {
    return this.carList.filter(option => option.carNum.includes(value));
  }

  displayCar(car: any): string {
    return car && car.carNum ? car.carNum : '';
  }
}
